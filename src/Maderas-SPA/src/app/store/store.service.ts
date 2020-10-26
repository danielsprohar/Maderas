import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from '../models/board';
import { Item } from '../models/item';
import { List } from '../models/list';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly boardKey = 'board';
  private readonly listKey = 'list';
  private readonly itemKey = 'item';

  private readonly boardSubject = new BehaviorSubject<Board>(null);
  private readonly listSubject = new BehaviorSubject<List>(null);
  private readonly itemSubject = new BehaviorSubject<Item>(null);

  constructor() {}

  // =========================================================================
  // Get & setters for Board
  // =========================================================================

  clearBoard(): void {
    localStorage.removeItem(this.boardKey);
    this.boardSubject.next(null);
  }

  getBoard(): Board {
    const board = JSON.parse(localStorage.getItem(this.boardKey)) as Board;
    if (!board) {
      return null;
    }

    if (board && this.boardSubject.value) {
      return board;
    }

    // The board was in local storage but not in the BehaviorSubject ...
    // maybe the user refreshed the page ... handle it.
    this.boardSubject.next(board);
    return board;
  }

  getBoardAsObservable(): Observable<Board> {
    this.boardSubject.next(this.getBoard());
    return this.boardSubject.asObservable();
  }

  setBoard(board: Board): void {
    localStorage.setItem(this.boardKey, JSON.stringify(board));
    this.boardSubject.next(board);
  }

  // =========================================================================
  // Getters & setters for List
  // =========================================================================

  clearList(): void {
    localStorage.removeItem(this.listKey);
    this.listSubject.next(null);
  }

  getList(): List {
    const list = JSON.parse(localStorage.getItem(this.listKey)) as List;
    if (!list) {
      return null;
    }

    if (list && this.listSubject.value) {
      return list;
    }

    // The list was in local storage but not in the BehaviorSubject ...
    // maybe the user refreshed the page ... handle it.
    this.listSubject.next(list);
    return list;
  }

  getListAsObservable(): Observable<List> {
    this.listSubject.next(this.getList());
    return this.listSubject.asObservable();
  }

  setList(list: List): void {
    localStorage.setItem(this.listKey, JSON.stringify(list));
    this.listSubject.next(list);
  }

  // =========================================================================
  // Getters & setters for Item
  // =========================================================================

  clearItem(): void {
    localStorage.removeItem(this.itemKey);
    this.itemSubject.next(null);
  }

  getItem(): Item {
    const item = JSON.parse(localStorage.getItem(this.itemKey)) as Item;
    if (!item) {
      return null;
    }

    if (item && this.itemSubject.value) {
      return item;
    }

    // The item was in local storage but not in the BehaviorSubject ...
    // maybe the user refreshed the page ... handle it.
    this.itemSubject.next(item);
    return item;
  }

  getitemAsObservable(): Observable<Item> {
    this.itemSubject.next(this.getItem());
    return this.itemSubject.asObservable();
  }

  setitem(item: Item): void {
    localStorage.setItem(this.itemKey, JSON.stringify(item));
    this.itemSubject.next(item);
  }
}
