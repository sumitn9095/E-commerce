import { Component , ModelSignal, model, ChangeDetectionStrategy} from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-drop-down-names',
  standalone: true,
  imports: [NgFor],
  templateUrl: './drop-down-names.component.html',
  styleUrl: './drop-down-names.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropDownNamesComponent {
  itemq = model<any[]>([]);
  isDropdownNameVisible : boolean = false;
  tempArr : any[]= [];
  processList = (type:string, w:number, data?:any,val?:any) => {
    console.log("input-val",data)
    this.tempArr = this.itemq();
    this.tempArr.map((v,i) => {
      if(i === w) {
        if(type === 'check') this.tempArr[i].checked = !v.checked;
        if(type === 'name') this.tempArr[i].name = data?.target?.value;
      }
    });
    this.itemq.update(r => ([...this.tempArr]));
  }
  onCheck = (type:string, w:number, data?:any, val?:any) => {
    this.processList(type,w,data,val)
  }

}
