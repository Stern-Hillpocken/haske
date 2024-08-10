import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameStateService } from '../game-sate.service';

@Component({
  selector: 'app-draggable-image',
  templateUrl: './draggable-image.component.html',
  styleUrls: ['./draggable-image.component.scss']
})
export class DraggableImageComponent {

  @Input()
  name!: string;

  constructor(private gss: GameStateService) {}

  onDragStart(event: any): void {
    const img: HTMLImageElement = (event.target as HTMLImageElement);
    img.style.opacity = "0.2";
    this.gss.onDragStart(img.alt, "menu");
  }

  onDragEnd(): void {
    this.gss.onDragEnd();
  }

}
