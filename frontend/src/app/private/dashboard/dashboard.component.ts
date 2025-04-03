import { Component } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { compileNgModule } from '@angular/compiler';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private taskService: TaskService, private authService: AuthService) { }


  ngOnInit() {
    this.authService.refreshToken()
      console.log("despues de refreshToken")
      console.log(this.authService.getAccessToken())
      console.log(this.authService.getRefreshToken())

    this.taskService.getRecomendedTasks().subscribe(
      (data) => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }
}
