import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnLoadingComponent } from './btn-loading/btn-loading.component';

const components = [
  BtnLoadingComponent
]

@NgModule({
  declarations: [components],
  exports: [components],
  imports: [
    CommonModule
  ]
})
export class AppButtonsModule { }
