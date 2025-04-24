import { Component, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-stats',
  imports: [NgFor],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  constructor(private userService: UserService, private renderer: Renderer2, private el: ElementRef) { }

  userStats = {
    completed_tasks: 0,
    total_tasks: 0,
    uncompleted_tasks: 0,
    pending_tasks: 0
  }

  ngAfterViewInit() {
    
  }

  ngOnInit(): void {
    this.userService.getUserStats().subscribe({
      next: (data) => {
        console.log(data)
        this.getStats(data)
      }
    })
  }

  getStats(data: any) {
    this.userStats = data  
  }
}
