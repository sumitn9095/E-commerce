
import { Component, inject, output, signal, Signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { concatMap, filter, from, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { CourseService } from '../../utility/course.service';
import { AsyncPipe } from '@angular/common';
import { NgFor } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ShoppingListComponent } from '../shopping-list/shopping-list.component';

@Component({
  selector: 'app-shopping-list-rxjs',
  standalone: true,
  imports: [ShoppingListComponent,FormsModule, ReactiveFormsModule,ButtonModule, PanelModule, TableModule, SkeletonModule, ProgressSpinnerModule, InputGroupAddonModule, InputGroupModule, AsyncPipe, NgFor],
  templateUrl: './shopping-list-rxjs.component.html',
  styleUrl: './shopping-list-rxjs.component.scss'
})
export class ShoppingListRxjsComponent implements OnInit {
  // public buyProductsForm!: FormGroup;
  // _fb = inject(FormBuilder);
  public addToCart_output2 = output();
  public addProduct_output2 = output();

  public products$ : Observable<any> = new Observable();
  public productsCopy$ : Observable<any> = new Observable();

  public discountProductsO : Observable<number> = new Observable();
  public discountProducts : number[] = [3,5,6];

  public inventoryProducts$ : Observable<any> = new Observable();

  public products_array : any[] = [];

  public selectedProducts: any;

  _cs = inject(CourseService);

  // constructor(){
  //   this.buyProductsForm = this._fb.group({
  //     selectedAny : ['',[Validators.required]],
  //   });
  // }

  ngOnInit(): void {
    this.fetch_products();
    this.discounted_products();
  }

  addToCart(){
    this.addToCart_output2.emit(this.selectedProducts);
  }
  addProduct(product:any){
    this.addProduct_output2.emit(product);
  }


  // discounted_products() {
  //   this._cs.fetchProducts()
  //   .pipe(
  //       map((k:any) => k?.body),
  //       switchMap((e:any) => from(this.discountProducts).pipe(
  //         map((g:any)=> e[g])
  //       ))
  //   )
  //   .subscribe({
  //     next: (r:any)=>console.log('products - discounted',r)
  //   })
  // }

  discounted_products() {
    from(this.discountProducts).pipe(
      switchMap((b:any)=> this._cs.fetchProducts().pipe(
        map((d:any) => d?.body?.filter((q:any)=>q.no == b))
      ))
      // map((r:any)=>r)
    )
    .subscribe({
      next: (r:any)=>console.log('products - discounted',r)
    })
  }

  inventory_products(prod:{}) {
      // console.log("product",prod);
      // of(1,2,3).pipe(
      //   concatMap((e:any) => e)
      //   // map((e:any) => console.log("inventory_products",e))
      // )
  }
  
  fetch_products() {
    this.discountProductsO = from(this.discountProducts);
    
    this._cs.fetchProducts()
    .pipe(
        filter((k:any) => k?.body?.map((r:any, i:number) => {
          r.price = Math.random()*1000;
          r.no = i+1;
        })),
        // Iterate each product, and check price with condition
        //map((t:any)=>t.body.filter((q:any)=> q.price < 200))
        map((t:any)=>t?.body),
        shareReplay(1)
    )
    .subscribe({
        next:(n:any)=>{
          this.products_array.push(n);
        },
        complete:()=>{
          this.products$ = from(this.products_array);
          this.productsCopy$ = from(this.products_array);
        }
    })
  }


  filter_products(action:string, price:number){
    if(action === 'lessThan') {
      this.productsCopy$ = this.products$
      .pipe(
        map((t:any) => t.filter((b:any) => b.price < price))
      );
    } else if(action === 'moreThan') {
      this.productsCopy$ = this.products$
      .pipe(
        map((t:any) => t.filter((b:any) => b.price > price))
      );
    } else {
      this.productsCopy$ = this.products$
      // this.products$ = this.products$
      // .pipe(
      //   map((t:any) => t)
      // );
    }

    // this.filteredAgainProducts$.subscribe({
    //   next:(n:any)=>{
    //     console.log("Products fitered",n);
    //     this.products_array.push(n);
    //   },
    //   complete:()=>{
    //     this.products_filtered_filtered$ = from(this.products_array);
    //   }
    // });

    
  }
}
