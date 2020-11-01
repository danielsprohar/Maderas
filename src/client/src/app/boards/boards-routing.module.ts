import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardsComponent } from './boards.component';
import { CreateBoardComponent } from './create-board/create-board.component';
import { BoardDetailResolverService } from './services/board-detail-resolver.service';

const routes: Routes = [
  { path: 'create', component: CreateBoardComponent },
  {
    path: ':id',
    component: BoardsComponent,
    resolve: {
      board: BoardDetailResolverService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardsRoutingModule {}
