import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Board } from 'src/app/models/board';
import { Template } from 'src/app/models/template';
import { DataService } from 'src/app/services/data.service';
import { PaginatedResponse } from 'src/app/wrappers/paginated-response';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.css'],
})
export class CreateBoardComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  public form: FormGroup;
  public templates$: Observable<Template[]>;

  @Output()
  public closeModalEvent = new EventEmitter<boolean>();

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly boardsService: DataService<Board>,
    private readonly templatesService: DataService<Template>
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.templates$ = this.templatesService
      .getAll('/templates')
      .pipe(map((res: PaginatedResponse<Template>) => res.data));
  }

  // =========================================================================

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // =========================================================================

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(512)]],
      template: [null],
    });
  }

  // =========================================================================

  get title(): AbstractControl {
    return this.form.get('title');
  }

  // =========================================================================

  get template(): AbstractControl {
    return this.form.get('template');
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

  private createFromTemplate(board: Board, templateId: string): void {
    const path = `/boards/create-from/template/${templateId}`;

    this.subscription = this.boardsService.create(path, board).subscribe(
      (res: Board) => {
        this.snackbar.open('Your board was created.', null, {
          panelClass: 'success',
        });

        this.router.navigate(['/boards', res._id]);
      },
      (err) => {
        this.snackbar.open(err, null, {
          panelClass: 'danger',
        });
      }
    );
  }

  // =========================================================================
  // =========================================================================

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const board = new Board({
      title: (this.title.value as string).trim(),
      user: this.auth.getUser().id,
    });


    if (this.template.value) {
      console.log('template id: ' + this.template.value);
    }
    return;

    if (this.template.value) {
      this.createFromTemplate(board, this.template.value);
    } else {
      this.subscription = this.boardsService.create('/boards', board).subscribe(
        (data: Board) => {
          this.snackbar.open('A new board was created', null, {
            panelClass: 'success',
          });

          this.router.navigate(['/boards', data._id]);
        },
        (err) => {
          this.snackbar.open(err.message, null, {
            panelClass: 'danger',
          });
        }
      );
    }
  }
}
