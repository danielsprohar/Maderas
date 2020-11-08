import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SnackbarComponent } from './snackbar/snackbar/snackbar.component';
import { UserConfirmationDialogComponent } from './user-confirmation-dialog/user-confirmation-dialog.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [SnackbarComponent, UserConfirmationDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [
    ReactiveFormsModule,
    MaterialModule,
    SnackbarComponent,
    UserConfirmationDialogComponent,
  ],
})
export class SharedModule {}
