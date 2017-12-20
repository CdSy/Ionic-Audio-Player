import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Track } from '../../services/track.interface';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'play-list',
  templateUrl: 'play-list.component.html'
})
export class PlayList implements OnInit {
  inputText: string;
  tracks: { data: Track[] };
  private state = this.playerService.state;

  constructor(public playerService: PlayerService, public navCtrl: NavController) {}

  ngOnInit() {
    this.tracks = this.playerService.tracks;
  }

  playTrack(track) {
    this.playerService.playTrack(track);
  }

  goBack(event) {
    if (event.deltaX > 0) {
      this.navCtrl.pop();
    }
  }

  isActive(track) {
    return this.state.currentTrack === track.audio;
  }

  onTrackFinished(event) {
    console.log('track is finished');
  }
}
