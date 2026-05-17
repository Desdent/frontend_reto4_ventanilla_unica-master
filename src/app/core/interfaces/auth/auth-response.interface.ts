import { CompleteUser } from '../../models/user/complete-user';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: CompleteUser;
  };
}
