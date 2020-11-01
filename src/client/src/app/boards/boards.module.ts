import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsComponent } from './boards.component';
import { SharedModule } from '../shared/shared.module';
import { CreateBoardComponent } from './create-board/create-board.component';
import { BoardShellComponent } from './board-shell/board-shell.component';
import { ListsModule } from '../lists/lists.module';
import { ItemsModule } from '../items/items.module';
import { EditBoardComponent } from './edit-board/edit-board.component';


@NgModule({
  declarations: [BoardsComponent, CreateBoardComponent, BoardShellComponent, EditBoardComponent],
  imports: [
    CommonModule,
    BoardsRoutingModule,
    SharedModule,
    ListsModule,
    ItemsModule
  ]
})
export class BoardsModule { }