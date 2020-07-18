import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private/private.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './menu/sidebar/sidebar.component';
import { TopnavBarComponent } from './menu/topnav-bar/topnav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { SpinnerComponent } from './../shared/components/spinner/spinner.component';
import { Spinner1Component } from './../shared/components/spinner1/spinner1.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PrivateComponent, DashboardComponent, SidebarComponent, TopnavBarComponent, FooterComponent, Spinner1Component, SpinnerComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    MDBBootstrapModulesPro, 
    FormsModule,
    ReactiveFormsModule,
    
    
  ]
})
export class PrivateModule { }
