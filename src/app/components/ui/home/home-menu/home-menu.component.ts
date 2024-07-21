import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.scss']
})
export class HomeMenuComponent {

  @Output()
  pawnEnterEmitter: EventEmitter<string> = new EventEmitter();

  onDragEnter(event: DragEvent): void {
    const holder:HTMLImageElement  = (event.target as HTMLImageElement);
    this.pawnEnterEmitter.emit(holder.alt);
  }

}
