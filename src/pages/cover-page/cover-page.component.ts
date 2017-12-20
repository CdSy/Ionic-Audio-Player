import { Component, OnInit, AfterViewInit} from '@angular/core';
import { SearchService } from '../../services/search.service';
import { PlayList } from '../play-list/play-list.component';
import { NavController } from 'ionic-angular';
import { Track } from '../../services/track.interface';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'cover-page.component',
  templateUrl: 'cover-page.component.html'
})
export class CoverPage {
  public searchInput: string = '';
  public state = this.playerService.state;

  constructor(private searchService: SearchService,
              public navCtrl: NavController,
              public playerService: PlayerService) {}

  ionViewDidEnter() {
    console.log('did eventer');
    setTimeout(() => {
      console.log('afterViewInit');
      this.searchTracks();
    }, 1500);
  }

  searchTracks() {
    this.playerService.filechooser();
  }
}