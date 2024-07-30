import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingFiltersComponent } from './shopping-filters.component';

describe('ShoppingFiltersComponent', () => {
  let component: ShoppingFiltersComponent;
  let fixture: ComponentFixture<ShoppingFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingFiltersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShoppingFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
