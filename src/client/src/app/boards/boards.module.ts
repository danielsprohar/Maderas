import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsComponent } from './boards.component';
import { SharedModule } from '../shared/shared.module';
import { CreateBoardComponent } from './create-board/create-board.component';
import { ListsModule } from '../lists/lists.module';
import { ItemsModule } from '../items/items.module';
import { EditBoardComponent } from './edit-board/edit-board.component';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [BoardsComponent, CreateBoardComponent, EditBoardComponent],
  imports: [
    CommonModule,
    BoardsRoutingModule,
    SharedModule,
    ListsModule,
    ItemsModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatDividerModule
  ],
})
export class BoardsModule {}
