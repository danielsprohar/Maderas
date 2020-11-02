import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateDetailResolverService } from './services/template-detail-resolver.service';
import { TemplateDetailsComponent } from './template-details/template-details.component';

import { TemplatesComponent } from './templates.component';

const routes: Routes = [
  {
    path: '',
    component: TemplatesComponent,
    children: [
      {
        path: ':id',
        component: TemplateDetailsComponent,
        resolve: {
          template: TemplateDetailResolverService,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatesRoutingModule {}
