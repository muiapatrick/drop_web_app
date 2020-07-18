import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: '', loadChildren: () => import('./public/public.module').then(m => m.PublicModule) },
  // { path: 'drop', loadChildren: () => import('./private/private.module').then(m => m.PrivateModule) },
  { path: 'drop', loadChildren: () => import('./private/private.module').then(m => m.PrivateModule) },
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
