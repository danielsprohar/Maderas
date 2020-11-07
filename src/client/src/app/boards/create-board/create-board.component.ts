import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Board } from 'src/app/models/board';
import { DataService } from 'src/app/services/data.service';
import { SnackbarMessageType } from 'src/app/shared/snackbar/snackbar-message-type';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.css'],
})
export class CreateBoardComponent implements OnInit, OnDestroy {
  private serviceSubscription: Subscription;

  public form: FormGroup;

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly boardService: DataService<Board>,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(512)]],
    });
  }

  // =========================================================================

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }

  // =========================================================================

  get title(): AbstractControl {
    return this.form.get('title');
  }

  // =========================================================================

  getTitleError(): string {
    if (this.title.hasError('required')) {
      return 'Title is required';
    }

    return this.title.hasError('maxLength')
      ? 'Must be less than 512 characters'
      : '';
  }

  // =========================================================================

  back(): void {
    this.location.back();
  }

  // =========================================================================

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const board = new Board({
      title: (this.title.value as string).trim(),
      user: this.auth.getUser().id,
    });

    this.serviceSubscription = this.boardService
      .create('/boards', board)
      .subscribe(
        (data: Board) => {
          this.snackbar.open('A new board was created', null, {
            panelClass: 'success',
          });

          this.router.navigate(['/dashboard/boards']);
        },
        (err) => {
          this.snackbar.open(err.message, null, {
            panelClass: 'danger',
          });
        }
      );
  }
}
