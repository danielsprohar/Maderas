import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateItemComponent } from './create-item/create-item.component';
import { SharedModule } from '../shared/shared.module';
import { EditItemComponent } from './edit-item/edit-item.component';
import { ItemActionsMenuComponent } from './item-actions-menu/item-actions-menu.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    CreateItemComponent,
    EditItemComponent,
    ItemActionsMenuComponent,
  ],
  imports: [CommonModule, SharedModule, MatButtonModule, MatIconModule],
  exports: [CreateItemComponent, EditItemComponent, ItemActionsMenuComponent],
})
export class ItemsModule {}
