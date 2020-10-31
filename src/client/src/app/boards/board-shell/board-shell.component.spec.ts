import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardShellComponent } from './board-shell.component';

describe('BoardShellComponent', () => {
  let component: BoardShellComponent;
  let fixture: ComponentFixture<BoardShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
