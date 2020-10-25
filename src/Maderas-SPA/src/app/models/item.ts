export class Item {
  // tslint:disable-next-line: variable-name
  _id: string;
  title: string;
  description: string;
  dueDate: Date;

  /**
   * The object id of the list that this item belongs to.
   */
  list: string;

  constructor(fields: {
    _id?: string;
    title: string;
    description?: string;
    dueDate?: Date;
    list?: string;
  }) {
    Object.assign(this, fields);
  }
}
