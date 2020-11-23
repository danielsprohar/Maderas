export class DialogData {
  message: string;
  confirmed: boolean;

  constructor(message?: string) {
    this.message = message || 'Are you sure?';
    this.confirmed = true;
  }
}
