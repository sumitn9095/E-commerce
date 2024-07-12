import { Component , input, model, ModelSignal} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
  label = input<string>();
  value : ModelSignal<boolean[]> = model<boolean[]>([]);
  kll : any[]=[];
  
  onCheck=(i:number) => {
   this.kll = this.value();
   this.kll.map((v,w) : any => {
      if(i === w) {
        console.log("this.kll",i,w);
        this.kll[w] = !v;
      }
    });
   this.value.update(g => ([...this.kll]));
  }
}
