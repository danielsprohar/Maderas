import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private readonly documentTitle: Title) {}

  ngOnInit(): void {
    this.documentTitle.setTitle('Dashboard | Maderas');
  }
}
