import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { TemplateDetailsComponent } from './template-details.component';

describe('TemplateDetailsComponent', () => {
  let component: TemplateDetailsComponent;
  let fixture: ComponentFixture<TemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateDetailsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MaterialModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
