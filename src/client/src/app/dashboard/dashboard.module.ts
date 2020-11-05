import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { AllBoardsComponent } from './all-boards/all-boards.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent, AllBoardsComponent],
  imports: [CommonModule, DashboardRoutingModule, SharedModule, MaterialModule],
})
export class DashboardModule {}
