import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Board } from 'src/app/models/board';
import { DataService } from 'src/app/services/data.service';
import { StoreService } from 'src/app/store/store.service';
import { PaginatedResponse } from 'src/app/wrappers/paginated-response';

@Component({
  selector: 'app-all-boards',
  templateUrl: './all-boards.component.html',
  styleUrls: ['./all-boards.component.css'],
})
export class AllBoardsComponent implements OnInit {
  public faUser = faUser;
  public faClock = faClock;

  public boards$: Observable<Board[]>;
  public readonly lastWeek = new Date(
    new Date().valueOf() - 1000 * 60 * 60 * 24 * 7
  );

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService<Board>,
    private readonly store: StoreService,
    public readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.boards$ = this.dataService
      .getAll('/boards')
      .pipe(map((res: PaginatedResponse<Board>) => res.data));
  }

  // =========================================================================

  view(board: Board): void {
    this.store.setBoard(board);
    this.router.navigate([board._id, 'shell'], { relativeTo: this.route });
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
