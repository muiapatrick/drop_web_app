import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarModule, AnimatedCardsModule, CardsModule, InputsModule, InputUtilitiesModule, WavesModule, ButtonsModule } from 'ng-uikit-pro-standard';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public/public.component';

@NgModule({
  declarations: [PublicComponent],
  imports: [
    CommonModule,
    PublicRoutingModule,
    NavbarModule,
    AnimatedCardsModule, 
    CardsModule, 
    InputsModule, 
    InputUtilitiesModule, 
    WavesModule, 
    ButtonsModule,
  ]
})
export class PublicModule { }
