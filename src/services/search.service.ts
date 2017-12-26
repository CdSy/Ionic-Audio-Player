import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

@Injectable()
export class SearchService {
  // private directories = ['Download', 'Music'];
  private directories = ['www/assets/audio'];

  constructor(private fileModule: File) {
    this.checkDirectory = this.checkDirectory.bind(this);
  }

  checkDirectory(filterFn): Promise<any[]> {
    // this.fileModule.applicationDirectory
    // this.fileModule.externalRootDirectory

    const workMyCollection = (dir) => {
      return this.fileModule.listDir(this.fileModule.applicationDirectory, dir)
        .then((result) => {
          return Promise.all(result.map(function(file) {
            if(file.isDirectory === true && file.name !='.' && file.name !='..') {
              return workMyCollection(file.fullPath.slice(1));
            } else if (file.isFile === true) {
              return filterFn(file.name) ? file : '';
            }
          }))
          .then((result) => {
            return result.filter(function(f) {
              return !!f;
            });
          });
        })
        .catch((err) => console.log(err));
    };

    return Promise.all(this.directories.map(function(path) {
            return workMyCollection(path);
           }))
           .then((res) => {
             if (!res[0]) {
               throw new Error('Tracks not found');
             } else {
               return res;
             }
           });
  }
}