import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import { DropComponent } from './drop/drop.component';
import { DropItemComponent } from './drop-item/drop-item.component';

const routes: Routes = [
  { path: '', component: DropItemComponent },
  { path: 'list', component: ItemsComponent },
  { path: 'near-shops', component: DropComponent } 

  // { path: '', component: DropComponent },
  // { path: 'item', pathMatch: 'full', component: DropItemComponent},
  // { path: 'item/:id', pathMatch: 'full', component: DropItemComponent},
  // { path: 'myitems', component: ItemsComponent }  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DropRoutingModule { }
