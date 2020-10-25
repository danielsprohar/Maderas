export class User {
  id: string;
  username: string;
  email: string;

  constructor(fields?: { id?: number; username?: string; email?: string }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
