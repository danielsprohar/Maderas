export class RegisterModel {
  username: string;
  email: string;
  password: string;

  constructor(fields: { username?: string; email: string; password: string }) {
    Object.assign(this, fields);
  }
}
