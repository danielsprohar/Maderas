import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SnackbarComponent } from './snackbar/snackbar/snackbar.component';

@NgModule({
  declarations: [SnackbarComponent],
  imports: [CommonModule],
  exports: [ReactiveFormsModule, SnackbarComponent],
})
export class SharedModule {}
