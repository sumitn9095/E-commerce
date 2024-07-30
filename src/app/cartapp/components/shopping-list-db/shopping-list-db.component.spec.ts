import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListDbComponent } from './shopping-list-db.component';

describe('ShoppingListDbComponent', () => {
  let component: ShoppingListDbComponent;
  let fixture: ComponentFixture<ShoppingListDbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingListDbComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShoppingListDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
