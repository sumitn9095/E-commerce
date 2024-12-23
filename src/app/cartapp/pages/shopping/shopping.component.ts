import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SidecartComponent } from '../../components/sidecart/sidecart.component';
import { CartService } from '../../utility/cart.service';
import { CourseService } from '../../utility/course.service';
// import { PanelModule } from 'primeng/panel';
// import { InputGroupModule } from 'primeng/inputgroup';
// import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
// import { ButtonModule } from 'primeng/button';
// import { OverlayPanelModule } from 'primeng/overlaypanel';
// import { ProgressSpinnerModule } from 'primeng/progressspinner';
// import { SkeletonModule } from 'primeng/skeleton';
// import { TableModule } from 'primeng/table';
// import { HttpResponse } from '@angular/common/http';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { catchError, filter, find, forkJoin, from, map, merge, mergeMap, Observable, of, range, switchMap, tap, throwError } from 'rxjs';
import { AsyncPipe } from '@angular/common';
// import { NgFor } from '@angular/common';
import { ShoppingListRxjsComponent } from '../../components/shopping-list-rxjs/shopping-list-rxjs.component';
import { RouterOutlet } from '@angular/router';
import { ShoppingListSignalComponent } from "../../components/shopping-list-signal/shopping-list-signal.component";
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LatestProduct } from '../../utility/latest-product';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [RouterOutlet, ShoppingListSignalComponent, HeaderComponent, ShoppingListRxjsComponent, FormsModule, ReactiveFormsModule, SidecartComponent, ToastModule, AsyncPipe, ShoppingListSignalComponent],
  providers: [MessageService],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.scss'
})
export class ShoppingComponent implements OnInit {
  _cart = inject(CartService);
  _cs = inject(CourseService);
  _ms = inject(MessageService)
  // _fb = inject(FormBuilder)

  thisCart : WritableSignal<any[]> = signal<any[]>([])

  shouldOpenSideCart = signal<boolean>(false);

  public buyProductsForm!: FormGroup;
  public products:Signal<any>  = signal({});
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
  
  constructor(){
    // this.buyProductsForm = this._fb.group({
    //   selectedAny : ['',[Validators.required]],
    // });
    // this.products = toSignal(this._cs.fetchProducts(), {initialValue: []});
    // this.fetch_products();
    // this.products_modified_signal = toSignal(this.products_modified$, {initialValue:[]});
    // this.filter_products('all',0)
    // this.filteredProducts_signal = toSignal(this.products_filtered_filtered$, {initialValue:[]});
  }

    // qtyEff = effect(()=>{
    //   const opp = this._cart.cart();
    //   console.log(`Items in Cart are`,opp);
    //   setTimeout(() => {
    //     this.calcCartDetails()
    //   }, 300);
    // },{allowSignalWrites: true})

  ngOnInit(): void {
    
    // console.log("this.products--",this.products().body);
  }

// processOutputSideCart(data:boolean){
//   //console.log("processOutputSideCart",data);
//   this.shouldOpenSideCart.set(data);
//   console.log("processOutputSideCart",data);
//   // this.shouldOpenSideCart.s
// }

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

  removeQty(price:number){
    console.log("prod removed",price)
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
    this.addInCartCore(this._cart.cart(), product);
    this.latestProductAdded = {
      type: 'single',
      product: product
    }
    this.notifyProductAdded();
  }

  addToCart = (selectedProducts:any) => {
    this.selectedProducts = selectedProducts;
    selectedProducts.map((g:any) => {
      console.log("iterate - selectedProducts", g.id)
      if(this._cart.cart().length) {
        this.addInCartCore(this._cart.cart(), g);
      } else {
        g.qty = 1;
        this._cart.cart.update((k) => [...k, g])
      }
    });
    this.latestProductAdded = {
      type: 'multiple',
      product: selectedProducts
    }
    this.notifyProductAdded();
  }

  processOutputSideCart(data:boolean){
    //console.log("processOutputSideCart",data);
    this.shouldOpenSideCart.set(data);
    console.log("processOutputSideCart",data);
    // this.shouldOpenSideCart.s
  }

  addInCartCore = (cart:any, product:any) => {
    let kll = cart.some((c:any)=> c.id === product.id);
    var cart_temp : Array<any> = cart;
    if (!kll) {
      console.log("not matching")
      product.qty = 1;
      cart_temp.push(product);
    } else {
      cart_temp.filter((c:any) => { if(c.id === product.id) { c.qty = c.qty + 1 } });
    }

    setTimeout(() => {
      this._cart.cart.set([]);
      setTimeout(() => {
        this._cart.cart.set([...cart_temp]);
        this.thisCart.update(this._cart.cart);
      }, 200);
    }, 200);
  }
}
