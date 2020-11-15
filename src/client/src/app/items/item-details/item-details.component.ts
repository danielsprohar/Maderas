import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
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
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item';
import { List } from 'src/app/models/list';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css'],
})
export class ItemDetailsComponent implements OnInit, OnDestroy {
  private saveItemSubscription: Subscription;
  private uploadFileSubscription: Subscription;
  private selectedFile: File;

  public fileName: string;
  public readonly today = new Date();
  public form: FormGroup;

  @Input() list: List;
  @Input() item: Item;
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Output() itemUpdatedEvent = new EventEmitter<Item>();

  // =========================================================================
  // Title references
  // =========================================================================

  @ViewChild('titleFakeTextarea')
  public titleFakeTextarea: ElementRef;

  @ViewChild('titleEditorContainer')
  public titleEditorContainer: ElementRef;

  @ViewChild('titleEditor')
  public titleEditor: ElementRef;

  // =========================================================================
  // Description references
  // =========================================================================

  @ViewChild('descriptionFakeTextarea')
  public descriptionFakeTextarea: ElementRef;

  @ViewChild('descriptionEditorContainer')
  public descriptionEditorContainer: ElementRef;

  @ViewChild('descriptionEditor')
  public descriptionEditor: ElementRef;

  // =========================================================================
  // Due Date references
  // =========================================================================

  @ViewChild('dueDateFakeTextarea')
  public dueDateFakeTextarea: ElementRef;

  @ViewChild('dueDateEditorContainer')
  public dueDateEditorContainer: ElementRef;

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
      img: [null],
    });

    if (this.item) {
      this.setItem(this.item);
    }
  }

  // =========================================================================

  ngOnDestroy(): void {
    if (this.saveItemSubscription) {
      this.saveItemSubscription.unsubscribe();
    }
    if (this.uploadFileSubscription) {
      this.uploadFileSubscription.unsubscribe();
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

  get img(): AbstractControl {
    return this.form.get('img');
  }

  //#region Title
  // =========================================================================
  // Title methods
  // =========================================================================

  editTitle(): void {
    this.closeDescriptionEditor();
    this.closeDueDateEditor();

    this.renderer.setStyle(
      this.titleFakeTextarea.nativeElement,
      'display',
      'none'
    );

    this.renderer.setStyle(
      this.titleEditorContainer.nativeElement,
      'display',
      'block'
    );

    this.titleEditor.nativeElement.focus();
  }

  // =========================================================================

  closeTitleEditor(): void {
    this.title.setValue(this.item.title);

    this.renderer.setStyle(
      this.titleFakeTextarea.nativeElement,
      'display',
      'block'
    );

    this.renderer.setStyle(
      this.titleEditorContainer.nativeElement,
      'display',
      'none'
    );
  }

  //#endregion Title

  //#region Description
  // =========================================================================
  // Description methods
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
  }

  // =========================================================================

  editDescription(): void {
    this.closeTitleEditor();
    this.closeDueDateEditor();

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

    this.descriptionEditor.nativeElement.focus();
  }

  //#endregion Description

  //#region Due Date
  // =========================================================================
  // Due date methods
  // =========================================================================

  editDueDate(): void {
    this.closeTitleEditor();
    this.closeDescriptionEditor();

    this.renderer.setStyle(
      this.dueDateFakeTextarea.nativeElement,
      'display',
      'none'
    );

    this.renderer.setStyle(
      this.dueDateEditorContainer.nativeElement,
      'display',
      'block'
    );
  }

  // =========================================================================

  closeDueDateEditor(): void {
    this.dueDate.setValue(this.item.dueDate);

    this.renderer.setStyle(
      this.dueDateFakeTextarea.nativeElement,
      'display',
      'block'
    );

    this.renderer.setStyle(
      this.dueDateEditorContainer.nativeElement,
      'display',
      'none'
    );
  }

  //#endregion Due Date

  // =========================================================================
  // Facilitators
  // =========================================================================

  setItem(item: Item): void {
    this.item = item;
    this.setFormFields(item);
  }

  // =========================================================================

  private getItem(): Item {
    const item = new Item({
      title: this.title.value,
      description: this.description.value,
      list: this.item.list,
    });

    if (this.dueDate.value) {
      item.dueDate = (this.dueDate.value as Date).toISOString();
    }

    return item;
  }

  // =========================================================================

  private closeAllEditors(): void {
    this.closeTitleEditor();
    this.closeDescriptionEditor();
    this.closeDueDateEditor();
  }

  // =========================================================================

  setFormFields(item: Item): void {
    this.title.setValue(item.title);
    this.description.setValue(item.description);
    this.dueDate.setValue(item.title);
  }

  // =========================================================================

  getItemDescriptionLines(): string[] {
    if (!this.item || !this.description.value) {
      return [];
    }

    return (this.description.value as string).split(/\r?\n/g);
  }

  // =========================================================================
  // Action handlers
  // =========================================================================

  close(): void {
    this.closeModalEvent.emit(true);
  }

  // =========================================================================

  removeFile(): void {
    this.selectedFile = null;
    this.img.setValue(null);
    this.fileName = null;
  }

  // =========================================================================

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.fileName = this.selectedFile.name;
      this.img.setValue(this.selectedFile.name);
    }
  }

  // =========================================================================

  upload(): void {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    const path = `/items/${this.item._id}/upload-media`;

    // TODO: Upload image to Firebase Storage
    // this.uploadFileSubscription = this.fileService
    //   .upload(path, formData)
    //   .subscribe(
    //     (res: Item) => {
    //       console.log(res);
    //     },
    //     (err) => {
    //       this.snackbar.open(err, null, {
    //         panelClass: 'danger',
    //       });
    //     }
    //   );
  }

  // =========================================================================

  save(): void {
    const item = this.getItem();
    const path = `/items/${this.item._id}`;

    this.saveItemSubscription = this.itemsService.update(path, item).subscribe(
      (res: Item) => {
        this.itemUpdatedEvent.emit(res);
        this.setItem(res);
        this.closeAllEditors();
        this.snackbar.open('Your item was updated', null, {
          panelClass: 'success',
        });
      },
      (err) => {
        this.snackbar.open(err, null, {
          panelClass: 'danger',
        });
      }
    );
  }
}
