import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Board } from 'src/app/models/board';
import { Template } from 'src/app/models/template';
import { DataService } from 'src/app/services/data.service';
import { SnackbarMessageType } from 'src/app/shared/snackbar/snackbar-message-type';

@Component({
  selector: 'app-template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.css'],
})
export class TemplateDetailsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  public template$: Observable<Template>;

  public title = new FormControl('Kanban Template', [
    Validators.required,
    Validators.maxLength(512),
  ]);

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackbar: MatSnackBar,
    private readonly boardsService: DataService<Board>,
    private readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.template$ = this.route.data.pipe(
      map((data: { template: Template }) => data.template)
    );
  }

  // =========================================================================

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // =========================================================================

  toggleModal(): void {
    const menu = document.getElementById('dropdown');
    menu.classList.toggle('is-active');
  }

  // =========================================================================

  createFromTemplate(templateId: string): void {
    if (!templateId) {
      return;
    }

    const path = `/boards/create-from/template/${templateId}`;

    const board = new Board({
      title: this.title.value,
      user: this.auth.getUser().id,
    });

    this.subscription = this.boardsService.create(path, board).subscribe(
      (res: Board) => {
        this.snackbar.open('Your board was created.', null, {
          panelClass: 'success',
        });

        this.router.navigate(['/boards', res._id]);
      },
      (err) => {
        this.snackbar.open(err, null, { panelClass: 'danger' });
      }
    );
  }
}
