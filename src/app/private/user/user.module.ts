import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro, WavesModule } from 'ng-uikit-pro-standard';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { UserRoutingModule } from './user-routing.module';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './user/user.component';
import { FormWizardModule } from 'src/app/shared/components/form-wizard/form-wizard.module';
import { UserFormComponent } from './user-form/user-form.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [UsersComponent, UserComponent, UserFormComponent, ResetPasswordComponent, ProfileComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModulesPro.forRoot(),
    WavesModule,
    PaginationModule,
    FormWizardModule
  ]
})
export class UserModule { }
