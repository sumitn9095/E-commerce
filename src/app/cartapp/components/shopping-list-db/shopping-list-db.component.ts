import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../utility/shop.service';
import { HttpResponse } from '@angular/common/http';
import { ShoppingListComponent } from '../shopping-list/shopping-list.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ShoppingFiltersComponent } from '../shopping-filters/shopping-filters.component';

@Component({
  selector: 'app-shopping-list-db',
  standalone: true,
  imports: [FormsModule, ShoppingListComponent, ReactiveFormsModule,ButtonModule, PanelModule, TableModule, SkeletonModule, AutoCompleteModule, InputTextModule, SliderModule, ProgressSpinnerModule, CalendarModule, InputGroupAddonModule, InputGroupModule, ShoppingFiltersComponent],
  templateUrl: './shopping-list-db.component.html',
  styleUrl: './shopping-list-db.component.scss'
})
export class ShoppingListDbComponent implements OnInit {
  _shop = inject(ShopService);
  _fb = inject(FormBuilder)
  public buyProductsForm!: FormGroup;
  public productsFilterGroup!: FormGroup;
  public products:any=[];
  public selectedProducts:any[]=[];

  // public selectedCategory:any[]=[];
  public categoryListDefined:any=[];
 

  maxProductPrice:number = 0;

  constructor(){
    this.buyProductsForm = this._fb.group({
      selectedAny : ['',[Validators.required]],
    });

    this.productsFilterGroup = this._fb.group({
      category: [''],
      instock: [''],
      date: [''],
      price: [''],
      priceFrom: [0,''],
      priceTo: [0,''],
    })
  }

  ngOnInit(): void {
    this._shop.getCategoryList().subscribe({
      next:(categories)=>{
        if(categories instanceof HttpResponse){
          this.categoryListDefined = categories.body;
            // this.categoryList = categories.body;
            // console.log("this.categoryList",this.categoryList);
        }
      },
      error:(err)=>{
        let error = new Error(err);
      },
      complete:()=>{}
    })

    this.getMaxProductPrice();
    this.fetch_products();
  }

  addToCart(){
    //
  }

  addProduct(product:any){
    //
  }

  fetch_products() {
    this._shop.fetchAllProducts().subscribe({
      next:(products)=>{
        if(products instanceof HttpResponse){
            this.products = products.body;
            console.log("this.products",this.products);
        }
      },
      error:(err)=>{
        let error = new Error(err);
      },
      complete:()=>{}
    })
  }

  filterProductsGroupStatus(){
    return this.productsFilterGroup.value;
  }

  filterPrice(data:any){
    console.log("filterPrice",data)
  }
  
  filterProducts(payload:{}) {
    this._shop.filterProducts(payload)
    .subscribe({
      next: (products)=>{
        if(products instanceof HttpResponse) {
          this.products = products.body;
        }
      },
      error: (err)=>{
        console.log("Error",err);
      }
    })
  }


  getMaxProductPrice(){
    this._shop.getMaxProductPrice().subscribe({
      next: (maxProduct:any) => {
        if(maxProduct instanceof HttpResponse) {
          let maxProductPrice = maxProduct.body;
          this.maxProductPrice = maxProductPrice.product[0].price;
          console.log("maxProductPrice",maxProductPrice);
          //this.rangeValues = [0,maxProductPrice.product[0].price]
        }
      },
      error: (err:Error)=>{
        //ssssssss
      }
    })
  }
}
