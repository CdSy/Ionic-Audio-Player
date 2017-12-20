import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule }    from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler, NavController } from 'ionic-angular';
import { Media } from '@ionic-native/media';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { PlayList } from '../pages/play-list/play-list.component';
import { Controls } from '../pages/controls/controls.component';
import { CoverPage } from '../pages/cover-page/cover-page.component';

import { SearchService } from '../services/search.service';
import { PlayerService } from '../services/player.service';
import { ConvertAtTime } from '../services/convertAtTime.pipe';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PlayList,
    Controls,
    CoverPage,
    ConvertAtTime
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PlayList,
    Controls,
    CoverPage
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    SearchService,
    PlayerService,
    StatusBar,
    SplashScreen,
    File,
    Media,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
