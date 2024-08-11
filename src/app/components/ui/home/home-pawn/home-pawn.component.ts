import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-home-pawn',
  templateUrl: './home-pawn.component.html',
  styleUrls: ['./home-pawn.component.scss']
})
export class HomePawnComponent {

  @Output()
  pawnEndEmitter: EventEmitter<void> = new EventEmitter();

  onPawnDragEnd(): void {
    this.pawnEndEmitter.emit();
  }

}
