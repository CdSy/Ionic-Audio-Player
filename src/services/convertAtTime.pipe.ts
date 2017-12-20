import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'timeformat'})
export class ConvertAtTime implements PipeTransform {
  transform(millseconds: number) {
    const seconds = Math.floor(millseconds / 1000);
    const h = 3600;
    const m = 60;
    let hours = Math.floor(seconds / h).toString();
    let minutes = Math.floor((seconds % h) / m).toString();
    let scnds = Math.floor((seconds % m)).toString();
    let timeString = '';

    if(scnds.length < 2) {
        scnds = "0" + scnds;
    } 
    if(hours.length < 2) {
        hours = "0" + hours;
    }
    if(minutes.length < 2) {
        minutes = "0" + minutes;
    }

    timeString = `${minutes}:${scnds}`;
    
    return timeString;
  }
}