import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.css'],
})
export class CreateBoardComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private readonly snackbar: SnackbarService,
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(512)]],
    });
  }

  // =========================================================================

  get title(): AbstractControl {
    return this.form.get('title');
  }

  // =========================================================================

  getTitleError(): string {
    if (this.title.hasError('required')) {
      return 'Title is required';
    }

    return this.title.hasError('maxLength')
      ? 'Must be less than 512 characters'
      : '';
  }

  // =========================================================================

  onSubmit(): void {}
}
