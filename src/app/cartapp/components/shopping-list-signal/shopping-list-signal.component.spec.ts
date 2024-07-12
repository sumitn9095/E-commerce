import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListSignalComponent } from './shopping-list-signal.component';

describe('ShoppingListSignalComponent', () => {
  let component: ShoppingListSignalComponent;
  let fixture: ComponentFixture<ShoppingListSignalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingListSignalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShoppingListSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
