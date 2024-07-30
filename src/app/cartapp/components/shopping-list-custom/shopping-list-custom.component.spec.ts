import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListCustomComponent } from './shopping-list-custom.component';

describe('ShoppingListCustomComponent', () => {
  let component: ShoppingListCustomComponent;
  let fixture: ComponentFixture<ShoppingListCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingListCustomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShoppingListCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
