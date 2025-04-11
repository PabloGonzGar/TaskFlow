import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  constructor(private userService: UserService) { }

  userStats:any[ ] = []



  ngOnInit(): void {
    this.userService.getUserStats().subscribe({
      next: (data) => {
        console.log(data)
        this.getStats(data)
      }
    })
  }


  getStats(data:any){
    this.userStats = data
    console.log(this.userStats)
  }
}
