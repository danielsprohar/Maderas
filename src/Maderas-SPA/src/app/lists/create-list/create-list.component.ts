import {
  Component,
  EventEmitter,
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
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { List } from 'src/app/models/list';
import { DataService } from 'src/app/services/data.service';
import { SnackbarMessageType } from 'src/app/shared/snackbar/snackbar-message-type';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css'],
})
export class CreateListComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Output() newListEvent = new EventEmitter<List>();
  @Output() toggleVisibilityEvent = new EventEmitter<boolean>();

  public listForm: FormGroup;
  public faTimes = faTimes;

  constructor(
    private readonly listService: DataService<List>,
    private readonly store: StoreService,
    private readonly snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.listForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(32),
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

  getError(): string {
    if (this.title.hasError('required')) {
      return 'Field is required';
    }

    return this.title.hasError('maxLength')
      ? 'Must be less than 512 characters'
      : '';
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

    const list = new List({
      title: (this.title.value as string).trim(),
      board: this.store.getBoard()._id,
    });

    this.subscription = this.listService.create('/lists', list).subscribe(
      (res: List) => {
        this.store.setList(res);
        this.newListEvent.emit(res);
        this.snackbar.show('New list created', SnackbarMessageType.Success);
      },
      (err) => {
        this.snackbar.show(err.message, SnackbarMessageType.Danger);
      }
    );
  }

  // =========================================================================
}
