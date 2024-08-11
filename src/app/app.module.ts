import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { GameComponent } from './components/features/game/game.component';
import { HomeComponent } from './components/features/home/home.component';
import { HomeHeaderComponent } from './components/ui/home/home-header/home-header.component';
import { HomeMenuComponent } from './components/ui/home/home-menu/home-menu.component';
import { HomePawnComponent } from './components/ui/home/home-pawn/home-pawn.component';
import { HomeDisplayComponent } from './components/ui/home/home-display/home-display.component';
import { DraggableImageComponent } from './shared/draggable-image/draggable-image.component';
import { TimeTrackerComponent } from './components/ui/game/time-tracker/time-tracker.component';
import { TimeBannerComponent } from './components/ui/game/time-banner/time-banner.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    GamePageComponent,
    GameComponent,
    HomeComponent,
    HomeHeaderComponent,
    HomeMenuComponent,
    HomePawnComponent,
    HomeDisplayComponent,
    DraggableImageComponent,
    TimeTrackerComponent,
    TimeBannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
