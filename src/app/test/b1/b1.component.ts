import { ChangeDetectionStrategy, Component, OnInit, signal, OnChanges, SimpleChanges, effect, untracked} from '@angular/core';
import { TestService } from '../../cartapp/utility/test.service';

@Component({
  selector: 'app-b1',
  standalone: true,
  imports: [],
  templateUrl: './b1.component.html',
  styleUrl: './b1.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class B1Component implements OnInit,OnChanges {
  public boolList: Array<any> = [];
  public computedMssgg:any = ''
  public mssg:any = ''
  public sig =signal(0);
  constructor(private _ts : TestService) {
    this.sig.update( o => o + Math.random())
    ///this._ts.setMessg('dddddff')
    effect((d)=>{
      this.mssg = this._ts.readMssg();
      console.log("Reading Mssg >>  ", this.mssg);

      this.computedMssgg = this._ts.mssgUpdated()
      //console.log("Reading this.computedMssgg >>  "+this.computedMssgg);

      this.boolList = this._ts.books();
      //console.log("Reading Mssg >>  ", this.boolList);
    })
  }
  ngOnInit(): void {
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("B1 - changes",changes)
  }
}
