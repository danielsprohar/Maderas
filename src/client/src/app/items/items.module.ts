import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { CreateItemComponent } from './create-item/create-item.component';
import { ItemDetailsComponent } from './item-details/item-details.component';

@NgModule({
  declarations: [CreateItemComponent, ItemDetailsComponent],
  imports: [CommonModule, SharedModule, MaterialModule],
  exports: [CreateItemComponent, ItemDetailsComponent],
  providers: [MatDatepickerModule],
})
export class ItemsModule {}
