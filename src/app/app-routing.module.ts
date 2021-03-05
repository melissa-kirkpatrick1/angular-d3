import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsMapComponent } from './us-map/us-map.component';
const routes: Routes = [{ path: 'us-map', component: UsMapComponent },
  { path: '', component: UsMapComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
