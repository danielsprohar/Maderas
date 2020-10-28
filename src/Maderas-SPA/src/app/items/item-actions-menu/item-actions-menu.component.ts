import { Component, Input, OnInit } from '@angular/core';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-item-actions-menu',
  templateUrl: './item-actions-menu.component.html',
  styleUrls: ['./item-actions-menu.component.css'],
})
export class ItemActionsMenuComponent implements OnInit {
  // @Input() itemIndex = 0;
  private itemIndex: number;

  public faEllipsisH = faEllipsisH;

  constructor() {}

  ngOnInit(): void {}

  // =========================================================================

  @Input()
  get index(): number {
    return this.itemIndex;
  }

  set index(i: number) {
    this.itemIndex = i;
  }

  // =========================================================================

  toggleMenuVisibility(): void {
    document
      .getElementById(this.index.toString())
      .classList.toggle('is-active');
  }
}
