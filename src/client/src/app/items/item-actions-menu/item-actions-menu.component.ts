import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item';
import { DataService } from 'src/app/services/data.service';
import { SnackbarMessageType } from 'src/app/shared/snackbar/snackbar-message-type';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

@Component({
  selector: 'app-item-actions-menu',
  templateUrl: './item-actions-menu.component.html',
  styleUrls: ['./item-actions-menu.component.css'],
})
export class ItemActionsMenuComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Input() item: Item;

  @Output() deletedItemEvent = new EventEmitter<Item>();
  @Output() editItemEvent = new EventEmitter<Item>();

  public faEllipsisH = faEllipsisH;

  constructor(
    private readonly itemsService: DataService<Item>,
    private readonly snackbar: SnackbarService
  ) {}

  ngOnInit(): void {}

  // =========================================================================

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // =========================================================================

  delete(): void {
    if (!this.item) {
      this.snackbar.show('No item selected', SnackbarMessageType.Info);
      return;
    }

    const path = `/items/${this.item._id}`;
    this.subscription = this.itemsService.remove(path).subscribe(
      (res) => {
        this.snackbar.show('Item was deleted', SnackbarMessageType.Success);
        this.deletedItemEvent.emit(this.item);
      },
      (err) => this.snackbar.show(err, SnackbarMessageType.Danger)
    );
  }

  // =========================================================================

  edit(): void {
    this.editItemEvent.emit(this.item);
  }
}
