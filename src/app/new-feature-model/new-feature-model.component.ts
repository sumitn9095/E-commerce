import { Component, effect, signal, ModelSignal} from '@angular/core';
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';
import { NgClass } from '@angular/common';
import { DropdownComponent } from './dropdown/dropdown.component';
import { DropDownNamesComponent } from './drop-down-names/drop-down-names.component';
import { BoxesComponent } from './boxes/boxes.component';

@Component({
  selector: 'app-new-feature-model',
  standalone: true,
  imports: [CustomCheckboxComponent, NgClass, DropdownComponent, DropDownNamesComponent, BoxesComponent],
  templateUrl: './new-feature-model.component.html',
  styleUrl: './new-feature-model.component.scss'
})
export class NewFeatureModelComponent {
  sumit = signal<boolean>(false);
  stonecold = signal<boolean>(false);
  undertakerT = signal<boolean>(false);

  completed = signal<boolean>(false);
  public brock = signal<boolean[]>([true, false, false]);
  mockdata = [
    { name: 'jim', checked: true },
    { name: 'Mack', checked: false },
    { name: 'Johny', checked: true },
    { name: 'Vase', checked: false }
  ];
  public shawn = signal<any[]>(this.mockdata);

  constructor(){
    effect(()=>{
      //console.log("Effect Triggered:")
      //console.log("ll", this.dropDownStatus()[0]);
      console.log("Effect Triggered:sumit", this.shawn());
      // console.log("Effect Triggered:stonecold", this.stonecold());
      // console.log("Effect Triggered:undertakerT", this.undertakerT());
      // console.log("Effect Triggered:brock", this.brock());
      // this.dropDownStatus().map((t:boolean)=>{
      //   console.log("Effect Triggered:", t);
      // })
    })
  }

  readSelectedBoxes = (data:any) => {
    console.log("readSelectedBoxes",data);
  }

  // onToggle(){
  //   this.completed.update(o => !o)
  // }
}


