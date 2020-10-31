import { Item } from './item';

export class List {
  // tslint:disable-next-line: variable-name
  _id: string;
  title: string;

  /**
   * The object id of the board that this List belongs to.
   */
  board: string;

  items: Item[];

  constructor(fields: {
    _id?: string;
    title: string;
    board?: string;
    items?: Item[];
  }) {
    Object.assign(this, fields);
  }
}
