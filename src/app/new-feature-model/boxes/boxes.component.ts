import { Component, model, ModelSignal , output,  ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-boxes',
  standalone: true,
  imports: [],
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxesComponent {
  itemq = model<any[]>([]);
  tempArr : any[]= [];

  selectedBoxes = output<any[]>();

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

  createSelectedBoxes = () => {
    this.tempArr = this.itemq();
    let checkedBoxes = this.tempArr.filter(r => r.checked);
    this.selectedBoxes.emit(checkedBoxes);
  }

  onCheck = (type:string, w:number, data?:any, val?:any) => {
    this.processList(type,w,data,val)
  }
}
