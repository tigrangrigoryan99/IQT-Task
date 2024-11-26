import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { SpinnerService } from '../shared/services/spinner.service';
import { TaskDataService } from '../shared/services/taskData.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormService } from '../shared/services/taskForm.service';
import { finalize } from 'rxjs';
import { ToDoItem } from '../shared/interfaces/tasks.interface';
import { WebSocketService } from '../shared/services/websocket.service';
import { TaskCanvasComponent } from '../shared/components/task-canvas/task-canvas.component';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [
    // modules
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,

    // components
    SpinnerComponent,
    TaskItemComponent,
    TaskCanvasComponent,
  ],
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTableComponent implements OnInit {
  public toDoList: ToDoItem[] = [];
  public editedTask: ToDoItem | null = null;
  public displayedColumns: string[] = [
    'name',
    'description',
    'date',
    'completed',
    'actions',
  ];
  public selectStatus: FormControl = new FormControl('All');

  private filters: {
    complete?: string;
  } = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef,
    private taskDataService: TaskDataService,
    private webSocketService: WebSocketService,
    public taskFormService: TaskFormService,
    public spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.fetchDataRequest();
    this.subscribeToFormChanges();

    this.taskFormService.updateToDoList$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_) => {
        this.fetchDataRequest();
      });

    this.webSocketService.socketConnected.subscribe((_) => {
      this.webSocketService.listenToDoList().subscribe((value: ToDoItem[]) => {
        this.toDoList = value;
        this.cdr.markForCheck();
      });
    });
  }

  public editItem(task: ToDoItem): void {
    this.editedTask = { ...task };
    this.taskFormService.toggleForm(true);
    this.cdr.markForCheck();
  }

  public deleteItem(id: string): void {
    this.taskDataService
      .deleteItem(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_) => {
        this.fetchDataRequest();
      });
  }

  public addTask(): void {
    this.taskFormService.toggleForm(true);
    this.editedTask = null;
    this.cdr.markForCheck();
  }

  public markAsCompleted(task: ToDoItem): void {
    this.taskDataService
      .editItem({ ...task, complete: 'Completed' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_) => {
        this.taskFormService.updateToDoleList();
      });
  }

  private fetchDataRequest(): void {
    this.spinnerService.toggleSpinner(true);
    this.taskDataService
      .getTasks(this.filters)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.spinnerService.toggleSpinner(false);
          this.cdr.markForCheck();
        })
      )
      .subscribe((resalts: ToDoItem[]) => {
        if (!resalts.length) {
          this.taskFormService.toggleForm(false);
        }
        this.toDoList = resalts;
        this.cdr.markForCheck();
      });
  }

  private subscribeToFormChanges(): void {
    this.selectStatus.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status: string) => {
        if (status === 'All') {
          this.filters = {};
        } else {
          this.filters['complete'] = status;
        }

        this.fetchDataRequest();
      });
  }
}
