import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private isSpinning: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isSpinning$: Observable<boolean> = this.isSpinning.asObservable();

  toggleSpinner(condition: boolean): void {
    this.isSpinning.next(condition);
  }
}
