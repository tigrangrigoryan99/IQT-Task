import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ToDoItem } from '../../interfaces/tasks.interface';
import * as fabric from 'fabric';

@Component({
  selector: 'app-task-canvas',
  standalone: true,
  imports: [],
  templateUrl: './task-canvas.component.html',
  styleUrl: './task-canvas.component.scss',
})
export class TaskCanvasComponent implements OnInit, OnChanges {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  @Input() tasks: ToDoItem[] = [];

  canvas!: fabric.Canvas;

  ngOnInit(): void {
    this.initializeCanvas();
    this.updateCanvas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      this.updateCanvas();
    }
  }

  private initializeCanvas(): void {
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement);
    this.canvas.setWidth(500);
    this.canvas.setHeight(400);

    const canvasElement = this.canvas.getElement();
    canvasElement.style.border = '2px solid black';
    canvasElement.style.borderRadius = '15px';
    canvasElement.style.overflow = 'hidden';
  }

  private updateCanvas(): void {
    this.canvas?.clear();
    this.addTasksToCanvas();
  }

  private addTasksToCanvas(): void {
    this.tasks.forEach((task, index) => {
      const rect = new fabric.Rect({
        left: 10,
        top: 10 + index * 70,
        fill: 'lightblue',
        width: 200,
        height: 60,
        rx: 15,
        ry: 15,
        hasControls: true,
        lockRotation: true,
      });

      const text = new fabric.Textbox(task.name, {
        left: rect.left + 10,
        top: rect.top + 10,
        width: 180,
        fontSize: 16,
        fontFamily: 'Arial',
        fill: 'black',
        textAlign: 'left',
        padding: 5,
      });

      const group = new fabric.Group([rect, text], {
        left: rect.left,
        top: rect.top,
        selectable: true,
      });

      this.canvas?.add(group);
    });
  }
}
