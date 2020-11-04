import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateListComponent } from './create-list/create-list.component';
import { SharedModule } from '../shared/shared.module';
import { EditListComponent } from './edit-list/edit-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [CreateListComponent, EditListComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  exports: [CreateListComponent, EditListComponent],
})
export class ListsModule {}
