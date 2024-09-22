import { Component, Input } from '@angular/core';
import { GameTime } from 'src/app/models/game-time.model';

@Component({
  selector: 'app-time-banner',
  templateUrl: './time-banner.component.html',
  styleUrls: ['./time-banner.component.scss']
})
export class TimeBannerComponent {

  @Input()
  time!: GameTime

  title: string = "";
  content: string = "";

  isTimeEvent(): boolean {
    if ([5, 6, 7, 8, 9].includes(this.time.tick)) {
      this.title = "Évènement environemental";
      this.content = "Un nouvel évènement vient d’arriver";
      return true;
    } else if (this.time.day >= 2 && [75, 76, 77, 78, 79].includes(this.time.tick)) {
      this.title = "Nouveaux et nouvelles arrivantes";
      this.content = "Des personnes sont arrivées dans le phare";
      return true;
    } else if (this.time.day >= 3 && [85, 86, 87, 88, 89].includes(this.time.tick)) {
      this.title = "Attaque des créatures";
      this.content = "Si tu ne les gères pas elles éteindront le phare";
      return true;
    } else if ([100, 0, 1, 2, 3].includes(this.time.tick)) {
      this.title = "La flamme diminue";
      this.content = "Le phare perd 1 de lueur, et les aikacis mangent";
      return true;
    }
    return false;
  }

}
