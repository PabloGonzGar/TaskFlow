import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskComponent } from '../private/task/task.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DragDropModule,
    TaskComponent
  ]
})
export class AppModule { }
