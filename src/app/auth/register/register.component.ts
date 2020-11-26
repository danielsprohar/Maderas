import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegisterModel } from '../models/register-model';
import { AuthService } from '../services/auth.service';
import { passwordsMatchValidator } from '../validators/passwords-match-validator';
import { UniqueEmailAsyncValidator } from '../validators/unique-email-async-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  public form: FormGroup;
  public isTextHidden = true;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly auth: AuthService,
    private readonly fb: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly documentTitle: Title
  ) {}

  ngOnInit(): void {
    this.documentTitle.setTitle('Register | Maderas');
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.maxLength(255)]],
        email: [
          '',
          [Validators.required, Validators.maxLength(255), Validators.email],
          UniqueEmailAsyncValidator.create(this.auth),
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(64),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: passwordsMatchValidator,
        updateOn: 'blur',
      }
    );
  }

  // =========================================================================

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  // =========================================================================
  // Form getters
  // =========================================================================

  get username(): AbstractControl {
    return this.form.get('username');
  }

  // =========================================================================

  get email(): AbstractControl {
    return this.form.get('email');
  }

  // =========================================================================

  get password(): AbstractControl {
    return this.form.get('password');
  }

  // =========================================================================

  get confirmPassword(): AbstractControl {
    return this.form.get('confirmPassword');
  }

  // =========================================================================
  // Form getters (error messages)
  // =========================================================================

  getUsernameError(): string {
    if (this.username.hasError('required')) {
      return 'Username is required';
    }
    return this.username.hasError('maxLength')
      ? 'Must be less than 256 characters'
      : '';
  }

  // =========================================================================

  getEmailError(): string {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }
    if (this.email.hasError('email')) {
      return 'Invalid format';
    }
    if (this.email.hasError('maxLength')) {
      return 'Must be less than 256 characters';
    }

    return this.email.hasError('emailIsTaken')
      ? 'Email is taken. Please use a different email.'
      : '';
  }

  // =========================================================================

  getPasswordError(): string {
    if (this.password.hasError('required')) {
      return 'Password is required';
    }
    if (this.password.hasError('minLength')) {
      return 'Password must be at least 6 characters in length';
    }
    if (this.password.hasError('maxLength')) {
      return 'Password must be less than 65 characters in length';
    }

    return this.password.hasError('passwordsDoNoMatch')
      ? 'Passwords do not match'
      : '';
  }

  // =========================================================================

  isPasswordValid(): boolean {
    return (
      this.password.touched &&
      this.confirmPassword.touched &&
      this.password.valid &&
      this.confirmPassword.valid
    );
  }

  // =========================================================================
  // Actions
  // =========================================================================

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const registerModel = new RegisterModel(
      this.username.value.trim(),
      this.email.value.trim(),
      this.password.value
    );

    const sub = this.auth.register(registerModel).subscribe(
      (res) => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (!returnUrl) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate([returnUrl]);
        }
      },
      (err) => {
        this.snackbar.open(err.message, null, {
          panelClass: 'danger',
        });
      }
    );

    this.subscriptions.push(sub);
  }
}
