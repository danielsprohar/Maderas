import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CreateItemComponent } from './create-item/create-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { ItemActionsMenuComponent } from './item-actions-menu/item-actions-menu.component';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    CreateItemComponent,
    EditItemComponent,
    ItemActionsMenuComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatTooltipModule
  ],
  exports: [CreateItemComponent, EditItemComponent, ItemActionsMenuComponent],
  providers: [MatDatepickerModule],
})
export class ItemsModule {}
