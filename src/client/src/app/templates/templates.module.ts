import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent } from './templates.component';
import { TemplateDetailsComponent } from './template-details/template-details.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [TemplatesComponent, TemplateDetailsComponent],
  imports: [CommonModule, TemplatesRoutingModule, SharedModule],
})
export class TemplatesModule {}
