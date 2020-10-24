import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  faCheck,
  faEnvelope,
  faExclamationTriangle,
  faKey,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth.service';
import { passwordsMatchValidator } from '../validators/passwords-match-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  faUser = faUser;
  faCheck = faCheck;
  faEnvelope = faEnvelope;
  faKey = faKey;
  faExclamationTriangle = faExclamationTriangle;

  form: FormGroup;

  constructor(
    private readonly router: Router,
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
        ],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: passwordsMatchValidator,
      }
    );
  }

  // =========================================================================
  // Form getters
  // =========================================================================

  get username(): AbstractControl {
    return this.form.get('username');
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get password(): AbstractControl {
    return this.form.get('password');
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

  getEmailError(): string {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }
    if (this.email.hasError('email')) {
      return 'Invalid format';
    }

    return this.email.hasError('maxLength')
      ? 'Must be less than 256 characters'
      : '';
  }

  // =========================================================================
  // Actions
  // =========================================================================
}
