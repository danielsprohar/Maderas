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
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item';
import { List } from 'src/app/models/list';
import { DataService } from 'src/app/services/data.service';
import { SnackbarMessageType } from 'src/app/shared/snackbar/snackbar-message-type';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css'],
})
export class CreateItemComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Input() list: List;
  @Output() newItemEvent = new EventEmitter<Item>();
  @Output() toggleVisibilityEvent = new EventEmitter<boolean>();

  public itemForm: FormGroup;

  constructor(
    private readonly itemsService: DataService<Item>,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.itemForm = new FormGroup({
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
    return this.itemForm.get('title');
  }

  // =========================================================================

  close(): void {
    this.title.setValue('');
    this.toggleVisibilityEvent.emit(true);
  }

  // =========================================================================

  onSubmit(): void {
    if (this.itemForm.invalid) {
      return;
    }

    const item = new Item({
      title: (this.title.value as string).trim(),
      list: this.list._id,
    });

    this.subscription = this.itemsService.create('/items', item).subscribe(
      (res: Item) => {
        this.newItemEvent.emit(res);
        this.title.setValue('');
        this.snackbar.open('New item created', null, {
          panelClass: 'success',
        });
      },
      (err) => {
        this.snackbar.open(err.message, null, {
          panelClass: 'danger',
        });
      }
    );
  }
}
