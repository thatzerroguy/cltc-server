import { SetMetadata } from '@nestjs/common';

export const SUB_ROLES_KEY = 'sub_roles';

export type sub_Role =
  | 'DG'
  | 'HEAD'
  | 'SECRETARY'
  | 'STAFF'
  | 'COURSE_COORDINATOR'
  | 'COURSE_INSTRUCTOR';

export const SubRoles = (...sub_roles: sub_Role[]) =>
  SetMetadata(SUB_ROLES_KEY, sub_roles);
