import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDetectionWithSignalComponent } from './change-detection-with-signal.component';

describe('ChangeDetectionWithSignalComponent', () => {
  let component: ChangeDetectionWithSignalComponent;
  let fixture: ComponentFixture<ChangeDetectionWithSignalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeDetectionWithSignalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeDetectionWithSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
