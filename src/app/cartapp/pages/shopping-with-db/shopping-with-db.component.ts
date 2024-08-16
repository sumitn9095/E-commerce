import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SidecartComponent } from '../../components/sidecart/sidecart.component';
import { CartService } from '../../utility/cart.service';
import { CourseService } from '../../utility/course.service';

import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AsyncPipe } from '@angular/common';
import { ShoppingListRxjsComponent } from '../../components/shopping-list-rxjs/shopping-list-rxjs.component';
import { RouterOutlet } from '@angular/router';
import { ShoppingListDbComponent } from '../../components/shopping-list-db/shopping-list-db.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LatestProduct } from '../../utility/latest-product';
import { ShopService } from '../../utility/shop.service';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { ShoppingFiltersComponent } from '../../components/shopping-filters/shopping-filters.component';
import { ShoppingListComponent } from '../../components/shopping-list/shopping-list.component';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-shopping-with-db',
  standalone: true,
  imports: [
    RouterOutlet, HeaderComponent, ShoppingListRxjsComponent, FormsModule, ReactiveFormsModule, SidecartComponent, ToastModule, AsyncPipe, ShoppingListDbComponent,
    FormsModule, ShoppingListComponent, ReactiveFormsModule,ButtonModule, PanelModule, TableModule, SkeletonModule, AutoCompleteModule, InputTextModule, ProgressSpinnerModule,  InputGroupAddonModule, InputGroupModule, ShoppingFiltersComponent],
  providers: [MessageService],
  templateUrl: './shopping-with-db.component.html',
  styleUrl: './shopping-with-db.component.scss'
})
export class ShoppingWithDbComponent implements OnInit {

  _cart = inject(CartService);
  _cs = inject(CourseService);
  _ms = inject(MessageService);
  _shop = inject(ShopService);

  cartSpecs:WritableSignal<any> = signal<any>([]);
  
  orderId:any= '';
  shouldOpenSideCart = signal<boolean>(false);

  categoryListDefined:any=[];
  maxProductPrice:number=0;

  public buyProductsForm!: FormGroup;
  public products:WritableSignal<any>  = signal({});
  public selectedProducts: any;
  public selectedMultipleProducts: any;
  public selectedProductsDetails: any = {}

  public latestProductAdded:LatestProduct = {
    type:'',
    product:{
      id:0,
      no:0,
      equipment:'',
      brand:'',
      price:0
    }
  }
  
  constructor(){}
    
  ngOnInit(): void {
    this.fetch_products();
    this.fetch_cart();
    this.getCategoryList();
    this.getMaxProductPrice();
   
  }

  notifyProductAdded() {
    let productAdded = {
      type: 'multiple',
      product: this.selectedProducts
    }
    //this._ms.add({ key: 'addProduct', severity: 'success', summary: 'Can you send me the report?' });
    let allProductNames = this.selectedProducts.map((r:any) => r.name);
    let allCategorys = this.selectedProducts.map((r:any) => r.category);
    let allCost = this.selectedProducts.map((r:any) => r.price);
    let totalPrice = this.selectedProducts.reduce((acc:any, item:any)=>parseInt(acc+item.price),0);

    this.selectedProductsDetails.productNames = [];
    this.selectedProductsDetails.categorys = [];
    this.selectedProductsDetails.cost = [];
    this.selectedProductsDetails.totalPrice = totalPrice;

    console.log("this.selectedProductsDetails",this.selectedProductsDetails)
    this.selectedProductsDetails.productNames.push(allProductNames);
    this.selectedProductsDetails.categorys.push(allCategorys);
    this.selectedProductsDetails.cost.push(allCost);

     this._ms.add({ key: 'addProduct', severity: 'success', data:this.selectedProductsDetails, summary: 'Can you send me the report?' });
  }
  
  getselectedProducts(){
    console.log("selected Products are",this.selectedProducts)
  }

  // - USER (action)
  // - Add single product
  addProduct(product:any){
    console.log("product added",product);
    this.addInCartCore(this._cart.cart(), product);
    let productAdded = {
      type: 'single',
      product: product
    };
    this._ms.add({ key: 'addProduct', severity: 'success', data:productAdded, summary: 'Can you send me the report?' });
  }

  // - USER (action)
  // - Add multiple products
  addToCart = () => {
    console.log("selected-products",this.selectedProducts)
    this.selectedProducts.map((g:any, i:number) => {
      let islast:boolean=false;
      //console.log("this.selectedProducts.length",this.selectedProducts.length, i)
      if(this.selectedProducts.length == i+1) islast=true;
      this.addInCartCore(this._cart.cart(), g, islast,true);
    });
    this.selectedMultipleProducts = [...this.selectedProducts]
    this.notifyProductAdded();
  }

  // - USER (action)
  // Process added products
  addInCartCore = (cart:any, product:any, isLast?:boolean, multipleProductsAdd?:boolean) => {
    console.log("multipleProductsAdd",multipleProductsAdd);
    //console.log("selected-products",this.selectedProducts)
    let isProductAlreadyInCart = cart.some((c:any)=> c.id === product.id);
    //var cart_temp : Array<any> = cart;
    let product_qty_added = 1;
    if (!isProductAlreadyInCart) {
      // -- Product NOT Already in Cart. Product added is NEW
      //console.log("not matching")
      product.qty = 1;
      //cart_temp.push(product);
      this._cart.cart.update(prev => [...prev,product])
      this.cartSpecs.update(prev => [...prev,product])
    } else {
      // -- Product Already in Cart.
      this._cart.cart.update(prev => prev.map((c:any) => {
        if(c.id === product.id) {
          product_qty_added = c.qty + 1;
          // -- Update the product's quantity in Cart Signal.
          c.qty = product_qty_added;
          console.log("product-already-in-cart",product);
        }
        return c
      }));
    }
    if(multipleProductsAdd && isLast) this.updateCartInSidecart();
    else if(!multipleProductsAdd) this.updateCartInSidecart();
    // -- Update the product's quantity in MongoDB document
    this._shop.addProductToOrderedProducts(product.id, product_qty_added).subscribe({
      next: (product2)=>{
        console.log("product added",product);
        this.selectedProducts= [];
      },
      error: (err)=>{throw new Error(err)}
    })
  }

    // - USER (action)
  // - Signgle Request | Add multiple products
  singleReq_addProducts = () => {
    console.log("selected-products",this.selectedProducts)
    this.selectedProducts.map((g:any, i:number) => {
      let islast:boolean=false;
      if(this.selectedProducts.length == i+1) islast=true;
      this.singleReq_processAddProducts(this._cart.cart(), g, islast,true);
    });
    this.selectedMultipleProducts = [...this.selectedProducts]
    this.notifyProductAdded();
  }

  // - USER (action)
  // Signgle Request | Process added products
  singleReq_processAddProducts = (cart:any, product:any, isLast?:boolean, multipleProductsAdd?:boolean) => {
    let productsToAdd_notInCart:any = []
    let productsToAdd_alreadyInCart:any = []
    console.log("multipleProductsAdd",multipleProductsAdd);
    //console.log("selected-products",this.selectedProducts)
    let isProductAlreadyInCart = cart.some((c:any)=> c.id === product.id);
    //var cart_temp : Array<any> = cart;
    let product_qty_added = 1;
    if (!isProductAlreadyInCart) {
      // -- Product NOT Already in Cart. Product added is NEW
      //console.log("not matching")
      product.qty = 1;
      //cart_temp.push(product);
      this._cart.cart.update(prev => [...prev,product])
      this.cartSpecs.update(prev => [...prev,product])
      productsToAdd_notInCart.push(product)
    } else {
      // -- Product Already in Cart.
      this._cart.cart.update(prev => prev.map((c:any) => {
        if(c.id === product.id) {
          product_qty_added = c.qty + 1;
          // -- Update the product's quantity in Cart Signal.
          c.qty = product_qty_added;
          console.log("product-already-in-cart",product);
          productsToAdd_alreadyInCart.push(c)
        }
        return c
      }));
    }
    if(multipleProductsAdd && isLast) this.updateCartInSidecart();
    else if(!multipleProductsAdd) this.updateCartInSidecart();
    // -- Update the product's quantity in MongoDB document

    if(isLast){
      console.log("productsToAdd",productsToAdd_alreadyInCart,productsToAdd_notInCart)
      // this._shop.addProductToOrderedProducts(product.id, product_qty_added).subscribe({
      //   next: (product2)=>{
      //     console.log("product added",product);
      //     this.selectedProducts= [];
      //   },
      //   error: (err)=>{throw new Error(err)}
      // })
    }
  }

  // - USER (action)
  updateCartInSidecart(){
    // Just by updating "_cart.cart" signal, doesnt update thee 'sidecart.
    // 
    let cart_temp:any = [];
    cart_temp = this._cart.cart();
    this._cart.cart.set([]);
      setTimeout(() => {
          this._cart.cart.update(() => [...cart_temp]);
          this.cartSpecs.update(() => [...cart_temp]);
      },100)
  }

  // UNIVERSAL (action)
  // Fetching Products from Display
  fetch_products() {
    this._shop.fetchAllProducts().subscribe({
      next:(products)=>{
        if(products instanceof HttpResponse){
            this.products.update(()=>products.body)
            console.log("this.products",this.products());
        }
      },
      error:(err)=>{
        let error = new Error(err);
      },
      complete:()=>{}
    })
  }

  // USER (action)
  // Filtering Products in Cart
  filter_cart(payload:{}){
    var cart_products:any[] = [];
     this._shop.fetch_orderedProducts(payload).subscribe({
      next:(response)=>{
          response.order.cart.map((order:any) => {
            if(order.products !== undefined) cart_products.push({...order.products, qty: order.qty});
          })
          this._cart.cart.update(()=>[...cart_products]);
          //console.log("this._cart.cart",this._cart.cart());
      },
      error:(err)=>{
        let error = new Error(err);
      }
    })
  }

  // - USER (action)
  // Fetching Products from Cart
  fetch_cart(){
    // Fetch ------------ Order ID ----------------------
    this._shop.fetch_orderId().subscribe({
      next:(response)=>{
        console.log("order >>",response.orderDetails);
        if(typeof response.orderDetails === 'object' && response.orderDetails.length) {
          this.orderId = sessionStorage.getItem("shop_orderId")?.toString();
          sessionStorage.setItem("shop_orderId",response.orderDetails[0].orderId);
        } else {
          let orderId = Math.random()*38747388948737;
          this.orderId = orderId.toString();
          sessionStorage.setItem("shop_orderId",orderId.toString());
          this._shop.orderInit(orderId).subscribe({
            next:(orderDetails)=>{
              //------
            },
            error:(err)=>{
              let error = new Error(err);
            },
          })
        }
      },
      error:(err)=>{
        let error = new Error(err);
      },
      complete:()=>{}
    })

    // Fetch ------------ Order ID ----------------------
    let cart_products:any[]=[];
    this._shop.fetch_orderedProducts(false).subscribe({
      next:(response)=>{
            response.order.cart.map((order:any)=>{
              //let obj = {id:product.id, email:product.email,...product.products}
              cart_products.push({...order.products, qty: order.qty});
              //products.push(product);
            })
            this._cart.cart.update(()=>[...cart_products]);
            this.cartSpecs.update(()=>[...cart_products])
            console.log("this._cart.cart",this._cart.cart());
      },
      error:(err)=>{
        let error = new Error(err);
      }
    })
  }

  // UNIVERSAL (action)
  // Filtering Products on display
  filterProducts(payload:{}) {
    this._shop.filterProducts(payload)
    .subscribe({
      next: (products)=>{
        if(products instanceof HttpResponse) {
          this.products.update(() => products.body);
        }
      },
      error: (err)=>{
        console.log("Error",err);
      }
    })
  }

  // UNIVERSAL (action)
  getCategoryList(){
    this._shop.getCategoryList().subscribe({
      next:(categories)=>{
        if(categories instanceof HttpResponse){
          this.categoryListDefined = categories.body;
        }
      },
      error:(err)=>{
        let error = new Error(err);
      },
      complete:()=>{}
    })
  }

  // UNIVERSAL (action)
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
