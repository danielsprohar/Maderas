import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { List } from 'src/app/models/list';
import { Template } from 'src/app/models/template';
import { AppLoadingService } from 'src/app/services/app-loading.service';
import { DataService } from 'src/app/services/data.service';
import { UniqueTemplateNameAsyncValidator } from '../validators/unique-name-async-validator';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css'],
})
export class CreateTemplateComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  public form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly templatesService: DataService<Template>,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly loading: AppLoadingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  // =========================================================================

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // =========================================================================

  private initializeForm(): void {
    this.form = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(512),
          ],
          UniqueTemplateNameAsyncValidator.create(this.templatesService),
        ],
        description: [null, [Validators.maxLength(2048)]],
        lists: this.fb.array([this.createListControl()]),
      },
      {
        updateOn: 'blur',
      }
    );
  }

  // =========================================================================

  private createListControl(): FormControl {
    return this.fb.control('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(512),
    ]);
  }

  // =========================================================================

  get name(): AbstractControl {
    return this.form.get('name');
  }

  // =========================================================================

  getTemplateNameError(): string {
    return this.name.hasError('nameIsTaken') ? 'Name is taken' : '';
  }

  // =========================================================================

  get description(): AbstractControl {
    return this.form.get('description');
  }

  // =========================================================================

  get lists(): FormArray {
    return this.form.get('lists') as FormArray;
  }

  // =========================================================================

  addList(): void {
    this.lists.push(this.createListControl());
  }

  // =========================================================================

  removeList(index: number): void {
    this.lists.controls.splice(index, 1);
  }

  // =========================================================================

  private getTemplate(): Template {
    const template = new Template({
      name: this.name.value,
      lists: this.lists.controls.map((ctrl) => {
        return new List({ title: ctrl.value });
      }),
      user: this.auth.getUser().id,
    });

    if (this.description.value) {
      template.description = (this.description.value as string).trim();
    }

    return template;
  }

  // =========================================================================

  onSubmit(): void {
    this.loading.isLoading(true);
    const template = this.getTemplate();

    this.subscription = this.templatesService
      .create('/templates', template)
      .subscribe(
        (res: Template) => {
          this.snackbar.open('Your template was created!', null, {
            panelClass: 'success',
          });
          this.router.navigate(['/templates', res._id]);
        },
        (err) => {
          this.snackbar.open(err, null, {
            panelClass: 'danger',
          });
        },
        () => this.loading.isLoading(false)
      );
  }
}
