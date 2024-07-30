import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingWithDbComponent } from './shopping-with-db.component';

describe('ShoppingWithDbComponent', () => {
  let component: ShoppingWithDbComponent;
  let fixture: ComponentFixture<ShoppingWithDbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingWithDbComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShoppingWithDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
