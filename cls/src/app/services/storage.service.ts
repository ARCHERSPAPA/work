import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getStorage(key: string, name?: string) {
    const value = localStorage.getItem(key);
    if (value) {
      let parseValue = JSON.parse(value);
      return name && parseValue ? parseValue[name] : (parseValue ? parseValue : null);
    }
    return null;
  }

  clearStorage(key: string) {
    localStorage.removeItem(key);
  }

  clearAll() {
    localStorage.clear();
  }


}
