import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateDetailsComponent } from './template-details/template-details.component';

import { TemplatesComponent } from './templates.component';

const routes: Routes = [
  { path: '', component: TemplatesComponent },
  { path: ':id', component: TemplateDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatesRoutingModule {}
