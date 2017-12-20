import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Track } from './track.interface';
import { PlayerService } from './player.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SearchService {
  private client_id = '2f98992c40b8edf17423d93bda2e04ab';

  constructor(private http: HttpClient, private playerService: PlayerService) { }

  // searchTracks(searchParams) {
  //   return this.http.get<Track[]>(`https://api.soundcloud.com/tracks?client_id=${this.client_id}&q=${searchParams}&limit=50&filter=public`)
  //     .pipe(
  //       tap(tracks => this.log(`fetched tracks`, tracks))
  //     ).subscribe(tracks => {
  //       this.playerService.setTracks(this.normalizeData(tracks));
  //     });
  // }

  // private normalizeData(array) {
  //   return array.filter((track) => {
  //     return track.downloadable === true;
  //   }).map((track) => {
  //     const normEl = {preload: {}};

  //     ({
  //       download_url: normEl.src, 
  //       title: normEl.title,
  //       duration: normEl.preload.duration,
  //       description: normEl.description, 
  //       genre: normEl.genre, 
  //       artwork_url: normEl.artwork_url, 
  //       likes_count: normEl.likes_count
  //     } = track);

  //     normEl.src = this.prepareUrl(normEl.download_url);
      
  //     console.log(normEl);
  //     return normEl;
  //   });
  // }

  prepareUrl(url) {
    const str = url.replace( /stream/g, 'download');

    return `${str}?client_id=${this.client_id}`
  }

  private handleError() {
    console.error('error');
  }

  private log(message: string, tracks) {
    console.log('SearchService: ' + message, tracks);
  }
}