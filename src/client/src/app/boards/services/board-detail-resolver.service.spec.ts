import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BoardDetailResolverService } from './board-detail-resolver.service';

describe('BoardDetailResolverService', () => {
  let service: BoardDetailResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(BoardDetailResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
