import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardsComponent } from './boards.component';
import { CreateBoardComponent } from './create-board/create-board.component';

const routes: Routes = [
  { path: '', component: BoardsComponent },
  { path: 'create', component: CreateBoardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardsRoutingModule { }
