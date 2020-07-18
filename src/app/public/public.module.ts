import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public/public.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { LoginComponent } from './login/login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RegisterComponent } from './register/register.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';

@NgModule({
  declarations: [PublicComponent, LoginComponent, RegisterComponent, ForgotComponent, ResetComponent ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MDBBootstrapModulesPro,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
        
  ]
})
export class PublicModule { }
