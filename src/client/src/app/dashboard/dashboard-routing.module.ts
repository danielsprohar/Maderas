import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllBoardsComponent } from './all-boards/all-boards.component';

import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'boards',
        component: AllBoardsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
