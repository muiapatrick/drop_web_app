import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // MDBBootstrapModulesPro.forRoot()MDBSpinningPreloader
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
