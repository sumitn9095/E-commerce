import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CartService } from '../../utility/cart.service';
import { SidecartComponent } from '../../components/sidecart/sidecart.component';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,SidecartComponent],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent {
  _cart = inject(CartService);
  shouldOpenSideCart = signal<boolean>(false);
  processOutputSideCart(data:boolean){
    //console.log("processOutputSideCart",data);
    this.shouldOpenSideCart.set(data);
    console.log("processOutputSideCart",data);
    // this.shouldOpenSideCart.s
  }
}
