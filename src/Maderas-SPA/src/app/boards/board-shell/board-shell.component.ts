import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Board } from 'src/app/models/board';
import { Item } from 'src/app/models/item';
import { List } from 'src/app/models/list';
import { DataService } from 'src/app/services/data.service';
import { StoreService } from 'src/app/store/store.service';
import { PaginatedResponse } from 'src/app/wrappers/paginated-response';

@Component({
  selector: 'app-board-shell',
  templateUrl: './board-shell.component.html',
  styleUrls: ['./board-shell.component.css'],
})
export class BoardShellComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  public board$: Observable<Board>;
  public lists: List[];

  constructor(
    private readonly store: StoreService,
    private readonly listService: DataService<List>
  ) {}

  ngOnInit(): void {
    const sub = this.listService
      .getAll('/lists')
      .pipe(map((res: PaginatedResponse<List>) => res.data))
      .subscribe((data: List[]) => {
        this.lists = data;
        const board = this.store.getBoard();
        board.lists = data;
        this.store.setBoard(board);
      });

    this.subscriptions.push(sub);

    this.board$ = this.store.getBoardAsObservable();
  }

  // =========================================================================

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  // =========================================================================

  addList(list: List): void {
    this.lists.push(list);
  }

  // =========================================================================

  addItem(listId: string, item: Item): void {
    if (!listId || !item) {
      return;
    }

    const list = this.lists.find((l) => l._id === listId);
    if (!list) {
      return;
    }

    list.items.push(item);
  }

  // =========================================================================

  toggleListComponent(): void {
    const div = document.getElementById('newListFormBox');
    div.classList.toggle('is-hidden');

    const button = document.getElementById(`createListBtn`);
    button.classList.toggle('is-hidden');
  }

  // =========================================================================

  toggleItemComponent(index: number): void {
    const div = document.getElementById(index.toString());
    div.classList.toggle('is-hidden');

    const button = document.getElementById(`button${index}`);
    button.classList.toggle('is-hidden');
  }
}
