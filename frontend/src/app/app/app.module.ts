import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskComponent } from '../private/task/task.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes'; 




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DragDropModule,
    TaskComponent,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: false })
  ],
})
export class AppModule { }
