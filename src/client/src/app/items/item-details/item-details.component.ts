import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from 'src/app/models/item';
import { List } from 'src/app/models/list';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css'],
})
export class ItemDetailsComponent implements OnInit {
  public form: FormGroup;

  @Input() list: List;
  @Input() item: Item;
  @Output() closeModalEvent = new EventEmitter<boolean>();

  @ViewChild('descriptionEditorContainer')
  public descriptionEditorContainer: any;

  @ViewChild('descriptionFakeTextarea')
  public descriptionFakeTextarea: any;

  @ViewChild('descriptionEditor')
  public descriptionEditor: any;

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly itemsService: DataService<Item>,
    private readonly renderer: Renderer2,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(512),
        ],
      ],
      description: [null, [Validators.maxLength(2048)]],
      dueDate: [null],
    });

    if (this.item) {
      this.setItem(this.item);
    }
  }

  // =========================================================================

  get title(): AbstractControl {
    return this.form.get('title');
  }

  // =========================================================================

  get description(): AbstractControl {
    return this.form.get('description');
  }

  // =========================================================================

  get dueDate(): AbstractControl {
    return this.form.get('dueDate');
  }

  // =========================================================================

  closeDescriptionEditor(): void {
    this.description.setValue(this.item.description);

    this.renderer.setStyle(
      this.descriptionFakeTextarea.nativeElement,
      'display',
      'block'
    );

    this.renderer.setStyle(
      this.descriptionEditorContainer.nativeElement,
      'display',
      'none'
    );

    this.renderer.removeClass(this.descriptionEditor.nativeElement, 'editing');
  }

  // =========================================================================

  editDescription(): void {
    this.renderer.setStyle(
      this.descriptionFakeTextarea.nativeElement,
      'display',
      'none'
    );

    this.renderer.setStyle(
      this.descriptionEditorContainer.nativeElement,
      'display',
      'block'
    );

    this.renderer.addClass(this.descriptionEditor.nativeElement, 'editing');
    this.descriptionEditor.nativeElement.focus();
  }

  // =========================================================================

  setItem(item: Item): void {
    this.item = item;
    this.setFormFields(item);
  }

  // =========================================================================

  setFormFields(item: Item): void {
    this.title.setValue(item.title);
    this.description.setValue(item.description);
    // this.title.setValue(item.title);
  }

  // =========================================================================

  getItemDescriptionLines(): string[] {
    if (!this.item || !this.description.value) {
      return [];
    }

    return (this.description.value as string).split(/\r?\n/g);
  }

  // =========================================================================

  close(): void {
    this.closeModalEvent.emit(true);
  }

  // =========================================================================
}
