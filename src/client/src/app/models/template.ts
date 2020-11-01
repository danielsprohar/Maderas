import { List } from './list';

export class Template {
  // tslint:disable-next-line: variable-name
  _id: string;
  name: string;
  lists: List[];

  constructor(fields: { _id?: string; name: string; lists: List[] }) {
    Object.assign(this, fields);
  }
}
