import { Component , AfterContentInit ,ContentChild, ViewChildren, viewChildren, ElementRef, QueryList, contentChildren } from '@angular/core';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})

export class ContentComponent implements AfterContentInit {
  constructor(){}
  @ContentChild('pcontent') pcontent! : ElementRef;
  alContentChildren = contentChildren<any>("lll")

  // @ViewChildren('fff') dddd! : QueryList<ElementRef>;
  ngAfterContentInit(): void {
      // let jj = this.pcontent.nativeElement.innerHTML;
      // console.log("jj",jj);
  }
}