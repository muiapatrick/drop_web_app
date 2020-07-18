import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputsModule, InputUtilitiesModule, WavesModule, ButtonsModule, AnimatedCardsModule, CardsModule } from 'ng-uikit-pro-standard';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    InputsModule, 
    InputUtilitiesModule, 
    WavesModule, 
    ButtonsModule,
    AnimatedCardsModule,
    CardsModule,
    MDBBootstrapModulesPro,
    FormsModule, ReactiveFormsModule,

  ]
})
export class HomeModule { }
