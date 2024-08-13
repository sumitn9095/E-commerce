import { Component, inject, input, model, output } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ToolbarModule } from 'primeng/toolbar';
import { CartService } from '../../utility/cart.service';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../pages/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';import { DropdownModule  } from 'primeng/dropdown';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SkeletonModule, ToolbarModule, BadgeModule, MenuModule, ButtonModule],
  providers:[],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  _cart = inject(CartService);
  _auth = inject(AuthService);
  // firstName = model<string>();
  // lastName = model<string>();
  cartQty = input('');
  outputSideCart = output<any>();
  profileOptions:any=['Cart History','Sign Out'];
  items: MenuItem[] | undefined;
  constructor(){
    this.items = [
            {
                label: 'Options',
                items: [
                    {
                        label: 'Cart History',
                        icon: 'pi pi-refresh',
                        route: '/cart-history'
                    },
                    {
                        label: 'Sign Out',
                        icon: 'pi pi-upload',
                         command: () => {
                            this._auth.signout();
                        }
                    }
                ]
            }
        ];
  }

  processProfileDropdown(data:any){
    console.log("processProfileDropdown",data);
  }
}
