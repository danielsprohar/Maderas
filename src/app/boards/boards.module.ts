import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ItemsModule } from '../items/items.module';
import { ListsModule } from '../lists/lists.module';
import { SharedModule } from '../shared/shared.module';
import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsComponent } from './boards.component';
import { EditBoardComponent } from './edit-board/edit-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [BoardsComponent, EditBoardComponent],
  imports: [
    CommonModule,
    BoardsRoutingModule,
    SharedModule,
    ListsModule,
    ItemsModule,
    DragDropModule,
  ],
})
export class BoardsModule {}
