import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { List } from 'src/app/models/list';
import { DataService } from 'src/app/services/data.service';
import { SnackbarMessageType } from 'src/app/shared/snackbar/snackbar-message-type';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css'],
})
export class EditListComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private list: List;

  public form: FormGroup;

  @Output() listUpdatedEvent = new EventEmitter<List>();
  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(
    private readonly listsService: DataService<List>,
    private readonly snackbar: MatSnackBar,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.list) {
      this.setFormFields(this.list);
    }
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
    });
  }

  // =========================================================================

  setFormFields(list: List): void {
    this.title.setValue(list.title);
  }

  // =========================================================================

  setList(list: List): void {
    this.list = list;
    this.setFormFields(list);
  }
  // =========================================================================

  get title(): AbstractControl {
    return this.form.get('title');
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

    const list = new List({
      title: this.title.value,
      board: this.list.board,
    });

    this.subscription = this.listsService
      .update(`/lists/${this.list._id}`, list)
      .subscribe(
        (res: List) => {
          this.listUpdatedEvent.emit(res);
          this.snackbar.open('Your list was updated.', null, {
            panelClass: 'success',
          });
          this.close();
        },
        (err) => {
          this.snackbar.open(err, null, {
            panelClass: 'danger',
          });
        },
        () => this.close()
      );
  }

  // =========================================================================
}
