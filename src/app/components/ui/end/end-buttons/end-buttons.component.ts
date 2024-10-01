import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-end-buttons',
  templateUrl: './end-buttons.component.html',
  styleUrls: ['./end-buttons.component.scss']
})
export class EndButtonsComponent {

  @Output()
  dragEndEmitter: EventEmitter<"menu" | "tuto" | "game"> = new EventEmitter();

  titles: string[] = ["Choix", "Menu", "Tutoriel", "Partie classique"];
  lastEnter: number = 0;

  onDragEnter(index: number): void {
    this.lastEnter = index;
  }

  onDragEnd(): void {
    if (this.lastEnter === 0) return;

    let label: "menu" | "tuto" | "game" = "menu";
    if (this.lastEnter === 2) label = "tuto";
    if (this.lastEnter === 3) label = "game";
    this.dragEndEmitter.emit(label);
  }

}
