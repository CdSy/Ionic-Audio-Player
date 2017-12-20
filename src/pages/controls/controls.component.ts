import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/observable/of';

@Component({
  selector: 'controls-component',
  templateUrl: 'controls.component.html'
})
export class Controls implements AfterViewInit {
  private state = this.playerService.state;
  private isFocused = false;
  private skipStepScale = 5000; //ms
  private stepDelay = 600; //ms
  private forwardLongClicks$: Observable<any>;
  private backwardsLongClicks$: Observable<any>;

  @ViewChild("forward")
  forwardButton: any;

  @ViewChild("backward")
  backwardButton: any;

  constructor(public playerService: PlayerService) {}

  ngAfterViewInit() {
    const downForwardStream$ = Observable.fromEvent(this.forwardButton._elementRef.nativeElement, 'touchstart');
    const upForwardStream = Observable.fromEvent(this.forwardButton._elementRef.nativeElement, 'touchend');
    const downBackwardStream$ = Observable.fromEvent(this.backwardButton._elementRef.nativeElement, 'touchstart');
    const upBackwardStream = Observable.fromEvent(this.backwardButton._elementRef.nativeElement, 'touchend');
    const nextClickStream = Observable.fromEvent(this.forwardButton._elementRef.nativeElement, 'click');
    const backClickStream = Observable.fromEvent(this.backwardButton._elementRef.nativeElement, 'click');

    nextClickStream.subscribe((event) => {
      this.forward();
    });

    backClickStream.subscribe((event) => {
      this.backward();
    });

    this.forwardLongClicks$ = downForwardStream$.flatMap((event) => {
      return Observable.of(event).delay(this.stepDelay).repeat(100).takeUntil(upForwardStream);
    })
    
    this.forwardLongClicks$.subscribe((event) => {
      this.playerService.skipNext(this.skipStepScale);
    });

    this.backwardsLongClicks$ = downBackwardStream$.flatMap((event) => {
      return Observable.of(event).delay(this.stepDelay).repeat(100).takeUntil(upBackwardStream);
    });
    
    this.backwardsLongClicks$.subscribe((event) => {
      this.playerService.skipBack(this.skipStepScale);
    });
  }

  togglePlay() {
    this.playerService.togglePlay();
  }

  backward() {
    this.playerService.backward();
  }

  forward() {
    this.playerService.forward();
  }

  randomSwitch() {
    this.playerService.randomSwitch();
  }

  repeatSwitch() {
    this.playerService.repeatSwitch();
  }

  clickHandler(focus) {
    this.isFocused = focus;
  }

  changeVolume() {
    this.playerService.changeVolume();
  }

  changeHandler(value) {
    if (this.isFocused === true) {
      console.log('focus event', ~~Number(value));
      this.playerService.skip(~~Number(value));
    }

    return;
  }
}
