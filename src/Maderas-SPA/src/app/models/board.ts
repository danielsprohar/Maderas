export class Board {
  // tslint:disable-next-line: variable-name
  _id: string;
  title: string;

  /**
   * The object id of the User that this Board belongs to.
   */
  user: string;

  constructor(fields: { _id?: string; title: string; user?: string }) {
    Object.assign(this, fields);
  }
}
