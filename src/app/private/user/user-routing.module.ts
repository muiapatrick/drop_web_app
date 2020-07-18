import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './user/user.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  // { path: '', component: UserComponent },
  // { path: '/:id', component: UserComponent },
  { path: 'profile', component: ProfileComponent}

  // { path: '', component: UsersComponent },
  // { path: '/:id', component: UserComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
