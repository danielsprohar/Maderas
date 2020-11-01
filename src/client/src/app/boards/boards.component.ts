import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { Board } from '../models/board';
import { DataService } from '../services/data.service';
import { StoreService } from '../store/store.service';
import { PaginatedResponse } from '../wrappers/paginated-response';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
})
export class BoardsComponent implements OnInit {
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

  // =========================================================================
}
