import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faChevronDown,
  faChevronUp,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
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
  public faChevronUp = faChevronUp;
  public faChevronDown = faChevronDown;
  public boards$: Observable<Board[]>;

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

  openModal(): void {
    const modal = document.getElementById('createBoardModal');
    modal.style.display = 'block';
  }

  // =========================================================================

  closeModal(): void {
    const modal = document.getElementById('createBoardModal');
    modal.style.display = 'none';
  }

  // =========================================================================
}
