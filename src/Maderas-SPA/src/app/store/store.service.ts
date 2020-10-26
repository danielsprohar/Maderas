import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Board } from '../models/board';
import { Item } from '../models/item';
import { List } from '../models/list';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  public readonly boardSubject = new BehaviorSubject<Board>(null);
  public readonly listSubject = new BehaviorSubject<List>(null);
  public readonly itemSubject = new BehaviorSubject<Item>(null);

  constructor() {}
}
