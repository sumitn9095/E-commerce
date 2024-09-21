import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ToolbarModule } from 'primeng/toolbar';
import { CartService } from '../../utility/cart.service';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../pages/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { CommonConstants } from '../../utility/CommonConstants';
import { MenuModule } from 'primeng/menu';import { DropdownModule  } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ShopService } from '../../utility/shop.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SkeletonModule, ToolbarModule, BadgeModule, MenuModule, ButtonModule, SplitButtonModule],
  providers:[],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  _cart = inject(CartService);
  _auth = inject(AuthService);
  // firstName = model<string>();
  // lastName = model<string>();
  cartQty = input('');
  outputSideCart = output<any>();
  profileOptions:any=['Cart History','Sign Out'];
  items: MenuItem[] | undefined;
  user:any=undefined;
  _shop = inject(ShopService)
  constructor() {
    this.user=CommonConstants.user();
    let yitems:any=[]
    if(this.user){
      yitems = [
          {
              label: 'Products Showroom',
              icon: 'pi pi-shopping-cart',
              routerLink: ['/shopping']
          },
          {
              label: 'Categories',
              icon: 'pi pi-box',
              routerLink: ['/category']
          },
          {
              label: 'Sign Out',
              icon: 'pi pi-sign-out',
                command: () => {
                  this._auth.signout();
              }
          }
      ];
    }

    if(this.user && !this.user?.admin) {
      yitems.unshift(
        {
          label: 'Cart History',
          icon: 'pi pi-database',
          routerLink: ['/cart-history']
        },
      )
    }

    this.items = yitems;

    console.log("user",this.user)
  }

  ngOnInit(): void {
    this._shop.stateBs.subscribe(d => {
      console.log("Print State",d);
    })
  }

  processProfileDropdown(data:any){
    console.log("processProfileDropdown",data);
  }
}
