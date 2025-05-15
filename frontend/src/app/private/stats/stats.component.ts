import { Component, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Chart, ChartOptions, ChartType ,PolarAreaController,RadialLinearScale,ArcElement,Legend,Title,Tooltip} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-stats',
  imports: [BaseChartDirective],
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
  };

  chartType: ChartType = 'polarArea';
  chartLabels = ['Completadas', 'Pendientes', 'Sin completar', 'Totales'];

  chartData = {
    labels: this.chartLabels,
    datasets: [
      {
        label: 'Tareas',
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: false,
        text: 'Estadísticas de tareas'
      }
    }
  };

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
    this.updateChartData()
  }


   updateChartData() {

    this.chartData.datasets[0].data = [
      this.userStats.completed_tasks,
      this.userStats.pending_tasks,
      this.userStats.uncompleted_tasks,
      this.userStats.total_tasks
    ];
  }
}
