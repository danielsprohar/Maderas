import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpParams } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemDetailsComponent } from '../items/item-details/item-details.component';
import { EditListComponent } from '../lists/edit-list/edit-list.component';
import { Board } from '../models/board';
import { Item } from '../models/item';
import { List } from '../models/list';
import { DataService } from '../services/data.service';
import { DialogData } from '../shared/dialog-data';
import { UserConfirmationDialogComponent } from '../shared/user-confirmation-dialog/user-confirmation-dialog.component';
import { PaginatedResponse } from '../wrappers/paginated-response';
import { EditBoardComponent } from './edit-board/edit-board.component';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
})
export class BoardsComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  @ViewChild(ItemDetailsComponent)
  private readonly itemDetailsComponent: ItemDetailsComponent;

  @ViewChild(EditBoardComponent)
  private readonly editBoardComponent: EditBoardComponent;

  @ViewChild(EditListComponent)
  private readonly editListComponent: EditListComponent;

  public board$: Observable<Board>;
  public lists: List[];
  public item: Item;

  constructor(
    private readonly boardsService: DataService<Board>,
    private readonly listsService: DataService<List>,
    private readonly itemsService: DataService<Item>,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
    private readonly renderer: Renderer2,
    private readonly dialog: MatDialog
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

  private fetchLists(boardId: string): void {
    const sub = this.listsService
      .getAll(`/lists?board=${boardId}`)
      .pipe(map((res: PaginatedResponse<List>) => res.data))
      .subscribe((data: List[]) => {
        this.lists = data;
      });

    this.subscriptions.push(sub);
  }

  // =========================================================================

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // =========================================================================
  // Board methods
  // =========================================================================

  private deleteBoard(id: string): void {
    const path = `/boards/${id}`;
    const sub = this.boardsService.remove(path).subscribe(
      () => {
        this.snackbar.open('Your board is no more', null, {
          panelClass: 'success',
        });

        this.router.navigate(['/dashboard/boards']);
      },
      (err) => {
        this.snackbar.open(err, null, {
          panelClass: 'danger',
        });
      }
    );

    this.subscriptions.push(sub);
  }

  // =========================================================================

  openDeleteBoardConfirmationDialog(boardId: string): void {
    const dialogRef = this.dialog.open(UserConfirmationDialogComponent, {
      data: new DialogData(),
    });

    const sub = dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteBoard(boardId);
      }
    });

    this.subscriptions.push(sub);
  }

  // =========================================================================

  openEditBoardModal(board: Board): void {
    this.editBoardComponent.setBoard(board);

    const modal = document.getElementById('editBoardModal');
    this.renderer.setStyle(modal, 'display', 'block');
  }

  // =========================================================================

  closeEditBoardModal(): void {
    const modal = document.getElementById('editBoardModal');
    this.renderer.setStyle(modal, 'display', 'none');
  }

  // =========================================================================
  // List methods
  // =========================================================================

  private deleteList(id: string): void {
    const path = `/lists/${id}`;
    const sub = this.listsService.remove(path).subscribe(
      () => {
        const i = this.lists.findIndex((list) => list._id === id);
        this.lists.splice(i, 1);

        this.snackbar.open('Your list was removed.', null, {
          panelClass: 'success',
        });
      },
      (err) => {
        this.snackbar.open(err, null, {
          panelClass: 'danger',
        });
      }
    );

    this.subscriptions.push(sub);
  }

  // =========================================================================

  openDeleteListConfirmationDialog(listId: string): void {
    const dialogRef = this.dialog.open(UserConfirmationDialogComponent, {
      data: new DialogData(),
    });

    const sub = dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteList(listId);
      }
    });

    this.subscriptions.push(sub);
  }

  // =========================================================================

  private clearList(id: string): void {
    const path = `/lists/${id}/clear-items`;
    const sub = this.listsService.update(path, null).subscribe(
      () => {
        const list = this.lists.find((l) => l._id === id);
        list.items.splice(0, list.items.length);

        this.snackbar.open('Your list was cleared.', null, {
          panelClass: 'success',
        });
      },
      (err) => {
        this.snackbar.open(err, null, {
          panelClass: 'danger',
        });
      }
    );

    this.subscriptions.push(sub);
  }

  // =========================================================================

  openClearListConfirmationDialog(listId: string): void {
    const dialogRef = this.dialog.open(UserConfirmationDialogComponent, {
      data: new DialogData(),
    });

    const sub = dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.clearList(listId);
      }
    });

    this.subscriptions.push(sub);
  }

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

  /**
   * Handles the event that is emitted by the `EditListComponent`.
   * @param list The `List` that was just updated.
   */
  handleListUpdatedEvent(list: List): void {
    const i = this.lists.findIndex((l) => l._id === list._id);
    this.lists[i] = list;
  }

  // =========================================================================

  openEditListModal(list: List): void {
    this.editListComponent.setList(list);
    const modal = document.getElementById('editListModal');
    this.renderer.setStyle(modal, 'display', 'block');
  }

  // =========================================================================

  closeEditListModal(): void {
    const modal = document.getElementById('editListModal');
    this.renderer.setStyle(modal, 'display', 'none');
  }

  // =========================================================================
  // Item methods
  // =========================================================================

  openItemDetailsModal(list: List, item: Item): void {
    if (!list || !item) {
      return;
    }

    this.itemDetailsComponent.list = list;
    this.itemDetailsComponent.setItem(item);

    const modal = document.getElementById('viewItemModal');
    this.renderer.setStyle(modal, 'display', 'block');
  }

  // =========================================================================

  private removeItem(listId: string, itemId: string): void {
    const list = this.lists.find((l) => l._id === listId);
    const i = list.items.findIndex((item) => item._id === itemId);
    list.items.splice(i, 1);
  }

  // =========================================================================

  private deleteItem(listId: string, itemId: string): void {
    const path = `/items/${itemId}`;
    const sub = this.itemsService.remove(path).subscribe(
      () => {
        this.removeItem(listId, itemId);
      },
      (err) => {
        this.snackbar.open(err, null, {
          panelClass: 'danger',
        });
      }
    );

    this.subscriptions.push(sub);
  }

  // =========================================================================

  openDeleteItemConfirmationDialog(listId: string, itemId: string): void {
    const dialogRef = this.dialog.open(UserConfirmationDialogComponent, {
      data: new DialogData(),
    });

    const sub = dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteItem(listId, itemId);
      }
    });

    this.subscriptions.push(sub);
  }

  // =========================================================================

  closeItemDetailsModal(): void {
    const modal = document.getElementById('viewItemModal');
    this.renderer.setStyle(modal, 'display', 'none');
  }

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

  toggleCreateItemComponent(index: number): void {
    const div = document.getElementById(index.toString());
    div.classList.toggle('hidden');

    const button = document.getElementById(`button${index}`);
    button.classList.toggle('hidden');
  }

  // =========================================================================

  drop(event: CdkDragDrop<Item[]>, dest: string): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const item = event.previousContainer.data[event.previousIndex];
    const src = item.list;
    const path = `/items/${item._id}/move`;

    const params = new HttpParams().set('src', src).set('dest', dest);

    const sub = this.itemsService.update(path, null, params).subscribe(
      () => {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      },
      (err) => {
        this.snackbar.open(err, null, {
          panelClass: 'danger',
        });
      }
    );

    this.subscriptions.push(sub);
  }
}
