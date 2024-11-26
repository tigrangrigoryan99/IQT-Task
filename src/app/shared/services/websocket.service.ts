import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ToDoItem } from '../interfaces/tasks.interface';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  public socketConnected: Subject<boolean> = new Subject<boolean>();
  private serverUrl = 'http://localhost:8080';

  private socket!: Socket;

  public connectWebsocket() {
    this.socket = io(this.serverUrl);

    this.socket.on('connect', () => {
      this.socketConnected.next(true);
    });
  }

  public closeWebsocket() {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
  }

  public listenToDoList(): Observable<ToDoItem[]> {
    return new Observable<ToDoItem[]>((observer) => {
      this.socket.on('tasks', (data: ToDoItem[]) => {
        observer.next(data);
      });
    });
  }
}
