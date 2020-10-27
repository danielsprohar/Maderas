import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateItemComponent } from './create-item/create-item.component';
import { SharedModule } from '../shared/shared.module';
import { EditItemComponent } from './edit-item/edit-item.component';

@NgModule({
  declarations: [CreateItemComponent, EditItemComponent],
  imports: [CommonModule, SharedModule],
  exports: [CreateItemComponent, EditItemComponent],
})
export class ItemsModule {}
