import { Component, inject, input, model, output } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ToolbarModule } from 'primeng/toolbar';
import { CartService } from '../../utility/cart.service';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SkeletonModule, ToolbarModule, BadgeModule],
  providers:[],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  _cart = inject(CartService);
  firstName = model<string>();
  lastName = model<string>();
  cartQty = input('');
  outputSideCart = output<boolean>();
  constructor(){}

}
