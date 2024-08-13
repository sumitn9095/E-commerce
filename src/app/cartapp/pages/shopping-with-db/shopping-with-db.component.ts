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
    this._ms.add({ key: 'addProduct', severity: 'success', summary: 'Can you send me the report?' });
    let allEquipments = this.selectedProducts.map((r:any) => r.equipment);
    let allBrands = this.selectedProducts.map((r:any) => r.brand);
    let allCost = this.selectedProducts.map((r:any) => r.price);
    let totalPrice = this.selectedProducts.reduce((acc:any, item:any)=>parseInt(acc+item.price),0);
    this.selectedProductsDetails.equipments = [];
    this.selectedProductsDetails.brands = [];
    this.selectedProductsDetails.cost = [];
    this.selectedProductsDetails.totalPrice = totalPrice;
    console.log("this.selectedProductsDetails",this.selectedProductsDetails)
    this.selectedProductsDetails.equipments.push(allEquipments);
    this.selectedProductsDetails.brands.push(allBrands);
    this.selectedProductsDetails.cost.push(allCost);
  }
  
  getselectedProducts(){
    console.log("selected Products are",this.selectedProducts)
  }

  updateCart(product:any) {
    console.log("Updated Product >> ",product);
    let klo = this._cart.cart()
    klo.filter((c:any) => { 
      if(c.id === product.id) {
        return c.qty = product.qty
      }
    });
    this._cart.cart.set([]);
    this._cart.cart.set(klo);
  }

  addProduct(product:any){
    console.log("product added",product);
    
    //this.notifyProductAdded();

    // let product_qty_added = product.qty;
    
    // this._cart.cart.update(prev => prev.map((p:any) => {
    //   if(p.id == product.id) {
    //     product_qty_added = p.qty + 1;
    //     p.qty = product_qty_added;
    //     return p;
    //   } else {
    //     return p;
    //   }
    // }));

    //console.log("this._cart.cart --- single product added",this._cart.cart());

    this.addInCartCore(this._cart.cart(), product);
    this.latestProductAdded = {
      type: 'single',
      product: product
    }
  }

  addToCart = () => {
    this.selectedProducts.map((g:any) => {
      //console.log("iterate - selectedProducts", g.id);
      this.addInCartCore(this._cart.cart(), g);
      // this._shop.addProductToOrderedProducts(g.id, g.qty).subscribe({
      //   next: (product2)=>console.log("product added",g),
      //   error: (err)=>{throw new Error(err)}
      // })
      // if(this._cart.cart().length) {
      //   this.addInCartCore(this._cart.cart(), g);
      // } else {
      //   g.qty = 1;
      //   this._cart.cart.update((k) => [...k, g]);
      // }
    });
    this.latestProductAdded = {
      type: 'multiple',
      product: this.selectedProducts
    }
    //this.notifyProductAdded();
  }

  processOutputSideCart(data:boolean){
    //console.log("processOutputSideCart",data);
    this.shouldOpenSideCart.set(data);
    console.log("processOutputSideCart",data);
    // this.shouldOpenSideCart.s
  }

  addInCartCore = (cart:any, product:any) => {
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
        }
        return c
      }));

    }

   /// console.log("this._cart.cart -- after modification",this._cart.cart());
    
    this.updateCartInSidecart();

    // -- Update the product's quantity in MongoDB document
    this._shop.addProductToOrderedProducts(product.id, product_qty_added).subscribe({
      next: (product2)=>console.log("product added",product),
      error: (err)=>{throw new Error(err)}
    })
   
  }

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

  // Fetching Products from Display
  fetch_products() {
    this._shop.fetchAllProducts().subscribe({
      next:(products)=>{
        if(products instanceof HttpResponse){
            this.products.update(()=>products.body)
            console.log("this.products",this.products);
        }
      },
      error:(err)=>{
        let error = new Error(err);
      },
      complete:()=>{}
    })
  }

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
