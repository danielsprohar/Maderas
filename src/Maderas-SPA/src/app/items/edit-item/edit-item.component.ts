import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Item } from 'src/app/models/item';
import { DataService } from 'src/app/services/data.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css'],
})
export class EditItemComponent implements OnInit {
  @Input() item: Item;

  public form: FormGroup;

  @Output() editItemEvent = new EventEmitter<Item>();
  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(
    private readonly itemsService: DataService<Item>,
    private readonly snackbar: SnackbarService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [
        this.item?.title,
        [Validators.required, Validators.maxLength(512)],
      ],
      description: [this.item?.description, [Validators.maxLength(2048)]],
      date: [this.item?.dueDate.toLocaleDateString()],
      time: [this.item?.dueDate.toLocaleTimeString()],
    });
  }

  // =========================================================================

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  get date(): AbstractControl {
    return this.form.get('date');
  }

  get time(): AbstractControl {
    return this.form.get('time');
  }

  // =========================================================================
  // =========================================================================
  // =========================================================================

  close(): void {
    this.closeModalEvent.emit(true);
  }

  // =========================================================================

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
  }
}
