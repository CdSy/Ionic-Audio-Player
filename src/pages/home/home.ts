import { Component } from '@angular/core';
import { CoverPage } from '../cover-page/cover-page.component';
import { PlayList } from '../play-list/play-list.component';
import { SearchService } from '../../services/search.service';
import { AudioProvider } from 'ionic-audio';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public rootPage: any = CoverPage;
  public playList: any = PlayList;

  constructor() {}
}
