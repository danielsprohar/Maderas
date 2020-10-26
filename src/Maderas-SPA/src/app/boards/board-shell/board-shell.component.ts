import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Board } from 'src/app/models/board';
import { List } from 'src/app/models/list';
import { DataService } from 'src/app/services/data.service';
import { StoreService } from 'src/app/store/store.service';
import { PaginatedResponse } from 'src/app/wrappers/paginated-response';

@Component({
  selector: 'app-board-shell',
  templateUrl: './board-shell.component.html',
  styleUrls: ['./board-shell.component.css'],
})
export class BoardShellComponent implements OnInit {
  public board$: Observable<Board>;
  public lists$: Observable<List[]>;

  constructor(
    private readonly store: StoreService,
    private readonly listService: DataService<List>
  ) {}

  ngOnInit(): void {
    this.lists$ = this.listService
      .getAll('/lists')
      .pipe(map((res: PaginatedResponse<List>) => res.data));

    this.board$ = this.store.getBoardAsObservable();
  }
}
