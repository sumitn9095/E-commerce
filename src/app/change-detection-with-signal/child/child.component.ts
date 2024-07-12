import { Component , ChangeDetectionStrategy, Input, Signal, signal, WritableSignal} from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [],
  templateUrl: './child.component.html',
  styleUrl: './child.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent {
  ///@Input() parentPrice:WritableSignal<number> = signal<number>(0);
  @Input() parentPrice:string="0";
}
