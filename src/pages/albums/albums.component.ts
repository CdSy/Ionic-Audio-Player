import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Track } from '../../services/track.interface';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'play-list',
  templateUrl: 'play-list.component.html'
})
export class Albums implements OnInit {
  tracks: { data: Track[] };
  private state = this.playerService.state;

  constructor(public playerService: PlayerService, public navCtrl: NavController) {}

  ngOnInit() {
    this.tracks = this.playerService.tracks;
  }
}
