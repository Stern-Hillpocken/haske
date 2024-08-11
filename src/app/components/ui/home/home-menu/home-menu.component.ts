import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameState } from 'src/app/models/game-state.model';

@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.scss']
})
export class HomeMenuComponent {

  @Input()
  pawnPosition!: string;

  @Output()
  pawnEnterEmitter: EventEmitter<string> = new EventEmitter();

  @Output()
  pawnEndEmitter: EventEmitter<void> = new EventEmitter();

  titles = ["Jouer", "Histoire", "Crédits", "?"];
  keywords = ["game", "background", "credits", "help"];

  layerX: number = 0;
  layerY: number = 0;

  onDragEnter(event: DragEvent): void {
    const div: HTMLDivElement  = (event.target as HTMLDivElement);
    this.pawnEnterEmitter.emit(div.attributes.getNamedItem("alt")?.value);
  }

  onPawnDragEnd(): void {
    this.pawnEndEmitter.emit();
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

}
