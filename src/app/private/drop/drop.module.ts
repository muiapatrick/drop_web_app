import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { ButtonsModule, WavesModule, NavbarModule, SidenavModule, AccordionModule, 
  CardsModule, AnimatedCardsModule, InputUtilitiesModule, InputsModule, DropdownModule,
  CheckboxModule, DatepickerModule,  } from 'ng-uikit-pro-standard';
import { DropRoutingModule } from './drop-routing.module';
import { ItemsComponent } from './items/items.component';
import { DropComponent } from './drop/drop.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatTableModule }  from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DropItemComponent } from './drop-item/drop-item.component';
import { DropActionComponent } from './drop-action/drop-action.component';
import { environment } from 'src/environments/environment';


// import { environment } from '../../../environments/environment';
//firebase modules
// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireStorageModule } from '@angular/fire/storage';
// import { AngularFireAuthModule } from '@angular/fire/auth';


@NgModule({
  declarations: [ItemsComponent, DropComponent, DropItemComponent, DropActionComponent],
  imports: [
    CommonModule,
    DropRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    MDBBootstrapModulesPro.forRoot(),
    NavbarModule, 
    WavesModule, 
    ButtonsModule,
    SidenavModule,
    AccordionModule,
    CardsModule,
    AnimatedCardsModule,
    InputsModule, 
    InputUtilitiesModule,
    DropdownModule,
    CheckboxModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_map_api_key,
      libraries: ['places']
    }),
    AgmDirectionModule,
    CheckboxModule,
    MatTableModule,
    MatCheckboxModule,
    PaginationModule,
    DatepickerModule,

    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule,
    // AngularFireAuthModule,
    // AngularFireStorageModule
    
  ]
})
export class DropModule { }
