import { List } from './list';

export class Template {
  // tslint:disable-next-line: variable-name
  _id: string;
  name: string;
  lists: List[];
  user: string;
  description: string;

  constructor(fields: {
    _id?: string;
    name: string;
    lists: List[];
    user: string;
    description?: string;
  }) {
    Object.assign(this, fields);
  }
}
