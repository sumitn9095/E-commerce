import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDisplayBigComponent } from './product-display-big.component';

describe('ProductDisplayBigComponent', () => {
  let component: ProductDisplayBigComponent;
  let fixture: ComponentFixture<ProductDisplayBigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDisplayBigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductDisplayBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
