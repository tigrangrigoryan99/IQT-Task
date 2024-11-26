import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskFormService } from '../shared/services/taskForm.service';
import { TaskDataService } from '../shared/services/taskData.service';
import { ToDoItem } from '../shared/interfaces/tasks.interface';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent implements OnChanges {
  @Input() task: ToDoItem | null = null;

  public generalForm: FormGroup = this.fb.group({
    name: [null, Validators.required],
    description: [null],
    date: [new Date(), Validators.required],
    complete: ['Incompleted'],
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef,
    private taskFormService: TaskFormService,
    private taskDataService: TaskDataService,
    private fb: FormBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['task']?.currentValue, 'changeValues');

    if (changes['task']?.currentValue) {
      this.generalForm.patchValue({ ...changes['task'].currentValue });
    } else {
      this.generalForm.reset({
        name: '',
        description: '',
        date: new Date(),
        complete: 'Incompleted',
      });
    }
  }

  public cancelChanges(): void {
    this.taskFormService.toggleForm(false);
  }

  public saveChanges(): void {
    const rowValue = this.generalForm.getRawValue();
    console.log(rowValue, 'rowValue');
    console.log(this.task, 'this.task');

    if (this.task?.id) {
      this.taskDataService
        .editItem({ ...rowValue, id: this.task?.id })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((_) => {
          this.taskFormService.toggleForm(false);
          this.taskFormService.updateToDoleList();
        });
    } else {
      this.taskDataService
        .createItem({ ...rowValue })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((_) => {
          this.taskFormService.toggleForm(false);
          this.taskFormService.updateToDoleList();
        });
    }
  }
}
