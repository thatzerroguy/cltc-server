export interface LoginResponse {
  id: string;
  username: string;
  first_name: string | undefined;
  last_name: string | undefined;
  email: string | undefined;
  role: string;
  sub_role: string;
  department_id: string;
  message: string;
  status: number;
  access_token: string;
  refresh_token: string;
}
