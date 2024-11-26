import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskDataService } from './shared/services/taskData.service';
import { TaskTableComponent } from './task-table/task-table.component';
import { WebSocketService } from './shared/services/websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'To-Do List';

  webSocketService = inject(WebSocketService);

  ngOnInit(): void {
    this.webSocketService.connectWebsocket();
  }

  ngOnDestroy(): void {
    this.webSocketService.closeWebsocket();
  }
}
