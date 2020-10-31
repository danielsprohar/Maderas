import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemActionsMenuComponent } from './item-actions-menu.component';

describe('ItemActionsMenuComponent', () => {
  let component: ItemActionsMenuComponent;
  let fixture: ComponentFixture<ItemActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemActionsMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
