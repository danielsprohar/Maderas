import { User } from '../../models/user';

export class AuthResponse {
  user: User;
  token: string;
}
