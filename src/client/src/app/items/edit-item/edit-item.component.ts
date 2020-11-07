import {
  Component,
  EventEmitter,
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
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item';
import { DataService } from 'src/app/services/data.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css'],
})
export class EditItemComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private item: Item;

  public form: FormGroup;
  public readonly today = new Date();

  @Output() itemUpdatedEvent = new EventEmitter<Item>();
  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(
    private readonly itemsService: DataService<Item>,
    private readonly snackbar: MatSnackBar,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.item) {
      this.setFormFields(this.item);
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
      description: ['', [Validators.maxLength(2048)]],
      dueDate: [null],
      datetime: [null],
    });
  }

  // =========================================================================

  setItem(item: Item): void {
    this.item = item;
    this.setFormFields(item);
  }

  // =========================================================================

  private setFormFields(item: Item): void {
    if (!item) {
      return;
    }

    this.title.setValue(item.title);
    this.description.setValue(item.description);

    if (item.dueDate) {
      const date = new Date(item.dueDate);
      this.dueDate.setValue(new Date(date.toLocaleDateString()));

      const time = date.toLocaleTimeString();
      if (time !== '12:00:00 AM') {
        this.datetime.setValue(date.toTimeString().split(' ')[0]);
      }
    }
  }

  // =========================================================================

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  get dueDate(): AbstractControl {
    return this.form.get('dueDate');
  }

  get datetime(): AbstractControl {
    return this.form.get('datetime');
  }

  // =========================================================================

  private getDateString(date: Date): string {
    const year = date.getFullYear();
    const dom = date.getDate();
    const month = date.getMonth() + 1; // Starts @ 0

    if (Math.floor(dom / 10)) {
      return `${year}-${month}-${dom}`;
    }

    // The day-of-the-month must be a single digit.
    // So, prefix it with a 0 to avoid an 'invalid date' error
    return `${year}-${month}-0${dom}`;
  }

  // =========================================================================

  getItem(): Item {
    const item = new Item({
      title: (this.title.value as string).trim(),
      description: (this.description.value as string)?.trim(),
      list: this.item.list,
    });

    const dueDateStr = this.getDateString(this.dueDate.value as Date);

    if (this.datetime.value) {
      const timeStr = this.datetime.value;

      const dueDatetimeStr = dueDateStr + 'T' + timeStr;
      item.dueDate = new Date(dueDatetimeStr).toISOString();
      return item;
    }

    item.dueDate = new Date(
      (this.dueDate.value as Date).valueOf()
    ).toISOString();

    return item;
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

    const item = this.getItem();

    Object.assign(this.item, item);

    this.subscription = this.itemsService
      .update(`/items/${this.item._id}`, item)
      .subscribe(
        (res: Item) => {
          this.itemUpdatedEvent.emit(res);

          this.snackbar.open('Your item was updated.', null, {
            panelClass: 'success',
          });

          this.close();
        },
        (err) => {
          this.snackbar.open(err.message, null, {
            panelClass: 'danger',
          });
        }
      );
  }
}
