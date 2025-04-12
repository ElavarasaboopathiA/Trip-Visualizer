import { Component } from '@angular/core';
import { TripService } from '../trip.service';

@Component({
  selector: 'app-trip-input',
  templateUrl: './trip-input.component.html',
  styleUrls: ['./trip-input.component.scss']
})
export class TripInputComponent {
  start = '';
  end = '';
  trips: { start: string; end: string }[] =[];
  isView:boolean=false

  constructor(private tripService: TripService) {}

  addTrip() {
    if (this.start && this.end) {
      const newTrip = {
        start: this.start.trim().toUpperCase().slice(0, 3),
        end: this.end.trim().toUpperCase().slice(0, 3),
      };

      this.trips.push(newTrip);
      this.tripService.addTrip(newTrip);

      this.start = '';
      this.end = '';
    }
  }
  showMap(){
    this.isView=!this.isView
    // this.tripService.tripsSubject.next(this.trips);
  }
}
