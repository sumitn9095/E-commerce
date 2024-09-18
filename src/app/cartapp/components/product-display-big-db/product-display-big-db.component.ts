import { Component, ChangeDetectionStrategy, OnInit, Input, EventEmitter, Output, signal, computed, WritableSignal, effect, input, output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonConstants } from '../../utility/CommonConstants';
import { CarouselModule } from 'primeng/carousel';
import { environment } from '../../../../environments/environment';
import moment, { Moment } from 'moment';

@Component({
  selector: 'app-product-display-big-db',
  standalone: true,
  imports: [ButtonModule, CarouselModule],
  templateUrl: './product-display-big-db.component.html',
  styleUrl: './product-display-big-db.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductDisplayBigDbComponent implements OnInit{
  m2 = moment;
  @Input() item:any = [];
  productView = input<boolean>(false);
  public qtyCount : WritableSignal<number> = signal(1);
  evt = output<any>();
  mode = input<string>('');
  user:any = CommonConstants.user();
  env = environment.base_url;
  imgPath:string=''

  ngOnInit(): void {
    if(!this.productView()) this.qtyCount.update(computed( ()=>parseInt(this.item?.qty)) );
    //console.log("user",this.user);
    if(this.item?.imagePath?.length) {
      this.imgPath = this.env + this.item?.imagePath[0];
    } else {
      this.imgPath = 'https://placehold.co/84x84?text='+ this.item?.name;
    }
  }

  emitUpdatedProdDetails = () => {
    const qtyCount = this.qtyCount();
    console.log("qtyCount",qtyCount);
    let updatedProdDetails = { id : this.item?.id, qty : qtyCount }
    this.evt.emit(updatedProdDetails)
  }

  eventProductAction = (action:string, product:{}) => action === 'buy' ? this.evt.emit({type:'buy', product:product}) : this.evt.emit({type:'delete', product:product})

  removeQty = () => {
    this.qtyCount.update((q) => q < 1 ? 0 : q - 1)
    this.emitUpdatedProdDetails()
    //this.qtyCount = this.qtyCount < 1 ? 0 : this.qtyCount - 1
  }
  addQty = () => {
    this.qtyCount.update((q) => q + 1);
    this.emitUpdatedProdDetails()
    //this.qtyCount = this.qtyCount > 1 ? 0 : this.qtyCount
    //this.qtyCount++;
  }
}
