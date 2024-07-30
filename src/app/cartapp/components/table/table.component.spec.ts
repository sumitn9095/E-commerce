import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TableComponent } from './table.component';
import { NgxPaginationModule } from 'ngx-pagination'; 

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      imports: [HttpClientModule, NgxPaginationModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('getTotalCount - llop', ()=>{
    expect(component.samp()).toBe('llop');
  });
  it('getTotalCount - no match', ()=>{
    expect(component.samp()).toBe('asdadsad');
  });
  it('getTotalCount - Falsy', ()=>{
    expect(component.samp()).toBeFalsy();
  });
});