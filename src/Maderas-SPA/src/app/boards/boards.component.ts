import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { Board } from '../models/board';
import { DataService } from '../services/data.service';
import { PaginatedResponse } from '../wrappers/paginated-response';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
})
export class BoardsComponent implements OnInit {
  public faUser = faUser;
  public boards$: Observable<Board[]>;

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

  view(boardId: string): void {
    this.router.navigate([boardId, 'shell'], { relativeTo: this.route });
  }

  // =========================================================================
}
