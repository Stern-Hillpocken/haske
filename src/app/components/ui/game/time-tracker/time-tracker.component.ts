import { Component, EventEmitter, Input, Output } from '@angular/core';
import { timeInterval } from 'rxjs';
import { GameTime } from 'src/app/models/game-time.model';

@Component({
  selector: 'app-time-tracker',
  templateUrl: './time-tracker.component.html',
  styleUrls: ['./time-tracker.component.scss']
})
export class TimeTrackerComponent {

  @Input()
  time!: GameTime;

  @Output()
  tickEmitter: EventEmitter<void> = new EventEmitter();

  speed: number = 1;

  constructor() {
    this.tick();
  }

  tick(): void {
    setInterval(() => {
      this.tickEmitter.emit();
    }, 1000/this.speed);
  }

}
