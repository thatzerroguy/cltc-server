import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { ForwardFileDto } from './dto/forward-file.dto';
import { ActionFileDto } from './dto/action-file.dto';
import { FileStatus, WorkflowStatus, SubRole } from 'generated/prisma/client';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: DatabaseService) {}

  async upload(userId: string, dto: UploadFileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { department: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const file = await this.prisma.file.create({
      data: {
        name: dto.name,
        file_uri: dto.file_uri,
        owner_id: user.id,
        origin_department_id: user.department_id,
        current_department_id: user.department_id,
        status: FileStatus.PENDING,
      },
    });

    // Create initial log
    await this.prisma.fileLog.create({
      data: {
        file_id: file.id,
        user_id: user.id,
        from_department_id: user.department_id,
        to_department_id: user.department_id,
        status: FileStatus.PENDING,
      },
    });

    // Create initial workflow entry
    await this.prisma.workFlow.create({
      data: {
        file_id: file.id,
        department_id: user.department_id,
        status: WorkflowStatus.PENDING,
      },
    });

    return file;
  }

  async forward(userId: string, fileId: string, dto: ForwardFileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });
    if (!file) throw new NotFoundException('File not found');

    // Permissions check
    if (
      file.current_department_id !== user.department_id &&
      file.owner_id !== user.id
    ) {
      throw new ForbiddenException(
        'You do not have permission to forward this file',
      );
    }

    // Forwarding rules
    if (
      user.sub_role === SubRole.SECRETARY ||
      user.sub_role === SubRole.STAFF
    ) {
      if (dto.target_department_id !== user.department_id) {
        throw new ForbiddenException(
          'Staff/Secretary can only forward to their own Head of Department',
        );
      }
    } else if (user.sub_role === SubRole.HEAD) {
      // HOD can forward to other HODs, DG, or their own staff
      // If target_department_id is the same, they are likely forwarding to staff
    } else if (user.sub_role !== SubRole.DG) {
      // Other roles check
    }

    const updatedFile = await this.prisma.file.update({
      where: { id: fileId },
      data: {
        current_department_id: dto.target_department_id,
        status: FileStatus.FORWARDED,
      },
    });

    await this.prisma.fileLog.create({
      data: {
        file_id: file.id,
        user_id: user.id,
        from_department_id: user.department_id,
        to_department_id: dto.target_department_id,
        to_user_id: dto.target_user_id,
        status: FileStatus.FORWARDED,
      },
    });

    await this.prisma.workFlow.create({
      data: {
        file_id: file.id,
        department_id: dto.target_department_id,
        user_id: dto.target_user_id,
        status: WorkflowStatus.PENDING,
      },
    });

    return updatedFile;
  }

  async approve(userId: string, fileId: string, dto: ActionFileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });
    if (!file) throw new NotFoundException('File not found');

    // Only HOD of current department or DG can approve
    if (
      user.sub_role !== SubRole.DG &&
      (user.sub_role !== SubRole.HEAD ||
        user.department_id !== file.current_department_id)
    ) {
      throw new ForbiddenException(
        'Only the Head of Department or DG can approve this file',
      );
    }

    const updatedFile = await this.prisma.file.update({
      where: { id: fileId },
      data: {
        status: FileStatus.APPROVED,
      },
    });

    await this.prisma.fileLog.create({
      data: {
        file_id: file.id,
        user_id: user.id,
        from_department_id: user.department_id,
        to_department_id: user.department_id,
        status: FileStatus.APPROVED,
      },
    });

    await this.prisma.workFlow.updateMany({
      where: {
        file_id: file.id,
        department_id: file.current_department_id,
        status: WorkflowStatus.PENDING,
      },
      data: {
        status: WorkflowStatus.APPROVED,
      },
    });

    return updatedFile;
  }

  async reject(userId: string, fileId: string, dto: ActionFileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });
    if (!file) throw new NotFoundException('File not found');

    if (
      user.sub_role !== SubRole.DG &&
      (user.sub_role !== SubRole.HEAD ||
        user.department_id !== file.current_department_id)
    ) {
      throw new ForbiddenException(
        'Only the Head of Department or DG can reject this file',
      );
    }

    // Find previous workflow step
    const workflowHistory = await this.prisma.workFlow.findMany({
      where: { file_id: file.id },
      orderBy: { timestamp: 'desc' },
      skip: 1, // Current one is at 0
      take: 1,
    });

    const previousDeptId =
      workflowHistory.length > 0
        ? workflowHistory[0].department_id
        : file.origin_department_id;

    const updatedFile = await this.prisma.file.update({
      where: { id: fileId },
      data: {
        status: FileStatus.REJECTED,
        current_department_id: previousDeptId,
      },
    });

    await this.prisma.fileLog.create({
      data: {
        file_id: file.id,
        user_id: user.id,
        from_department_id: user.department_id,
        to_department_id: previousDeptId,
        status: FileStatus.REJECTED,
      },
    });

    // Mark current workflow as rejected
    await this.prisma.workFlow.updateMany({
      where: {
        file_id: file.id,
        department_id: file.current_department_id,
        status: WorkflowStatus.PENDING,
      },
      data: {
        status: WorkflowStatus.REJECTED,
      },
    });

    // Create new workflow entry for the department it returned to
    await this.prisma.workFlow.create({
      data: {
        file_id: file.id,
        department_id: previousDeptId,
        status: WorkflowStatus.PENDING,
      },
    });

    return updatedFile;
  }

  async getFileLogs(fileId: string) {
    return this.prisma.fileLog.findMany({
      where: { file_id: fileId },
      include: {
        user: { include: { profile: true } },
        from_department: true,
        to_department: true,
      },
      orderBy: { timestamp: 'asc' },
    });
  }

  async getMyDepartmentFiles(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.file.findMany({
      where: {
        OR: [
          { current_department_id: user.department_id },
          { owner_id: user.id },
        ],
      },
      include: {
        owner: { include: { profile: true } },
        origin_department: true,
        current_department: true,
      },
      orderBy: { updated_at: 'desc' },
    });
  }

  async getFileDetails(fileId: string) {
    return this.prisma.file.findUnique({
      where: { id: fileId },
      include: {
        owner: { include: { profile: true } },
        origin_department: true,
        current_department: true,
        file_logs: {
          include: {
            user: { include: { profile: true } },
            from_department: true,
            to_department: true,
          },
          orderBy: { timestamp: 'desc' },
        },
        workflows: {
          include: { department: true },
          orderBy: { timestamp: 'desc' },
        },
      },
    });
  }
}
