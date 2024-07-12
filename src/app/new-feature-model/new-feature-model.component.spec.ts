import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFeatureModelComponent } from './new-feature-model.component';

describe('NewFeatureModelComponent', () => {
  let component: NewFeatureModelComponent;
  let fixture: ComponentFixture<NewFeatureModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFeatureModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewFeatureModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
