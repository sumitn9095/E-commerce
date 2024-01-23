import { Component } from '@angular/core';
import { Signal,signal, WritableSignal, computed, effect} from '@angular/core';
import { a1Component } from './a1/a1.component';
import { B1Component } from './b1/b1.component';
import { C1Component } from './c1/c1.component';


@Component({
  selector: 'app-test',
  standalone: true,
  imports: [a1Component,B1Component,C1Component],

  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  public myFavNum : WritableSignal<number> = signal(2);
  public mySpclFavNum : Signal<number> = computed(() => this.myFavNum() + 50)
  constructor(){
    //this.consoleLogMyFavNum();
    effect(()=>{
      this.consoleLogMyFavNum()
    })
  }

  consoleLogMyFavNum = () => {
    console.log(`My Fav Num is`+this.myFavNum());
  }
  consoleLogMySpclFavNum = () => {
    console.log(`My Fav Num is`+this.mySpclFavNum());
  }
  updateMyFavNum = (val:number) => {
      this.myFavNum.set(val)
     // this.consoleLogMyFavNum();
  }
  surpriseMeMyFavNum = () => {
    this.myFavNum.update((x:number) => x + 10)
   // this.consoleLogMyFavNum();
  }

  

}
