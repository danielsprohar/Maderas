import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateListComponent } from './create-list/create-list.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [CreateListComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CreateListComponent
  ]
})
export class ListsModule { }
