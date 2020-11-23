import { List } from './list';

export class Board {
  // tslint:disable-next-line: variable-name
  _id: string;
  title: string;

  /**
   * The object id of the User that this Board belongs to.
   */
  user: string;

  lists: List[];
  createdAt: Date;
  updatedAt: Date;

  constructor(fields: {
    _id?: string;
    title: string;
    user?: string;
    lists?: List[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, fields);
  }
}
