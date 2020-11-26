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
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Board } from 'src/app/models/board';
import { List } from 'src/app/models/list';
import { AppLoadingService } from 'src/app/services/app-loading.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css'],
})
export class CreateListComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Input() board: Board;
  @Output() newListEvent = new EventEmitter<List>();
  @Output() toggleVisibilityEvent = new EventEmitter<boolean>();

  public listForm: FormGroup;

  constructor(
    private readonly listService: DataService<List>,
    private readonly snackbar: MatSnackBar,
    private readonly route: ActivatedRoute,
    private readonly loading: AppLoadingService
  ) {}

  ngOnInit(): void {
    this.listForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(512),
      ]),
    });
  }

  // =========================================================================

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // =========================================================================

  get title(): AbstractControl {
    return this.listForm.get('title');
  }

  // =========================================================================

  resetForm(): void {
    this.title.setValue('');
  }

  // =========================================================================

  close(): void {
    this.toggleVisibilityEvent.emit(true);
  }

  // =========================================================================

  onSubmit(): void {
    if (this.listForm.invalid) {
      return;
    }

    this.loading.isLoading(true);

    const list = new List({
      title: (this.title.value as string).trim(),
      board: this.board._id ?? this.route.snapshot.queryParamMap.get('id'),
    });

    this.subscription = this.listService.create('/lists', list).subscribe(
      (res: List) => {
        this.resetForm();
        this.newListEvent.emit(res);
        this.title.setValue('');
        this.snackbar.open('New list created', null, {
          panelClass: 'success',
        });
      },
      (err) => {
        this.snackbar.open(err.message, null, {
          panelClass: 'danger',
        });
      },
      () => this.loading.isLoading(false)
    );
  }
}
