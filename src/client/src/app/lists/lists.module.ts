import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateListComponent } from './create-list/create-list.component';
import { SharedModule } from '../shared/shared.module';
import { EditListComponent } from './edit-list/edit-list.component';

@NgModule({
  declarations: [CreateListComponent, EditListComponent],
  imports: [CommonModule, SharedModule],
  exports: [CreateListComponent, EditListComponent],
})
export class ListsModule {}
