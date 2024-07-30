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


@Component({
  selector: 'app-shopping-with-db',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ShoppingListRxjsComponent, FormsModule, ReactiveFormsModule, SidecartComponent, ToastModule, AsyncPipe, ShoppingListDbComponent],
  providers: [MessageService],
  templateUrl: './shopping-with-db.component.html',
  styleUrl: './shopping-with-db.component.scss'
})
export class ShoppingWithDbComponent implements OnInit {

  _cart = inject(CartService);
  _cs = inject(CourseService);
  _ms = inject(MessageService);
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
  
  constructor(){}
    
  ngOnInit(): void {
    // console.log("this.products--",this.products().body);
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
