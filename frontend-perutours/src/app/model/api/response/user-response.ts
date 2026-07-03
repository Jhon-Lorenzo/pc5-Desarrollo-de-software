import { UserSesion } from '../../user-sesion';

export interface UserResponse {
  token: string;
  user: UserSesion;
  success: boolean;
  message?: string;
}
