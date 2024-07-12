// import { Component, OnInit,signal, Signal, WritableSignal, computed, effect, inject } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NgFor, NgIf } from '@angular/common';
// import { PanelModule } from 'primeng/panel';
// import { InputTextModule } from 'primeng/inputtext';
// import { InputSwitchModule } from 'primeng/inputswitch';
// import { CalendarModule } from 'primeng/calendar';
// import { MessageService, MenuItem } from 'primeng/api';
// import { ToastModule } from 'primeng/toast';
// import { DropdownModule } from 'primeng/dropdown';
// import { ListboxModule } from 'primeng/listbox';
// import { TableModule } from 'primeng/table';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { debounceTime, distinctUntilChanged } from 'rxjs';
// import { CourseService } from '../course.service';
// import { HttpResponse } from '@angular/common/http';
// import { ButtonModule } from 'primeng/button';
// import { SkeletonModule } from 'primeng/skeleton';
// import { ProgressSpinnerModule } from 'primeng/progressspinner';


// import { OverlayPanelModule } from 'primeng/overlaypanel';
// import { ProductDisplayBigComponent } from './product-display-big/product-display-big.component';
// import { CartService } from '../cartapp/utility/cart.service';


// @Component({
//   selector: 'app-student-register',
//   standalone: true,
//   imports: [NgFor, ProductDisplayBigComponent, ReactiveFormsModule, PanelModule, InputTextModule, CalendarModule, InputSwitchModule, ToastModule, DropdownModule, ListboxModule, TableModule, ButtonModule, SkeletonModule, ProgressSpinnerModule, OverlayPanelModule],
//   providers: [MessageService,CartService],
//   templateUrl: './student-register.component.html',
//   styleUrl: './student-register.component.scss'
// })
// export class StudentRegisterComponent implements OnInit {
  



//   public buyProductsForm!: any

//   public courses:WritableSignal<any>  = signal([]);
//   public products:WritableSignal<any>  = signal([]);

//   public glb:WritableSignal<any> = signal({});
  

//   public selectedCourse:WritableSignal<any> = signal({});

//   // // ---- Cart related ----
//   // public totalQty = signal('0');
//   // public cartPrice: any = signal('0')
//   // public gst = signal(0);
//   // public deliveryCharges = signal(0);
//   // public cartTotalPrice = signal(0);
//   // public cart: WritableSignal<any> = signal([])

//   //public selectedCourse: Array<any> = [];


//   //public products: any[] = [];
//   public selectedProducts: any;

//   public metaKeySelection: boolean = true;
//   public checked: boolean = true;

//   _cart = inject(CartService);
//   //public fullName : Signal<any> = computed(()=>this.firstName() + '' + this.lastName())
//   constructor(private _ms : MessageService, private _fb : FormBuilder, private _cs : CourseService){
    
    
//     this.buyProductsForm = this._fb.group({
//       selectedAny : ['',[Validators.required]],
//     });

//     // this.totalQty.update( computed(() => this.cart().reduce((acc:any, item:any)=> parseInt(acc + item?.qty),0)))
   
//   }

//   qtyEff = effect(()=>{
//     const opp = this._cart.cart();
//     console.log(`Items in Cart are`,opp);
//     setTimeout(() => {
//       this.calcCartDetails()
//     }, 300);
//   },{allowSignalWrites: true})

//   ngOnInit(): void {
    
//     //let jjk =  this.totalQty
//     // this.totalQty = computed(() => this.cart.reduce((acc,item)=>{
//     //   return acc + item.qty
//     // }));


//     setTimeout(() => {
//       //----------
//       this.studentRegForm.patchValue({
//         firstName : 'qqq',
//         lastName : 'kkk'
//       });
//     }, 1000);
    
//     this.formSteps = [
//       {
//           label: 'Personal',
//           command: (event: any) => this._ms.add({severity:'info', summary:'First Step', detail: event.item.label})
//       },
//       {
//         label: 'Personal 2',
//         command: (event: any) => this._ms.add({severity:'info', summary:'2 Step', detail: event.item.label})
//       }
//     ]
//     this.fetch_products();
//     this.courses.set(
//       [{ id : 1, name: "JS", price: 344,
//         modules: [
//           {id:3, name: 'Module-1', price: 181},
//           {id:2, name: 'Module-2', price: 181},
//           {id:4, name: 'Module-3', price: 181},
//           {id:5, name: 'Module-4', price: 181}
//         ]
//       },
//       { id : 2, name: "Angular", price: 520,
//         modules: [
//           {id:3, name: 'Module-1', price: 181},
//           {id:2, name: 'Module-2', price: 181},
//           {id:4, name: 'Module-3', price: 181},
//           {id:5, name: 'Module-4', price: 181}
//         ]
//       },
//       { id : 3, name: "React", price: 480,
//         modules: [
//           {id:3, name: 'Module-1', price: 181},
//           {id:2, name: 'Module-2', price: 181},
//           {id:4, name: 'Module-3', price: 181},
//           {id:5, name: 'Module-4', price: 181}
//         ]
//       },
//       { id : 4, name: "Node", price: 620, 
//           modules: [
//             {id:3, name: 'Module-1', price: 181},
//             {id:2, name: 'Module-2', price: 181},
//             {id:4, name: 'Module-3', price: 181},
//             {id:5, name: 'Module-4', price: 181}
//           ]
//       }]
//     )
//     //this.firstName
//     //this.fullName = computed(()=>this.firstName + '' + this.lastName)
    
//     // this.studentRegForm?.get("firstName")?.valueChanges
//     // .pipe(debounceTime(2000),distinctUntilChanged())
//     // .subscribe(d => {
//     //   //console.log("FORM",this.studentRegForm)
//     //   let fullName = computed(()=> this.firstName + ' -- ' + this.lastName)
//     //   let jn = this.studentRegForm.get("firstName")?.pristine
//     //   console.log(">>>>",d, jn);
//     //   this._ms.add({ severity: 'success', summary: 'Welcome, ', detail: fullName() });
//     // })

//     // this.studentRegForm?.get("lastName")?.valueChanges
//     // .pipe(debounceTime(2000),distinctUntilChanged())
//     // .subscribe(d => {
//     //   //console.log("FORM",this.studentRegForm)
//     //   let fullName = computed(()=> this.firstName + ' -- ' + this.lastName)
//     //   let jn = this.studentRegForm.get("firstName")?.pristine
//     //   console.log(">>>>",d, jn);
//     //   this._ms.add({ severity: 'success', summary: 'Welcome, ', detail: fullName() });
//     // })

   
//   }

//   showSuccess() {
//     this._ms.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
//   }

//   // processBuyProductsForm(){
//   //   //
//   // }

//   fetch_products(){
//     this._cs.fetchProducts().subscribe({
//       next: ((s:any)=>{
//         if(s instanceof HttpResponse){
//           s.body.map((u:any)=>{
//             let p = Math.random() * 500;
//             u.price = p.toFixed(0)
//           })
//           this.products.set(s.body);
//           //this.products
//           //console.log("this.products",this.products)
//         }
//       }),
//       error: ((err:any)=>{

//       })
//     })
//   }

//   getselectedProducts(){
//     console.log("selected Products are",this.selectedProducts)
//   }

//   removeQty(price:number){
//     console.log("prod removed",price)
//   }

//   updateCart(product:any) {
//     console.log("Updated Product >> ",product);
//     let klo = this._cart.cart()
//     klo.filter((c:any) => { 
//       if(c.id === product.id) {
//         return c.qty = product.qty
//       }
//     });
//     this._cart.cart.set([]);
//     this._cart.cart.set(klo);
//   }

//   calcCartPrice = () => {
//     return this._cart.cart().reduce((acc:any, item:any) => {
//       let totalIndividualProductPrice:number = item?.qty * parseInt(item?.price);
//       return parseInt(acc + totalIndividualProductPrice);
//     },0);
//   }

//   calcCartDetails = () => {
//     let getCalcCartPrice = this.calcCartPrice();
//     console.log("cart--Price--Update",getCalcCartPrice)
//     this._cart.cartPrice.update(computed(() => getCalcCartPrice))
//     this._cart.totalQty.update(computed(() => this._cart.cart().reduce((acc:any, item:any)=> parseInt(acc + item?.qty),0)))
//     this._cart.gst.update( computed(() => Math.round(this._cart.cartPrice() * 18) / 100) )
//     this._cart.deliveryCharges.update( computed(() => this._cart.cartPrice() > 500 ? 0 : 100))
//     this._cart.cartTotalPrice.update( computed(() => this._cart.cartPrice() + this._cart.gst() + this._cart.deliveryCharges()))
//   }


//   addProduct(product:any){
//     console.log("product added",product);
//     this.addInCartCore(this._cart.cart(), product)
//   }

//   addToCart = () => {
//     this.selectedProducts.map((g:any) => {
//       console.log("iterate - selectedProducts", g.id)
//       if(this._cart.cart().length) {
//         this.addInCartCore(this._cart.cart(), g);
//       } else {
//         g.qty = 1;
//         this._cart.cart.update((k) => [...k, g])
//       }
//     })
//   }

//   addInCartCore = (cart:any, product:any) => {
//     let kll = cart.some((c:any)=> c.id === product.id);
//     var cart_temp : Array<any> = cart;
//     if (!kll) {
//       console.log("not matching")
//       product.qty = 1;
//       cart_temp.push(product);
//     } else {
//       cart_temp.filter((c:any) => { if(c.id === product.id) { c.qty = c.qty + 1 } });
//     }

//     setTimeout(() => {
//       this._cart.cart.set([]);
//       setTimeout(() => {
//         this._cart.cart.set([...cart_temp])
//       }, 200);
//     }, 200);
//   }

// }
