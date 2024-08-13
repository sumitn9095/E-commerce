import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-cart-history',
  standalone: true,
    imports: [
     HeaderComponent,  ToastModule, 
     ButtonModule, PanelModule, TableModule, SkeletonModule, InputTextModule, ProgressSpinnerModule,  InputGroupAddonModule, InputGroupModule],
  templateUrl: './cart-history.component.html',
  styleUrl: './cart-history.component.scss'
})
export class CartHistoryComponent implements OnInit {
  _shop = inject(ShopService);

  constructor(){
    
  }

  ngOnInit(): void {
    this.fetchCartHistory();
  }

  fetchCartHistory(){
    this._shop.cartHistory().subscribe({
      next: (response)=>{
        console.log("cart history",response);
      },
      error: (err)=>console.log("cart history",err)
    })
  }

}
