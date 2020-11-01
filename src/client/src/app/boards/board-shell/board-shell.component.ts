import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  faAlignJustify,
  faClock,
  faEdit,
  faEllipsisH,
} from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { EditItemComponent } from 'src/app/items/edit-item/edit-item.component';
import { Board } from 'src/app/models/board';
import { Item } from 'src/app/models/item';
import { List } from 'src/app/models/list';
import { DataService } from 'src/app/services/data.service';
import { PaginatedResponse } from 'src/app/wrappers/paginated-response';
import { EditBoardComponent } from '../edit-board/edit-board.component';

@Component({
  selector: 'app-board-shell',
  templateUrl: './board-shell.component.html',
  styleUrls: ['./board-shell.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BoardShellComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  @ViewChild(EditItemComponent)
  private readonly editItemComponent: EditItemComponent;

  @ViewChild(EditBoardComponent)
  private readonly editBoardComponent: EditBoardComponent;

  public faEdit = faEdit;
  public faEllipsisH = faEllipsisH;
  public faAlignJustify = faAlignJustify;
  public faClock = faClock;

  public board$: Observable<Board>;
  public lists: List[];
  public item: Item;

  constructor(
    private readonly listService: DataService<List>,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.board$ = this.route.data.pipe(
      map((data: { board: Board }) => {
        this.fetchLists(data.board._id);
        return data.board;
      })
    );
  }

  // =========================================================================

  fetchLists(boardId: string): void {
    const sub = this.listService
      .getAll(`/lists?board=${boardId}`)
      .pipe(map((res: PaginatedResponse<List>) => res.data))
      .subscribe((data: List[]) => {
        this.lists = data;
      });

    this.subscriptions.push(sub);
  }

  // =========================================================================

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  // =========================================================================

  /**
   * Handles the event that is emitted by the `CreateListComponent`.
   * @param list The `Board` that was just created.
   */
  handleNewListEvent(list: List): void {
    this.lists.push(list);
  }

  // =========================================================================

  /**
   * Handles the event that is emitted by the `CreateItemComponent`.
   * @param item The `Item` that was just created.
   */
  handleNewItemEvent(item: Item): void {
    const list = this.lists.find((l) => l._id === item.list);
    list.items.push(item);
  }

  // =========================================================================

  /**
   * Handles the event that is emitted by the `ItemActionsMenuComponent`.
   * @param item The `Item` to edit.
   */
  handleEditItem(item: Item): void {
    this.editItemComponent.setItem(item);

    const modal = document.getElementById('editItemModal');
    modal.style.display = 'block';
  }

  // =========================================================================

  /**
   * Handles the event that is emitted by the `EditItemComponent`.
   * @param item The `Item` that was updated.
   */
  handleItemUpdatedEvent(item: Item): void {
    const list = this.lists.find((l) => l._id === item.list);
    const idx = list.items.findIndex((i) => i._id === item._id);
    list.items[idx] = item;
    list.items = [...list.items];
  }

  // =========================================================================

  closeEditItemModal(): void {
    const modal = document.getElementById('editItemModal');
    modal.style.display = 'none';
  }

  // =========================================================================

  openEditBoardModal(board: Board): void {
    this.editBoardComponent.setBoard(board);

    const modal = document.getElementById('editBoardModal');
    modal.style.display = 'block';
  }

  // =========================================================================

  closeEditBoardModal(): void {
    const modal = document.getElementById('editBoardModal');
    modal.style.display = 'none';
  }

  // =========================================================================

  toggleCreateListComponent(): void {
    const div = document.getElementById('newListFormBox');
    div.classList.toggle('is-hidden');

    const button = document.getElementById(`createListBtn`);
    button.classList.toggle('is-hidden');
  }

  // =========================================================================

  toggleCreateItemComponent(index: number): void {
    const div = document.getElementById(index.toString());
    div.classList.toggle('is-hidden');

    const button = document.getElementById(`button${index}`);
    button.classList.toggle('is-hidden');
  }
}