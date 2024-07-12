
import { Component, inject, output, signal, Signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { filter, from, map, Observable, shareReplay } from 'rxjs';
import { CourseService } from '../../../course.service';
import { AsyncPipe } from '@angular/common';
import { NgFor } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shopping-list-rxjs',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,ButtonModule, PanelModule, TableModule, SkeletonModule, ProgressSpinnerModule, InputGroupAddonModule, InputGroupModule, AsyncPipe, NgFor],
  templateUrl: './shopping-list-rxjs.component.html',
  styleUrl: './shopping-list-rxjs.component.scss'
})
export class ShoppingListRxjsComponent implements OnInit {
  public buyProductsForm!: FormGroup;
  _fb = inject(FormBuilder);
  public addToCart_output = output();
  public addProduct_output = output();

  public products$ : Observable<any> = new Observable();
  public productsCopy$ : Observable<any> = new Observable();

  public products_array : any[] = [];

  public selectedProducts: any;

  _cs = inject(CourseService);

  constructor(){
    this.buyProductsForm = this._fb.group({
      selectedAny : ['',[Validators.required]],
    });
  }

  ngOnInit(): void {
    this.fetch_products();
  }

  addToCart(){
    this.addToCart_output.emit(this.selectedProducts);
  }
  addProduct(product:any){
    this.addProduct_output.emit(product);
  }

  
  fetch_products() {
    this._cs.fetchProducts()
    .pipe(
        filter((k:any) => k?.body?.map((r:any)=>r.price = Math.random()*1000)),
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
