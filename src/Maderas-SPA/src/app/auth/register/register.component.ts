import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faCheck,
  faEnvelope,
  faKey,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
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

  faUser = faUser;
  faCheck = faCheck;
  faEnvelope = faEnvelope;
  faKey = faKey;

  form: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly auth: AuthService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
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
  // Form getters
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
  // Actions
  // =========================================================================

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const registerModel = new RegisterModel(
      this.username.value.trim(),
      this.email.value.trim(),
      this.password.value.trim()
    );

    const sub = this.auth.login(registerModel).subscribe(
      (res) => {
        if (res) {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          if (!returnUrl) {
            this.router.navigate(['/']);
          } else {
            this.router.navigate([returnUrl]);
          }
        }
      },
      (err) => {
        // this.notification.error(err.message);
        // TODO: Log error
        console.error(err);
      }
    );

    this.subscriptions.push(sub);
  }
}