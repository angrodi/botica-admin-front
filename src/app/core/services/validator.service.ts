import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  rucPattern: string = '^[0-9]{11}$';
  dniPattern: string = '^[0-9]{8}$';

  constructor() { }
}
