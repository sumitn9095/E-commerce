import { Component, inject, input, OnInit, output, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { ToastModule } from 'primeng/toast';
import { ShopService } from '../../utility/shop.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingFiltersComponent } from '../../components/shopping-filters/shopping-filters.component';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-cart-history',
  standalone: true,
    imports: [
     HeaderComponent,  ToastModule, FormsModule, ReactiveFormsModule, ShoppingFiltersComponent,
     ButtonModule, PanelModule, TableModule, SkeletonModule, InputTextModule, ProgressSpinnerModule,  InputGroupAddonModule, InputGroupModule, DropdownModule],
  templateUrl: './cart-history.component.html',
  styleUrl: './cart-history.component.scss'
})
export class CartHistoryComponent implements OnInit {
  _shop = inject(ShopService);
  orders:any=[];
  allOrderData:any;
  selectedOrder:any;
  selectedOrderName:any;
  categoryListDefined:any=[];
  maxProductPrice:number=0;
  filterQuery = output<any>();
  productList:WritableSignal<any> = signal([]);
  selectedCartTotal:WritableSignal<number>=signal(0);
  cartPriceTotal:WritableSignal<number>=signal(0);
  cartQtyTotal:WritableSignal<number>=signal(0);
  constructor(){
    
  }

  ngOnInit(): void {
    this.fetchCartHistory();
    this.getCategoryList();
    this.getMaxProductPrice();
  }

  fetchCartHistory(){
    this._shop.cartHistory().subscribe({
      next: (response)=>{
        console.log("cart history123",response);
        this.allOrderData = response?.response?.orderList;
        response?.response?.orderList?.map((ordr:any)=>{
          this.orders.push({name:ordr._id})
        })
      },
      error: (err)=>console.log("cart history",err)
    })
  }

  selectOrder(orderId:any) {
    console.log("orderId",orderId)
    this.selectedOrder = this.allOrderData.filter((ordr:any) => ordr._id === orderId.value.name)[0];
    this.productList.update(()=>[...this.selectedOrder?.orderDetails?.orderIn?.orderedProductList])
    //console.log("selectedOrder",this.selectedOrder)
    // this.selectedCartTotal.update(()=>this.selectedOrder?.orderDetails?.orderIn?.orderedProductList.reduce((acc:number,item:any)=> Number( (Number(item?.products?.price) * Number(item?.qty)) + acc )));
    var ooo:number;
    
    
    this.selectedOrder?.orderDetails?.orderIn?.orderedProductList.reduce((acc:number, item:any) => {
      let iPrice = parseInt(item?.products?.price);
      let iQty = parseInt(item?.qty);
      ooo = (iPrice * iQty);
      this.cartPriceTotal.update(()=> this.cartPriceTotal()+ooo);
      this.cartQtyTotal.update(()=> this.cartQtyTotal()+iQty);
      //ooo =  acc;
      console.log("selectedOrder---ooo", item?.products?.id, acc, ooo, this.cartPriceTotal(), this.cartQtyTotal());
    });
    console.log("cartPriceTotal---cartPriceTotal",this.cartPriceTotal(),this.cartQtyTotal())
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

  // filterProducts(payload:{}) {
  //   //this.filterQuery.emit(payload);
  //   console.log("payload",payload)
  // }

  // Filtering Products in Cart
  filter_cart(payload:{}) {
    var cart_products:any[] = [];
    //console.log("filter_cart--payloadObj",payloadObj)
    this._shop.filter_order(this.selectedOrderName.name,payload).subscribe({
      next:(response)=>{
          console.log("filter_cart---response",response)
          response.order.cart.map((order:any) => {
            //let phh = typeof order?.products?.products?._id === 'string' ? order?.products?.products : {};
            if(typeof order?.products?._id === 'string') cart_products.push({...order, qty: order.qty});
          })
          this.productList.update(()=>[...cart_products])
          console.log("this.productList------",this.productList())
          //this._cart.cart.update(()=>[...cart_products]);
      },
      error:(err)=>{
        let error = new Error(err);
      }
    })
  }

}
