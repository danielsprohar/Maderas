import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Board } from 'src/app/models/board';
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
  // =========================================================================
}
