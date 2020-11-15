import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { LoginModel } from '../models/login-model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  public form: FormGroup;
  public isTextHidden = true;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly auth: AuthService,
    private readonly fb: FormBuilder,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // =========================================================================

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // =========================================================================
  // Form getters
  // =========================================================================

  get email(): AbstractControl {
    return this.form.get('email');
  }

  // =========================================================================

  get password(): AbstractControl {
    return this.form.get('password');
  }

  // =========================================================================
  // Actions
  // =========================================================================

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const loginModel = new LoginModel(
      this.email.value.trim(),
      this.password.value
    );

    this.subscription = this.auth.login(loginModel).subscribe(
      (res: AuthResponse) => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl) {
          this.router.navigate([returnUrl]);
        } else {
          this.router.navigate(['/dashboard/boards']);
        }
      },
      (err) => {
        this.snackbar.open(err, null, {
          panelClass: 'danger',
        });
      }
    );
  }
}
