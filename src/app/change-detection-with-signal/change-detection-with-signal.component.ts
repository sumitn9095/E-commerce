import { Component , signal, WritableSignal} from '@angular/core';
import { ChildComponent } from './child/child.component';

@Component({
  selector: 'app-change-detection-with-signal',
  standalone: true,
  imports: [ChildComponent],
  templateUrl: './change-detection-with-signal.component.html',
  styleUrl: './change-detection-with-signal.component.scss'
})
export class ChangeDetectionWithSignalComponent {
  price : WritableSignal<any> = signal<number>(233);
  otherPrice : any = {price: "322"};


  updatePrice(){
    this.otherPrice.price = "wwwwww";
  }
}


