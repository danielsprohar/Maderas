import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsComponent } from './boards.component';
import { SharedModule } from '../shared/shared.module';
import { CreateBoardComponent } from './create-board/create-board.component';
import { BoardShellComponent } from './board-shell/board-shell.component';


@NgModule({
  declarations: [BoardsComponent, CreateBoardComponent, BoardShellComponent],
  imports: [
    CommonModule,
    BoardsRoutingModule,
    SharedModule
  ]
})
export class BoardsModule { }
