import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../material/material.module';
import { BoardsComponent } from './boards.component';

describe('BoardsComponent', () => {
  let component: BoardsComponent;
  let fixture: ComponentFixture<BoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MaterialModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
