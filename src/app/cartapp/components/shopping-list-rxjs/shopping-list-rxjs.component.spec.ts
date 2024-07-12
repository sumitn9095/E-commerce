import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListRxjsComponent } from './shopping-list-rxjs.component';

describe('ShoppingListComponent', () => {
  let component: ShoppingListRxjsComponent;
  let fixture: ComponentFixture<ShoppingListRxjsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingListRxjsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShoppingListRxjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
