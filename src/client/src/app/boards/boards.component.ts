import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { EditItemComponent } from '../items/edit-item/edit-item.component';
import { EditListComponent } from '../lists/edit-list/edit-list.component';
import { Board } from '../models/board';
import { Item } from '../models/item';
import { List } from '../models/list';
import { DataService } from '../services/data.service';
import { PaginatedResponse } from '../wrappers/paginated-response';
import { EditBoardComponent } from './edit-board/edit-board.component';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
})
export class BoardsComponent implements OnInit, OnDestroy {
  private fetchListsSubscription: Subscription;
  private moveItemSubscription: Subscription;
  private boardId: string;

  @ViewChild(EditItemComponent)
  private readonly editItemComponent: EditItemComponent;

  @ViewChild(EditBoardComponent)
  private readonly editBoardComponent: EditBoardComponent;

  @ViewChild(EditListComponent)
  private readonly editListComponent: EditListComponent;

  public board$: Observable<Board>;
  public lists: List[];
  public item: Item;

  constructor(
    private readonly listsService: DataService<List>,
    private readonly itemsService: DataService<Item>,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.board$ = this.route.data.pipe(
      map((data: { board: Board }) => {
        this.boardId = data.board._id;
        this.fetchLists(data.board._id);
        return data.board;
      })
    );
  }

  // =========================================================================

  fetchLists(boardId: string): void {
    this.fetchListsSubscription = this.listsService
      .getAll(`/lists?board=${boardId}`)
      .pipe(map((res: PaginatedResponse<List>) => res.data))
      .subscribe((data: List[]) => {
        this.lists = data;
      });
  }

  // =========================================================================

  ngOnDestroy(): void {
    if (this.fetchListsSubscription) {
      this.fetchListsSubscription.unsubscribe();
    }
    if (this.moveItemSubscription) {
      this.moveItemSubscription.unsubscribe();
    }
  }

  // =========================================================================
  // Board methods
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
  // List methods
  // =========================================================================

  toggleCreateListComponent(): void {
    const div = document.getElementById('newListFormBox');
    div.classList.toggle('hidden');

    const button = document.getElementById('createListBtn');
    button.classList.toggle('hidden');
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

  handleListUpdatedEvent(list: List): void {
    const i = this.lists.findIndex((l) => l._id === list._id);
    this.lists[i] = list;
  }

  // =========================================================================

  openEditListModal(list: List): void {
    this.editListComponent.setList(list);
    const modal = document.getElementById('editListModal');
    modal.style.display = 'block';
  }

  // =========================================================================

  closeEditListModal(): void {
    const modal = document.getElementById('editListModal');
    modal.style.display = 'none';
  }

  // =========================================================================
  // Item methods
  // =========================================================================

  handleDeletedItemEvent(item: Item): void {
    const list = this.lists.find((l) => l._id === item.list);
    const itemIndex = list.items.findIndex((i) => i._id === item._id);
    list.items.splice(itemIndex, 1);
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

  toggleCreateItemComponent(index: number): void {
    const div = document.getElementById(index.toString());
    div.classList.toggle('hidden');

    const button = document.getElementById(`button${index}`);
    button.classList.toggle('hidden');
  }

  // =========================================================================

  drop(event: CdkDragDrop<Item[]>, to: string): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const item = event.previousContainer.data[event.previousIndex];
    const from = item.list;
    const path = `/items/${item._id}/move`;

    const params = new HttpParams().set('from', from).set('to', to);

    this.moveItemSubscription = this.itemsService
      .update(path, null, params)
      .subscribe(
        () => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        },
        (err) => {
          // TODO: Show the snackbar service.
        }
      );
  }
}
