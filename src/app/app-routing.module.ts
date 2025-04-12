import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripInputComponent } from './component/trip-input/trip-input.component';
import { TripTimelineComponent } from './component/trip-timeline/trip-timeline.component';

const routes: Routes = [  

  { path: '', redirectTo: '/trip_visualizer', pathMatch: 'full' },

  { path: 'trip_visualizer', component: TripInputComponent },
  
  // { path: 'timeline', component: TripTimelineComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
