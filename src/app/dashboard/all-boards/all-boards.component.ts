import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Board } from 'src/app/models/board';
import { DataService } from 'src/app/services/data.service';
import { PaginatedResponse } from 'src/app/wrappers/paginated-response';

@Component({
  selector: 'app-all-boards',
  templateUrl: './all-boards.component.html',
  styleUrls: ['./all-boards.component.css'],
})
export class AllBoardsComponent implements OnInit {
  public boards$: Observable<Board[]>;
  public readonly lastWeek = new Date(
    new Date().valueOf() - 1000 * 60 * 60 * 24 * 7
  );

  constructor(
    private readonly router: Router,
    private readonly dataService: DataService<Board>,
    private readonly renderer: Renderer2,
    public readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.auth.getUser()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/boards' },
      });
    } else {
      const path = `/boards?user=${this.auth.getUser().id}`;
      this.boards$ = this.dataService
        .getAll(path)
        .pipe(map((res: PaginatedResponse<Board>) => res.data));
    }
  }

  // =========================================================================

  openModal(): void {
    const modal = document.getElementById('createBoardModal');
    this.renderer.setStyle(modal, 'display', 'block');
  }

  // =========================================================================

  closeModal(): void {
    const modal = document.getElementById('createBoardModal');
    this.renderer.setStyle(modal, 'display', 'none');
  }

  // =========================================================================

  view(board: Board): void {
    this.router.navigate(['/boards', board._id]);
  }

  // =========================================================================

  toggleTemplateMenu(): void {
    const menu = document.getElementById('templateMenu');
    menu.classList.toggle('is-invisible');
  }

  // =========================================================================

  getRecentlyViewed(boards: Board[]): Board[] {
    return boards.filter(
      (board) => new Date(board.updatedAt).valueOf() >= this.lastWeek.valueOf()
    );
  }
}
