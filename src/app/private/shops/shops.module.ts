import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro, TabsModule, ChartsModule, WavesModule } from 'ng-uikit-pro-standard';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { ShopsRoutingModule } from './shops-routing.module';
import { ShopsComponent } from './shops/shops.component';
import { ShopComponent } from './shop/shop.component';
import { ShopProfileComponent } from './shop-profile/shop-profile.component';
import { AgmCoreModule } from '@agm/core';
import { FormWizardModule } from 'src/app/shared/components/form-wizard/form-wizard.module';
import { ShopFormComponent } from './shop-form/shop-form.component';


@NgModule({
  declarations: [ShopsComponent, ShopComponent, ShopProfileComponent, ShopFormComponent],
  imports: [
    CommonModule,
    ShopsRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    MDBBootstrapModulesPro.forRoot(),
    ChartsModule, 
    TabsModule, 
    WavesModule,
    PaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC_2bjO2wL-sv-Gaq94-j63rHm2Jo8SJB8',
      libraries: ['places']
    }),
    FormWizardModule

  ]
})
export class ShopsModule { }
