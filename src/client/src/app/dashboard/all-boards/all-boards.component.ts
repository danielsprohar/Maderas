import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService<Board>,
    public readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.boards$ = this.dataService
      .getAll('/boards')
      .pipe(map((res: PaginatedResponse<Board>) => res.data));
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
