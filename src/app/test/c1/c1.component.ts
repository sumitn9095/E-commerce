import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, effect } from '@angular/core';
import { TestService } from '../../test.service';

@Component({
  selector: 'app-c1',
  standalone: true,
  imports: [],
  templateUrl: './c1.component.html',
  styleUrl: './c1.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C1Component implements OnInit,OnChanges {
  public c1var = ''
  constructor(private _ts: TestService) {
    effect(()=>{
      let mssg2 = this._ts.readMssg2()
      console.log("read Mssg2 >> "+mssg2)
     /// this._ts.setMessg2('update C1')
    })
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.c1var = "AADDD"
    }, 3000);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("C1 - changes",changes)
  }
}
