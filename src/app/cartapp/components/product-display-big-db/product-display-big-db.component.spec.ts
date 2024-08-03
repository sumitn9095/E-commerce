import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDisplayBigDbComponent } from './product-display-big-db.component';

describe('ProductDisplayBigDbComponent', () => {
  let component: ProductDisplayBigDbComponent;
  let fixture: ComponentFixture<ProductDisplayBigDbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDisplayBigDbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDisplayBigDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
