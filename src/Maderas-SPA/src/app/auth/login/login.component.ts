import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { SnackbarMessageType } from 'src/app/shared/snackbar/snackbar-message-type';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { LoginModel } from '../models/login-model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  public faEnvelope = faEnvelope;
  public faKey = faKey;
  public form: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly auth: AuthService,
    private readonly fb: FormBuilder,
    private readonly snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
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

    const sub = this.auth.login(loginModel).subscribe(
      (res) => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl) {
          this.router.navigate([returnUrl]);
        } else {
          this.router.navigate(['/']);
        }
      },
      (err) => {
        this.snackbar.show(err.message, SnackbarMessageType.Danger);
        console.error(err);
      }
    );

    this.subscriptions.push(sub);
  }
}
