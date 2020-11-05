import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent } from './templates.component';
import { TemplateDetailsComponent } from './template-details/template-details.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [TemplatesComponent, TemplateDetailsComponent],
  imports: [CommonModule, TemplatesRoutingModule, SharedModule, MaterialModule],
})
export class TemplatesModule {}
