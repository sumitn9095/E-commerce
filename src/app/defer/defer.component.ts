import { Component } from '@angular/core';
import { HeavyComponent } from './heavy/heavy.component';
import { PanelModule } from 'primeng/panel';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-defer',
  standalone: true,
  imports: [CommonModule,HeavyComponent,PanelModule,SkeletonModule,ProgressSpinnerModule],
  templateUrl: './defer.component.html',
  styleUrl: './defer.component.scss'
})
export class DeferComponent {

}
