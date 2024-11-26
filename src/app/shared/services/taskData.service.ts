import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ToDoItem } from '../interfaces/tasks.interface';

@Injectable({ providedIn: 'root' })
export class TaskDataService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public getTasks(filters?: { complete?: string }): Observable<ToDoItem[]> {
    const params = this.createHttpParams(filters || {});

    return this.http.get<ToDoItem[]>(`${this.apiUrl}/tasks`, { params }).pipe(
      switchMap((tasks) => of(tasks)),
      map((tasks) =>
        tasks.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      )
    );
  }

  public createItem(data: ToDoItem): Observable<ToDoItem[]> {
    data = {
      ...data,
      id: uuidv4(),
    };
    return this.http.post<ToDoItem[]>(`${this.apiUrl}/tasks`, data);
  }

  public editItem(data: ToDoItem): Observable<ToDoItem[]> {
    return this.http.patch<ToDoItem[]>(`${this.apiUrl}/tasks/${data.id}`, data);
  }

  public deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }

  private createHttpParams(filters: {
    [key: string]: string | undefined;
  }): HttpParams {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });

    return params;
  }
}
