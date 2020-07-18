import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopsComponent } from './shops/shops.component';
import { ShopComponent } from './shop/shop.component';
import { ItemsComponent } from '../drop/items/items.component';
import { UsersComponent } from '../user/users/users.component';
import { UserComponent } from '../user/user/user.component';
import { ShopProfileComponent } from './shop-profile/shop-profile.component';


const routes: Routes = [
  { path: '', component: ShopsComponent },
  { path: 'add', component: ShopProfileComponent },
  { path: ':id', component: ShopComponent },
  { path: ':id/items', component: ItemsComponent },
  { path: ':id/users', component: UsersComponent },
  { path: ':id/users/:user_id', component: UserComponent },
  { path: ':id/profile', component: ShopProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopsRoutingModule { }
