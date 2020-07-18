import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivateComponent } from './private/private.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../_providers/guards/auth.guard';
import { UserFormComponent } from './user/user-form/user-form.component';
import { UserComponent } from './user/user/user.component';


const routes: Routes = [
  { path: '', component: PrivateComponent,
    canActivate: [AuthGuard],
    children: [
      // { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      // { path: 'dashboard', component: DashboardComponent },
      { path: 'item', loadChildren: () => import('./drop/drop.module').then(m => m.DropModule) },
      { path: 'shops', loadChildren: () => import('./shops/shops.module').then(m => m.ShopsModule) },
      { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
      // { path: 'user-profile', component: UserComponent}
    ]
  }
  // { path: '', component: PrivateComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     { path: '', loadChildren: () => import('./drop/drop.module').then(m => m.DropModule) },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'shops', loadChildren: () => import('./shops/shops.module').then(m => m.ShopsModule) },
  //     { path: 'users', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  //     { path: 'user-profile', component: UserComponent}

  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
