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
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Board } from 'src/app/models/board';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.css'],
})
export class EditBoardComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  public form: FormGroup;

  @Input() board: Board;
  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly boardsService: DataService<Board>,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [
        '',
        [Validators.required, Validators.min(1), Validators.maxLength(512)],
      ],
    });
  }

  // ==========================================================================

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // ==========================================================================

  get title(): AbstractControl {
    return this.form.get('title');
  }

  // ==========================================================================

  getBoard(): Board {
    return new Board({
      title: this.title.value,
      user: this.board.user,
    });
  }

  // ==========================================================================

  setBoard(board: Board): void {
    this.board = board;
    this.title.setValue(board.title);
  }

  // ==========================================================================

  close(): void {
    this.closeModalEvent.emit(true);
  }

  // ==========================================================================

  onSubmit(): void {
    const board = this.getBoard();

    this.subscription = this.boardsService
      .update(`/boards/${this.board._id}`, board)
      .subscribe(
        (res: Board) => {
          this.snackbar.open('Your board was updated.', null, {
            panelClass: 'success',
          });
          Object.assign(this.board, res);
          this.close();
        },
        (err) => {
          this.snackbar.open(err, null, { panelClass: 'danger' });
        }
      );
  }
}
