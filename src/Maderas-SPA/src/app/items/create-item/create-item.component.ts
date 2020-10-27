import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item';
import { DataService } from 'src/app/services/data.service';
import { SnackbarMessageType } from 'src/app/shared/snackbar/snackbar-message-type';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css'],
})
export class CreateItemComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public faTimes = faTimes;

  @Output() newItemEvent = new EventEmitter<Item>();
  @Output() toggleVisibilityEvent = new EventEmitter<boolean>();

  public itemForm: FormGroup;

  constructor(
    private readonly itemsService: DataService<Item>,
    private readonly store: StoreService,
    private readonly snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.itemForm = new FormGroup({
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
    return this.itemForm.get('title');
  }

  // =========================================================================

  close(): void {
    this.toggleVisibilityEvent.emit(true);
  }

  // =========================================================================

  onSubmit(): void {
    if (this.itemForm.invalid) {
      return;
    }

    const item = new Item({
      title: (this.title.value as string).trim(),
      list: this.store.getList()._id,
    });

    this.subscription = this.itemsService.create('/items', item).subscribe(
      (res: Item) => {
        this.newItemEvent.emit(res);
        this.store.setItem(res);
        this.toggleVisibilityEvent.emit(true);
        this.snackbar.show('New item created', SnackbarMessageType.Success);
      },
      (err) => {
        this.snackbar.show(err.message, SnackbarMessageType.Danger);
      }
    );
  }
}
