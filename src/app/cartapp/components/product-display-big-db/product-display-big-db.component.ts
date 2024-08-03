import { Component, ChangeDetectionStrategy, OnInit, Input, EventEmitter, Output, signal, computed, WritableSignal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-display-big-db',
  standalone: true,
  imports: [],
  templateUrl: './product-display-big-db.component.html',
  styleUrl: './product-display-big-db.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductDisplayBigDbComponent implements OnInit{
  @Input() public item : any;
  public qtyCount : WritableSignal<number> = signal(1);
  @Output() public evt = new EventEmitter<any>();
  
  ngOnInit(): void {
    this.qtyCount.set(parseInt(this.item?.qty));

    console.log("item",this.item)
  }

  emitUpdatedProdDetails = () => {
    const qtyCount = this.qtyCount();
    console.log("qtyCount",qtyCount);
    let updatedProdDetails = { id : this.item?.id, qty : qtyCount }
    this.evt.emit(updatedProdDetails)
  }

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
