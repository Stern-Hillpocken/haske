import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PopupModel } from '../models/popup.model';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private readonly _popupState$: BehaviorSubject<PopupModel> = new BehaviorSubject(new PopupModel("error", ""));

  constructor() { }

  _getPopupState$(): Observable<PopupModel> {
    return this._popupState$.asObservable();
  }

  pushValue(status: "error" | "info", content: string): void {
    this._popupState$.next(new PopupModel(status, content));
    setTimeout(() => {
      this._popupState$.next(new PopupModel(status, ""));
    }, 2000);
  }
}
