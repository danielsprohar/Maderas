import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-item-actions-menu',
  templateUrl: './item-actions-menu.component.html',
  styleUrls: ['./item-actions-menu.component.css'],
})
export class ItemActionsMenuComponent implements OnInit {

  @Input() item: Item;

  @Output() editItemEvent = new EventEmitter<Item>();

  public faEllipsisH = faEllipsisH;

  constructor() {}

  ngOnInit(): void {
  }

  // =========================================================================

  edit(): void {
    this.editItemEvent.emit(this.item);
  }

}
