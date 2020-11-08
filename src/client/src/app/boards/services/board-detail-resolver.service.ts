import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Board } from 'src/app/models/board';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root',
})
export class BoardDetailResolverService implements Resolve<Board> {
  constructor(
    private readonly boardsService: DataService<Board>,
    private readonly router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Board> | Observable<never> {
    const id = route.paramMap.get('id');

    return this.boardsService.get(`/boards/${id}`).pipe(
      take(1),
      mergeMap((board) => {
        if (board) {
          return of(board);
        } else {
          this.router.navigate(['/dashboard/boards']);
          return EMPTY;
        }
      })
    );
  }
}
