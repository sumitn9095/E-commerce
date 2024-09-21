import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, input, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-shopping-filters',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule,InputGroupAddonModule, InputGroupModule, AutoCompleteModule, SliderModule, InputTextModule, CalendarModule, ButtonModule],
  templateUrl: './shopping-filters.component.html',
  styleUrl: './shopping-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingFiltersComponent implements OnInit {
  _fb = inject(FormBuilder);

  public maxProductPrice:any = input<any>(0);
  public categoryListDefined:any = input<any>([]);
  public isCartFilter = input<boolean>(false);
  @Output() payloadShoppingFilterValue = new EventEmitter<any>();

  public productsFilterGroup!: FormGroup;

  public selectedCategory:any[]=[];
  //public categoryListDefined:any=[];
  public categoryList:any=[];

  public selectedInstock:any[]=[];
  public instockList:any=[true,false];

  public filterPayload:{}={};

  public priceFrom:number=0;
  public priceTo:number=0;

  rangeValues: number[] = [0, 100];
  rangeDates: Date[] | undefined;

  constructor(){
    //this.priceTo=this.maxProductPrice();
    // effect(()=>{
    //   this.priceTo=this.maxProductPrice();
    // })
  }

  ngOnInit(): void {
    this.productsFilterGroup = this._fb.group({
      category: [''],
      instock: [''],
      date: [''],
      price: [''],
      priceFrom: [0,''],
      priceTo: [this.maxProductPrice(),''],
    });

    setTimeout(() => {
        this.productsFilterGroup.patchValue({
          priceTo: this.maxProductPrice()
        })
    }, 400);
    
  }

  filterProductsGroupStatus(){
    return this.productsFilterGroup.value;
  }

  displayPriceStatus(data:any) {
    let displayPriceFrom = data.values[0];
    let displayPriceTo = data.values[1];
    this.priceFrom = (displayPriceFrom * this.maxProductPrice()) / 100;
    this.priceTo = (displayPriceTo * this.maxProductPrice()) / 100;
    // console.log("priceTo",this.priceTo)
    // console.log("displayPriceStatus2 * this.maxProductPrice",displayPriceStatus2,this.maxProductPrice)
  }

  resetFilters(){
    this.productsFilterGroup.reset();
    this.productsFilterGroup.patchValue({
      category:[],
      instock:[],
      date:[],
      price:[0,100],
      priceFrom:0,
      priceTo: this.maxProductPrice()
    });
    setTimeout(() => {
        this.priceFrom=0;
        this.priceTo=this.maxProductPrice();
        this.productsFilterGroup.patchValue({
          priceFrom:0,
          priceTo: this.maxProductPrice()
        });
         this.filterProducts();
    }, 500);
   
  }
  
  filterProducts() {
    let payload = this.filterProductsGroupStatus();
    payload.priceFrom = this.priceFrom;
    payload.priceTo = this.priceTo;

    this.payloadShoppingFilterValue.emit(payload);

    console.log("filterProducts -- payload",payload);
    // this._shop.filterProducts(payload)
    // .subscribe({
    //   next: (products)=>{
    //     if(products instanceof HttpResponse){
    //       this.products = products.body;
    //     }
    //   },
    //   error: (err)=>{
    //     console.log("Error",err);
    //   }
    // })
  }

  filterMethodCategory(event:any) {
    console.log("event.query",event);
    let cl = [];
    //cl = this.categoryListDefined().categories;
    cl = this.categoryListDefined();
    //.log("cl",cl)
    this.categoryList = ['All',...cl];
  }

  filterMethodInstock(event:any) {
    console.log("event.query",event)
    this.instockList = [...this.instockList];
  }
}
