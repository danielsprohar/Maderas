import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../dialog-data';

@Component({
  selector: 'app-user-confirmation-dialog',
  templateUrl: './user-confirmation-dialog.component.html',
  styleUrls: ['./user-confirmation-dialog.component.css'],
})
export class UserConfirmationDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<UserConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.data.confirmed = false;
    this.dialogRef.close();
  }
}
