import { ChangeDetectionStrategy, Component ,ElementRef,OnChanges, AfterViewInit, SimpleChanges, ViewChild} from '@angular/core';
import { TestService } from '../../test.service';

@Component({
  selector: 'app-a1',
  standalone: true,
  imports: [],
  templateUrl: './a1.component.html',
  styleUrl: './a1.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class a1Component implements OnChanges, AfterViewInit {

  constructor(private _ts : TestService){}

  @ViewChild("bookId") "bookId" : ElementRef
  @ViewChild("bookName") "bookName" : ElementRef
  @ViewChild("bookPages") "bookPages" : ElementRef

  ngOnChanges(changes: SimpleChanges): void {
    console.log("A1 - changes",changes)
  }

  sendMssg(val:string) {
    this._ts.setMessg(val);
  }
  mssg_computed(){
    this._ts.mssgComputed();
  }
  sendMssg2(val:string) {
    this._ts.setMessg2(val);
  }

  ngAfterViewInit(): void {
    let gg = this.bookId.nativeElement
    console.log("gg",gg.value)
  }

  addBooks=()=>{
    let bookIdVal = Number(this.bookId.nativeElement.value)
    let bookNameVal = this.bookName.nativeElement.value
    let bookPagesVal = Number(this.bookPages.nativeElement.value)
    let obj = {id:bookIdVal, name:bookNameVal, pages:bookPagesVal}
    this._ts.addBooks(obj);
  }


}