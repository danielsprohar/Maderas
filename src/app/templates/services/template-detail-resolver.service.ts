import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root',
})
export class TemplateDetailResolverService implements Resolve<Template> {
  constructor(
    private readonly router: Router,
    private readonly templatesService: DataService<Template>
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Template> | Observable<never> {
    const id = route.paramMap.get('id');
    return this.templatesService.get(`/templates/${id}`).pipe(
      take(1),
      mergeMap((templates) => {
        if (templates) {
          return of(templates);
        } else {
          this.router.navigate(['/templates']);
          return EMPTY;
        }
      })
    );
  }
}
