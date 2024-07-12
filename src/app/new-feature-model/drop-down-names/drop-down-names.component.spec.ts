import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownNamesComponent } from './drop-down-names.component';

describe('DropDownNamesComponent', () => {
  let component: DropDownNamesComponent;
  let fixture: ComponentFixture<DropDownNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropDownNamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropDownNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
