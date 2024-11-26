import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskFormService {
  private editOrAddTask: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private updateToDoList: Subject<boolean> = new Subject<boolean>();

  editOrAddTask$: Observable<boolean> = this.editOrAddTask.asObservable();
  updateToDoList$: Observable<boolean> = this.updateToDoList.asObservable();

  toggleForm(condition: boolean): void {
    this.editOrAddTask.next(condition);
  }

  updateToDoleList(): void {
    this.updateToDoList.next(true);
  }
}
