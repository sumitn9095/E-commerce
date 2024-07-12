import { Component, viewChild, ElementRef, Signal, effect, ViewContainerRef, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content/content.component';
@Component({
  selector: 'app-new-features',
  standalone: true,
  imports: [CommonModule,ContentComponent],
  templateUrl: './new-features.component.html',
  styleUrl: './new-features.component.scss'
})
export class NewFeaturesComponent {
  signalViewchild = viewChild('inpViewChild', { read: ViewContainerRef });
  //templateDemo = viewChild('templateDemo', { read: TemplateRef<undefined>});
  @ViewChild('templateDemo', {read: TemplateRef}) templateDemo!: TemplateRef<ElementRef>;
  @ViewChild('vref', {read: ViewContainerRef}) vref!: ViewContainerRef;

  constructor() {
    console.log('Signal Viewchild - ',this.signalViewchild());
    effect(()=>{
      console.log('Get Signal Viewchild on its change - ',this.signalViewchild());
    })
  }
  
  getSignalViewChild() {
    this.signalViewchild()?.createEmbeddedView(this.templateDemo)
    this.vref.createEmbeddedView(this.templateDemo)
    console.log('Signal Viewchild - ',this.signalViewchild());
  }
}
