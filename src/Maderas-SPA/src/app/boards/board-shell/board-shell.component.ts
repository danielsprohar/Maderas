import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { faAlignJustify, faClock, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { EditItemComponent } from 'src/app/items/edit-item/edit-item.component';
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
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BoardShellComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  @ViewChild(EditItemComponent)
  private readonly editItemComponent: EditItemComponent;

  public faEllipsisH = faEllipsisH;
  public faAlignJustify = faAlignJustify;
  public faClock = faClock;

  public board$: Observable<Board>;
  public lists: List[];
  public item: Item;

  constructor(
    private readonly store: StoreService,
    private readonly listService: DataService<List>,
    private readonly changeDetectorRef: ChangeDetectorRef
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
    this.store.setList(list);
    this.lists.push(list);
  }

  // =========================================================================

  addItem(item: Item): void {
    if (!item) {
      return;
    }

    const list = this.lists.find((l) => l._id === this.store.getList()._id);
    const index = list.items.findIndex((i) => i._id === item._id);
    list.items[index] = item;
    this.store.setList(list);
    this.changeDetectorRef.markForCheck();
  }

  // =========================================================================

  /**
   * Handles the event that is emitted by the `ItemActionsMenuComponent`
   * @param item The Item to edit
   */
  handleEditItem(item: Item): void {
    this.store.setItem(item);
    this.editItemComponent.setItem(item);

    const modal = document.getElementById('editItemModal');
    modal.style.display = 'block';
  }

  // =========================================================================

  closeModal(): void {
    const modal = document.getElementById('editItemModal');
    modal.style.display = 'none';
  }

  // =========================================================================

  toggleListComponent(): void {
    const div = document.getElementById('newListFormBox');
    div.classList.toggle('is-hidden');

    const button = document.getElementById(`createListBtn`);
    button.classList.toggle('is-hidden');
  }

  // =========================================================================

  toggleItemComponent(list: List, index: number): void {
    if (list !== this.store.getList()) {
      this.store.setList(list);
    }

    const div = document.getElementById(index.toString());
    div.classList.toggle('is-hidden');

    const button = document.getElementById(`button${index}`);
    button.classList.toggle('is-hidden');
  }
}
