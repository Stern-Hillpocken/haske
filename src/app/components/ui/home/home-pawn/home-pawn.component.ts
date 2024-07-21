import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-home-pawn',
  templateUrl: './home-pawn.component.html',
  styleUrls: ['./home-pawn.component.scss']
})
export class HomePawnComponent {

  layerX: number = 0;
  layerY: number = 0;

  @Output()
  pawnDragEndEmitter: EventEmitter<string> = new EventEmitter();

  onDragStart(event: any): void {
    (event.target as HTMLImageElement).style.opacity = "0.2";
    this.layerX = event.layerX;
    this.layerY = event.layerY;
  }

  onDragEnd(event: DragEvent): void {
    const img: HTMLImageElement = (event.target as HTMLImageElement);
    img.style.opacity = "1";
    img.style.left = event.clientX - this.layerX + "px";
    img.style.top = event.clientY - this.layerY + "px";
    this.pawnDragEndEmitter.emit(img.alt);
  }

}
