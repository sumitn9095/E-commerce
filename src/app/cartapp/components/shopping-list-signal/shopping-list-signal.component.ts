
import { Component, inject, output, signal, Signal, OnInit, computed, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { filter, from, map, Observable } from 'rxjs';
import { CourseService } from '../../utility/course.service';
import { AsyncPipe } from '@angular/common';
import { NgFor } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ShoppingListComponent } from '../shopping-list/shopping-list.component';
import { compileFunction } from 'vm';

@Component({
  selector: 'app-shopping-list-signal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ShoppingListComponent,ButtonModule, PanelModule, TableModule, SkeletonModule, ProgressSpinnerModule, InputGroupAddonModule, InputGroupModule, AsyncPipe, NgFor],
  templateUrl: './shopping-list-signal.component.html',
  styleUrl: './shopping-list-signal.component.scss'
})

export class ShoppingListSignalComponent implements OnInit {
  public buyProductsForm!: FormGroup;
  _fb = inject(FormBuilder);
  public addToCart_output = output();
  public addProduct_output = output();

  public products$ : Observable<any> = new Observable();
  public products_signal:WritableSignal<any>  = signal({});
  public products_copy_signal:WritableSignal<any>  = signal({});

  public selectedProducts: any;

  _cs = inject(CourseService);

  constructor(){
    this.buyProductsForm = this._fb.group({
      selectedAny : ['',[Validators.required]],
    });
    //this.products = toSignal(this._cs.fetchProducts(), {initialValue: []});
    this.fetch_products();
    this.products_signal.update(toSignal(this.products$, {initialValue:[]}));
    this.products_copy_signal.update(this.products_signal);
    // this.filter_products('all',0)
    // this.filteredProducts_signal = toSignal(this.products_filtered_filtered$, {initialValue:[]});
  }

  ngOnInit(): void {
    
  }

  addToCart(data:any){
    this.addToCart_output.emit(data);
  }
  addProduct(product:any){
    this.addProduct_output.emit(product);
  }

  fetch_products() {
    this.products$ = this._cs.fetchProducts()
    .pipe(
        filter((k:any) => k?.body?.map((r:any, i:number)=>{r.price = Math.round(Math.random()*1000);r.no = i+1;})),
        // Iterate each product, and check price with condition
        //map((t:any)=>t.body.filter((q:any)=> q.price < 200))
        map((t:any)=>t?.body)
    )
  }

  filter_products(action:string, price:number){
    if(action === 'lessThan') {
      this.products_signal.update(this.products_copy_signal);
      this.products_signal.update(
        computed(
          () => this.products_copy_signal().filter((r:any)=>r.price < price)
        )
      )
    } else if(action === 'moreThan') {
      this.products_signal.update(this.products_copy_signal);
      this.products_signal.update(
        computed(
          () => this.products_copy_signal().filter((r:any)=>r.price > price)
        )
      )
    } else {
      this.products_signal.update(this.products_copy_signal);
      this.products_signal.update(
        computed(
          () => this.products_copy_signal()
        )
      )
    }
  }

}
