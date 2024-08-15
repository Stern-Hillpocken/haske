import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameWindow } from 'src/app/models/game-window.mode';
import { DraggableNames } from 'src/app/types/draggable-names.type';

@Component({
  selector: 'app-game-window',
  templateUrl: './game-window.component.html',
  styleUrls: ['./game-window.component.scss']
})
export class GameWindowComponent {

  @Input()
  currentDragName!: DraggableNames;

  @Input()
  windowInfo!: GameWindow;

  @Input()
  id!: number;

  @Output()
  draggableEnterEmitter: EventEmitter<number> = new EventEmitter();

  layerX: number = 0;
  layerY: number = 0;

  getTitle(): string {
    switch (this.windowInfo.name) {
      case "exploration": return "Exploration";
      case "lighthouse": return "Phare";
      case "storage": return "Entrepôt";
      case "quarry": return "Carrière";
      case "scrub": return "Brousailles";
      case "workbench": return "Atelier";
    }
  }

  onDragEnter(): void {
    this.draggableEnterEmitter.emit(this.id);
  }

  onWindowDragStart(event: any): void {
    this.layerX = event.layerX;
    this.layerY = event.layerY;
  }

  onWindowDragEnd(event: DragEvent): void {
    const div: HTMLDivElement = event.target as HTMLDivElement;
    div.style.left = event.clientX - this.layerX + div.offsetWidth/2 + "px";
    div.style.top = event.clientY - this.layerY + "px";
    let maxZ = 0;
    for(let i = 0; i < document.getElementsByClassName("window-box").length; i++) {
      let checkingZ: number = parseInt((document.getElementsByClassName("window-box")[i] as HTMLDivElement).style.zIndex);
      if(checkingZ > maxZ) maxZ = checkingZ;
    }
    div.style.zIndex = (maxZ + 1).toString();
  }

  isDropableHere(): boolean {
    if (this.currentDragName === "nothing") return true;
    if (this.windowInfo.acceptance.includes(this.currentDragName)) return true;
    return false;
  }

}
