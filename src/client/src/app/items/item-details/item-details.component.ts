import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from 'src/app/models/item';
import { List } from 'src/app/models/list';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css'],
})
export class ItemDetailsComponent implements OnInit {
  @Input() list: List;
  @Input() item: Item;
  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly itemsService: DataService<Item>
  ) {}

  ngOnInit(): void {
    // TODO: Implement this
  }

  // =========================================================================
  // =========================================================================
  // =========================================================================

  getItemDescriptionLines(): string[] {
    if (!this.item) {
      return [];
    }

    return this.item.description.split(/\r?\n/g);
  }

  // =========================================================================

  close(): void {
    this.closeModalEvent.emit(true);
  }

  // =========================================================================
}
