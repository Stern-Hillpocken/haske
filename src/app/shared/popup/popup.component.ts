import { Component } from '@angular/core';
import { PopupModel } from 'src/app/models/popup.model';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

  popup!: PopupModel;
  x: number = 0;
  y: number = 0;

  constructor(private pS: PopupService ) {
    this.pS._getPopupState$().subscribe((p: PopupModel) => {
      this.popup = p;
    });
    window.addEventListener('mousemove', (event) => {
      this.x = event.clientX;
      this.y = event.clientY;
    });
  }

}
