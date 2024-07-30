import { ChangeDetectionStrategy, Component, computed, inject, Input, input, model, OnInit, Signal, signal, SimpleChanges, WritableSignal, effect } from '@angular/core';
import { CartService } from '../../utility/cart.service';
import { SidebarModule } from 'primeng/sidebar';
import { DataViewModule } from 'primeng/dataview';
import { ProductDisplayBigComponent } from '../product-display-big/product-display-big.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidecart',
  standalone: true,
  imports: [SidebarModule,DataViewModule,ProductDisplayBigComponent, AsyncPipe],
  providers: [],
  templateUrl: './sidecart.component.html',
  styleUrl: './sidecart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SidecartComponent implements OnInit {
  _cart = inject(CartService);
  detectChange = input(false);
  cart = input<any[]>([]);
  // shouldOpenSideCart = model<boolean>(false);
  // uuu : Observable<boolean> = new Observable();
  //rrr : boolean = false;
  //sideCartOpenSignal : any = false;
  // sss = computed(() => this._cart.sideCartOpen())
  //@Input() shouldOpenSideCart : boolean = false;

   //sideCartOpenSignal = toSignal(this._cart.sideCartOpen)

   aaa = computed(() => `This is updated : ${this.detectChange()} and displayed`)
   isTrueSet : boolean = false;

    cartPrice = computed(() => Math.round(this.calcCartPrice()));
    totalQty = computed(() => this.cart().reduce((acc:any, item:any)=> parseInt(acc + item?.qty),0));
    gst = computed(() => Math.round(this.cartPrice() * 18) / 100);
    deliveryCharges = computed(() => this.cartPrice() > 500 ? 0 : 100);
    cartTotalPrice = computed(() => this.cartPrice() + this.gst() + this.deliveryCharges());

  constructor() {
    effect(()=>{
      this.isTrueSet = (!this.detectChange());
      //this.calcCartDetails();
    // },{allowSignalWrites: true})
    })
  }

  ngOnInit(): void {
    //console.log("ddd",this.ddd());
    //this.shouldOpenSideCart.set(d => d);
    //console.log("shouldOpenSideCart", this.shouldOpenSideCart())

    // this.uuu = this._cart.sideCartOpen;

    // this._cart.sideCartOpen.subscribe({
    //   next: (d:any)=> {
    //     console.log("sideCartOpen > ",d);
    //     //this.rrr = d;
    //   }
    // })
  }

  calcCartPrice = () => {
    return this.cart().reduce((acc:any, item:any) => {
      let totalIndividualProductPrice:number = item?.qty * parseInt(item?.price);
      return parseInt(acc + totalIndividualProductPrice);
    },0);
  }

  // calcCartDetails = () => {
  //   let getCalcCartPrice = this.calcCartPrice();
  //   console.log("cart--Price--Update",getCalcCartPrice);
  //   this._cart.cartPrice.update(computed(() => getCalcCartPrice));
  //   this._cart.totalQty.update(computed(() => this.cart().reduce((acc:any, item:any)=> parseInt(acc + item?.qty),0)));
  //   this._cart.gst.update( computed(() => Math.round(this._cart.cartPrice() * 18) / 100) );
  //   this._cart.deliveryCharges.update( computed(() => this._cart.cartPrice() > 500 ? 0 : 100));
  //   this._cart.cartTotalPrice.update( computed(() => this._cart.cartPrice() + this._cart.gst() + this._cart.deliveryCharges()));
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log("SimpleChanges",changes)
  // }



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
}