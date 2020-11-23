import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AllBoardsComponent } from './all-boards/all-boards.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CreateBoardComponent } from './create-board/create-board.component';

@NgModule({
  declarations: [DashboardComponent, AllBoardsComponent, CreateBoardComponent],
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
