import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateItemComponent } from './create-item/create-item.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CreateItemComponent],
  imports: [CommonModule, SharedModule],
  exports: [CreateItemComponent],
})
export class ItemsModule {}
