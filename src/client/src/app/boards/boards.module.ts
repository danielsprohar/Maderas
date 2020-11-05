import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ItemsModule } from '../items/items.module';
import { ListsModule } from '../lists/lists.module';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsComponent } from './boards.component';
import { CreateBoardComponent } from './create-board/create-board.component';
import { EditBoardComponent } from './edit-board/edit-board.component';

@NgModule({
  declarations: [BoardsComponent, CreateBoardComponent, EditBoardComponent],
  imports: [
    CommonModule,
    BoardsRoutingModule,
    SharedModule,
    ListsModule,
    ItemsModule,
    MaterialModule,
  ],
})
export class BoardsModule {}
