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
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Board } from 'src/app/models/board';
import { List } from 'src/app/models/list';
import { DataService } from 'src/app/services/data.service';
import { SnackbarMessageType } from 'src/app/shared/snackbar/snackbar-message-type';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

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
    private readonly snackbar: SnackbarService,
    private readonly route: ActivatedRoute
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

    const list = new List({
      title: (this.title.value as string).trim(),
      board: this.board._id ?? this.route.snapshot.queryParamMap.get('id'),
    });

    this.subscription = this.listService.create('/lists', list).subscribe(
      (res: List) => {
        this.resetForm();
        this.newListEvent.emit(res);
        this.title.setValue('');
        this.snackbar.show('New list created', SnackbarMessageType.Success);
      },
      (err) => {
        this.snackbar.show(err.message, SnackbarMessageType.Danger);
      }
    );
  }

  // =========================================================================
}
