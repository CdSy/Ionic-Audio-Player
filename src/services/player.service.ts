import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media';
import { SearchService } from './search.service';

@Injectable()
export class PlayerService {
  public tracks = {
    data: [],
    directories: [],
    albums: [],
    artists: []
  };
  private timer: any;
  public state = {
    currentTrack: <MediaObject>{},
    duration: 0,
    name: '',
    currentIndex: 0,
    random: false,
    repeat: false,
    volume: 100,
    position: 0,
    elapsed: 0,
    total: 0,
    completed: false,
    playStatus: 'stopped'
  };

  constructor (private media: Media, private scanDir: SearchService) {
    this.togglePlay = this.togglePlay.bind(this);
    this.backward = this.backward.bind(this);
    this.forward = this.forward.bind(this);
    this.filechooser = this.filechooser.bind(this);
    this.skip = this.skip.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.skipBack = this.skipBack.bind(this);
    this.skipNext = this.skipNext.bind(this);
  }

  filechooser() {
    if (this.tracks.data.length > 0) {
      return;
    }

    const filterMp3 = str => {
      return /(.mp3)$/g.test(str);
    }

    const flatMap = list => list.reduce(
      (a, b) => a.concat(Array.isArray(b) ? flatMap(b) : b), []
    );

    this.scanDir.checkDirectory(filterMp3)
      .then((result) => {
        this.createAudioTracks(flatMap(result)).then((result) => {
          this.tracks.data = result;
          this.state.currentTrack = this.tracks.data[this.state.currentIndex].audio;
          this.state.duration = this.tracks.data[this.state.currentIndex].duration;
          this.state.name = this.tracks.data[this.state.currentIndex].name;
          this.state.total = this.state.duration * 1000;

          this.sortOnAlbum(this.tracks.data);
          this.subscribeOnTrack();
        });
      })
      .catch(err => 'Directory doesn\'t exists');
  }

  private sortOnAlbum(tracks) {
    const albums = {};

    tracks.forEach((file) => {
      const name = file.parent;
      const key = name.replace(/^\s+/g, '');

      if (!albums[key]) {
        albums[key] = {name: name, tracks: [file]};
      } else {
        albums[key].tracks.push(file);
      }
    });

    this.tracks.albums = Object.keys(albums).map((key) => albums[key]);
    console.log(this.tracks.albums);
  }

  private subscribeOnTrack() {
    this.state.currentTrack.onStatusUpdate.subscribe(status => {
      if (status === this.media.MEDIA_STOPPED) {
        this.stopTimer();

        if (this.state.completed === true) {
          this.forward();
        }
      }
    });
  }

  private createAudioTracks(srcElements) {
    return Promise.all(srcElements.map((element) => {
      return new Promise ((resolve) => {
        const track = {audio: null, duration: 0, name: '', parent: ''};
        track.audio = this.media.create(element.nativeURL);
        track.audio.setVolume(0);
  
        //Костыли. Не корректно работает плагин кордовы. Если не воспроизвести файл, то возвращается длительность === -1
        setTimeout(() => {
          track.audio.play();
          track.audio.stop();
          track.audio.release();
  
          setTimeout(() => {
            track.duration = ~~(track.audio.getDuration());
            track.name = element.name;
            
            element.getParent((parent) => {
              track.parent = parent.name;
              track.audio.setVolume(1);
              resolve(track);
            });
          }, 1);
        },1);
      });
    }));
  }

  togglePlay(){
    if (this.tracks.data.length === 0) {
      return;
    }
    
    if(this.state.playStatus === 'playing'){
      this.pause();
    } else {
      this.play();
    }
  }

  playTrack(track) {
    const index = this.tracks.data.indexOf(track);

    this.stop();
    this.switchTrack(index);
  }

  private switchTrack(tracksNumber) {
    this.state.currentIndex = tracksNumber;
    this.state.currentTrack = this.tracks.data[this.state.currentIndex].audio;
    this.state.duration = this.tracks.data[this.state.currentIndex].duration;
    this.state.name = this.tracks.data[this.state.currentIndex].name;
    this.state.position = 0;
    this.state.total = this.state.duration * 1000;
    this.state.currentTrack.setVolume(this.state.volume / 100);

    this.subscribeOnTrack();
    this.play();
  }

  private startTimer() {
    const callback = () => {  
      if (this.state.duration === undefined) {
        let duration: number = this.state.currentTrack.getDuration();
        (duration > 0) && (this.state.duration = ~~(this.state.currentTrack.getDuration()));
      }

      this.state.currentTrack.getCurrentPosition()
        .then((position) => {
          this.ngZone.run(()=> {
            if (position > -1) {
              this.state.position = position >= 0 ? Math.ceil((~~(position) / this.state.duration) * 100) : 0;
              this.state.elapsed = ~~(position * 1000);
              this.state.completed = ~~(position + 1) >= this.state.duration ?
                                     true : false;
              this.stopTimer();

              if (this.state.completed === true) {
                return;
              } else {
                this.timer = setTimeout(() => callback(), 1000);
              }
            }
          });
        });
    };

    this.timer = setTimeout(() => callback(), 1);
  }

  private stopTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  skipNext(ms) {
    if (this.tracks.data.length === 0) {
      return;
    }

    const seekValue = ~~(((this.state.duration * (this.state.position / 100)) * 1000) + ms);

    if (seekValue < (this.state.duration * 1000)) {
      this.seekTo(seekValue);
    }
  }

  skipBack(ms) {
    if (this.tracks.data.length === 0) {
      return;
    }

    const seekValue = ~~(((this.state.duration * (this.state.position / 100)) * 1000) - ms);

    // seekValue > 1ms
    if (seekValue > 1000) {
      this.seekTo(seekValue);
    } else {
      this.backward();
    }
  }

  skip(position) {
    if (this.tracks.data.length === 0) {
      return;
    }

    const seekValue = ~~((this.state.duration * (position / 100)) * 1000);
    
    this.seekTo(seekValue);
  }

  seekTo(seekValue) {
    this.stopTimer();
    this.state.currentTrack.seekTo(seekValue);
    this.startTimer();
  }

  private pause() {
    this.state.playStatus = 'stopped';
    this.state.currentTrack.pause();
    this.stopTimer();
  }

  private play() {
    this.state.playStatus = 'playing';
    this.state.currentTrack.play();
    this.startTimer();
  }

  backward() {
    if (this.tracks.data.length === 0) {
      return;
    }

    this.stop();

    if (this.state.random === true) {
      this.switchTrack(this.getRandomTrack());

      return;
    }

    if (this.state.currentIndex !== 0) {
      this.switchTrack(this.state.currentIndex - 1);
    } else {
      this.switchTrack(this.tracks.data.length - 1);
    }
  }

  forward() {
    if (this.tracks.data.length === 0) {
      return;
    }

    this.stop();

    if (this.state.repeat === true) {
      this.switchTrack(this.state.currentIndex);

      return;
    }

    if (this.state.random === true) {
      this.switchTrack(this.getRandomTrack());

      return;
    }

    if (this.state.currentIndex > -1 && this.state.currentIndex < this.tracks.data.length - 1) {
      this.switchTrack(this.state.currentIndex + 1);
    } else {
      this.switchTrack(0);
    }
  }

  getRandomTrack() {
    const randomTrack = Math.floor(Math.random() * (this.tracks.data.length - 1));
    
    return randomTrack;
  }

  private stop() {
    this.state.currentTrack.stop();
    this.state.currentTrack.release();
  }

  randomSwitch() {
    this.state.random = !this.state.random;
  }

  repeatSwitch() {
    this.state.repeat = !this.state.repeat;
  }

  changeVolume() {
    this.state.currentTrack.setVolume(this.state.volume / 100);
  }
}