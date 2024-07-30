import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, input, OnInit, AfterViewInit ,output, QueryList, ViewChild, ViewChildren, Signal, signal, effect, computed, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { concat, concatAll, concatMap, delay, from, fromEvent, map, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,ButtonModule, PanelModule, TableModule, SkeletonModule, ProgressSpinnerModule, InputGroupAddonModule, InputGroupModule, AsyncPipe],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.scss',
  changeDetection : ChangeDetectionStrategy.Default
})

export class ShoppingListComponent implements OnInit, AfterViewInit {
  public buyProductsForm!: FormGroup;
  _fb = inject(FormBuilder);

  public addToCart_output = output();
  public addProduct_output = output();
  public addToInventory_output = output<{}>();
  public selectedProducts: any;

  // public products = input<Observable<any>>();
  @Input() productsRxjs : Observable<any> = new Observable();
  // @Input() productsSignal : Signal<any> = signal<any>('a');
  public productsInputSignal = input<any>([]);
  //public productsSignal : WritableSignal<any[]> = signal<any[]>([]);

  productsSignal = computed(()=>this.productsInputSignal())

  @ViewChildren ('prodd') prodd! : QueryList<ElementRef>;
  @ViewChild ('qqq') qqq!  : ElementRef; 

  constructor(){
    this.buyProductsForm = this._fb.group({
      selectedAny : ['',[Validators.required]],
    });

    // effect(()=>{
    //   console.log("productsSignal--",this.productsSignal());
    //   this.productsSignal = this.productsInputSignal;
    // });

    // console.log("productsRxjs",this.productsRxjs)
    // console.log("productsSignal",this.productsSignal())
  }

  ngOnInit(): void {

   

   // let f :Observable<any>;
   
  }

  ngAfterViewInit(): void {
    // ConcatMat
    if(this.prodd !== undefined){
      this.prodd.map((e:ElementRef)=>{
         fromEvent(e.nativeElement, 'click').pipe(
            concatMap((d:any) => of(d).pipe(
              delay(3000)
            ))
            //tap((a:any) => console.log("inventory_products",a))
          ).subscribe({
            next:(a:any)=>console.log("concatMap",a.target.textContent)
          })
      })
    }

    // ConcatAll
    let g = [3,4,5,6,7];
    let w = [3,4,4,8,6,5,6,7];
    let z = [304,670];
    from([g,w,z])
    .pipe(
      map((r:any) => r),
      delay(3000),
      concatAll()
    )
    .subscribe({
      next:(q:any)=>{
        console.log("Concat-All",q)
      }
    })

    if(this.qqq !== undefined) {
      fromEvent(this.qqq.nativeElement, 'click').pipe(
          tap((e:any) => console.log("inventory_products",e))
      )
      .subscribe({
          next:(a:any)=>console.log("concatMap",a)
      });
    }
  }

  addToCart(){
    this.addToCart_output.emit(this.selectedProducts);
  }
  addProduct(product:any){
    this.addProduct_output.emit(product);
  }

  addToInventory(prod:{}){
    // this.addToInventory_output.emit(prod);
    this.addToInventory_output.emit(prod);
  }


  
  // inventory_products(prod:{}) {
  //   console.log("product",prod);
  //   fromEvent(this.prodd.nativeElement, 'click').pipe(
  //     delay(2000),
  //     concatMap((e:any) => e)
  //     // map((e:any) => console.log("inventory_products",e))
  //   )
  // }

}
