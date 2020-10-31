import { Component, OnInit } from '@angular/core';
import { SnackbarMessageType } from 'src/app/shared/snackbar/snackbar-message-type';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private readonly snackbar: SnackbarService) {}

  ngOnInit(): void {}

  showSnackbar(): void {
    this.snackbar.show('Hello world', SnackbarMessageType.Warning);
  }
}
