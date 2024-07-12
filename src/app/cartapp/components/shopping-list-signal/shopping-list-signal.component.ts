
import { Component, inject, output, signal, Signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { filter, from, map, Observable } from 'rxjs';
import { CourseService } from '../../../course.service';
import { AsyncPipe } from '@angular/common';
import { NgFor } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,ButtonModule, PanelModule, TableModule, SkeletonModule, ProgressSpinnerModule, InputGroupAddonModule, InputGroupModule, AsyncPipe, NgFor],
  templateUrl: './shopping-list-signal.component.html',
  styleUrl: './shopping-list-signal.component.scss'
})
export class ShoppingListSignalComponent implements OnInit {
  public buyProductsForm!: FormGroup;
  _fb = inject(FormBuilder);
  public addToCart_output = output();
  public addProduct_output = output();

  public productsAre:string='fetched';

  
  public products$ : Observable<any> = new Observable();

  public products_modified$ : Observable<any> = new Observable();
  public products_modified_signal:Signal<any>  = signal({});

  public filteredAgainProducts$ : Observable<any> = new Observable();
  public filteredProducts_signal:Signal<any>  = signal({});
  public products_filtered_filtered$ : Observable<any> = new Observable();

  // public productPrice$ : Observable<any> = new Observable();

  public filteredProducts$ : Observable<any> = new Observable();
  
  public products_array : any[] = [];

  public selectedProducts: any;

  _cs = inject(CourseService);

  constructor(){
    this.buyProductsForm = this._fb.group({
      selectedAny : ['',[Validators.required]],
    });

    //this.products = toSignal(this._cs.fetchProducts(), {initialValue: []});
    this.fetch_products();
    this.products_modified_signal = toSignal(this.products_modified$, {initialValue:[]});
    this.filter_products('all',0)
    this.filteredProducts_signal = toSignal(this.products_filtered_filtered$, {initialValue:[]});
  }

  ngOnInit(): void {
    
  }

  addToCart(){
    this.addToCart_output.emit();
  }
  addProduct(product:any){
    this.addProduct_output.emit(product);
  }

  
  fetch_products() {
    this.products_array = []
    // var gh:any = [];
    // this.productPrice$ = range(1,10).pipe(
    //   //switchMap((r:any) => r.pipe(
    //     map((r)=> ((r*2)+500)),
    //     map((d) => gh.push(d))
    //   //))
    // );
    // .subscribe({
    //   complete: ()=>{
    //     console.log('range',gh)
    //   }
    // })
   
   
    this.products$ = this._cs.fetchProducts()
    .pipe(
        filter((k:any) => k?.body?.map((r:any)=>r.price = Math.random()*1000)),
        // Iterate each product, and check price with condition
        //map((t:any)=>t.body.filter((q:any)=> q.price < 200))
        map((t:any)=>t?.body)
    )

    // .pipe(
    //   map((k:any) => k.body.filter((r:any)=>r.id > 3000))
    // )
    .subscribe({
      next:(q:any)=>{
        console.log("Products created",q);
        this.products_array.push(q);
      },
      error: ((err:Error)=>console.error(err)),
      complete: ()=>{ 
        this.products_modified$ = from(this.products_array);
        
      }
    });
  }


  filter_products(action:string, price:number){
    this.products_array = []
   // let products_filtered:Observable<any>;
    if(action === 'lessThan') {
      this.filteredAgainProducts$ = this.products_modified$
      .pipe(
        map((t:any) => t.filter((b:any) => b.price < price))
      );
    } else if(action === 'moreThan') {
      this.filteredAgainProducts$ = this.products_modified$
      .pipe(
        map((t:any) => t.filter((b:any) => b.price > price))
      );
    } else {
      this.filteredAgainProducts$ = this.products_modified$
      .pipe(
        map((t:any) => t)
      );
    }

    this.filteredAgainProducts$.subscribe({
      next:(n:any)=>{
        console.log("Products fitered",n);
        this.products_array.push(n);
      },
      complete:()=>{
        this.products_filtered_filtered$ = from(this.products_array);
      }
    });

    
  }
}
