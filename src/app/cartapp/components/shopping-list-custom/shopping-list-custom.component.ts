import { Component } from '@angular/core';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-shopping-list-custom',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './shopping-list-custom.component.html',
  styleUrl: './shopping-list-custom.component.scss'
})
export class ShoppingListCustomComponent {

}
