import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCanvasComponent } from './task-canvas.component';

describe('TaskCanvasComponent', () => {
  let component: TaskCanvasComponent;
  let fixture: ComponentFixture<TaskCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCanvasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
