import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Template } from '../models/template';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css'],
})
export class TemplatesComponent implements OnInit {
  templates$: Observable<Template[]>;

  constructor(private readonly templatesService: DataService<Template>) {}

  ngOnInit(): void {
    this.templates$ = this.templatesService
      .getAll('/templates')
      .pipe(map((res) => res.data));
  }
}
