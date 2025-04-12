import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class TripService {
  private trips: { start: string, end: string }[] = []
  public tripsSubject = new BehaviorSubject(this.trips);
  trips$ = this.tripsSubject.asObservable();

  addTrip(trip: { start: string, end: string }) {
    this.trips.push(trip);
    
    this.tripsSubject.next(this.trips);
  }
}

