import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item';
import { DataService } from 'src/app/services/data.service';

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

  constructor(
    private readonly itemsService: DataService<Item>,
    private readonly snackbar: MatSnackBar
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
      this.snackbar.open('No item selected', null, {
        panelClass: 'warn',
      });
      return;
    }

    // TODO: Open a confirmation dialog.

    const path = `/items/${this.item._id}`;
    this.subscription = this.itemsService.remove(path).subscribe(
      (res) => {
        this.snackbar.open('Item was deleted', null, {
          panelClass: 'success',
        });
        this.deletedItemEvent.emit(this.item);
      },
      (err) =>
        this.snackbar.open(err, null, {
          panelClass: 'danger',
        })
    );
  }

  // =========================================================================

  edit(): void {
    this.editItemEvent.emit(this.item);
  }
}
