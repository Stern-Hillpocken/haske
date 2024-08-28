import { Component, Input } from '@angular/core';
import { GameStateService } from '../game-sate.service';
import { DraggableNames } from 'src/app/types/draggable-names.type';

@Component({
  selector: 'app-draggable-image',
  templateUrl: './draggable-image.component.html',
  styleUrls: ['./draggable-image.component.scss']
})
export class DraggableImageComponent {

  @Input()
  name!: DraggableNames;

  @Input()
  windowId!: number;

  constructor(private gss: GameStateService) {}

  onDragStart(): void {
    this.gss.onDragStart(this.name, this.windowId);
  }

  onDragEnd(): void {
    this.gss.onDragEnd();
  }

  correctName(): string {
    if (this.name.startsWith("note-")) return "note";
    return this.name;
  }

}
