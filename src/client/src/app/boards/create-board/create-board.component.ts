import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Board } from 'src/app/models/board';
import { DataService } from 'src/app/services/data.service';
import { SnackbarMessageType } from 'src/app/shared/snackbar/snackbar-message-type';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.css'],
})
export class CreateBoardComponent implements OnInit, OnDestroy {
  private serviceSubscription: Subscription;

  public form: FormGroup;

  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Output() newBoardCreatedEvent = new EventEmitter<Board>();

  constructor(
    private readonly snackbar: SnackbarService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly boardService: DataService<Board>,
    private readonly store: StoreService
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

  close(): void {
    this.closeModalEvent.emit(true);
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
          this.close();
          this.router.navigate(['boards']);
        },
        (err) => {
          this.snackbar.show(err.message, SnackbarMessageType.Danger);
        }
      );
  }
}
