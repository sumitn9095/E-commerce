import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-custom-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './custom-checkbox.component.html',
  styleUrl: './custom-checkbox.component.scss'
})
export class CustomCheckboxComponent {
  label = input<string>();
  value = model<boolean>();
  // custom_text = model<string>("");
  onToggle(){
    this.value.update(v => !v);
  }
}
