import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartOptions, ChartType, PolarAreaController, RadialLinearScale, ArcElement, Legend, Title, Tooltip } from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';



@Component({
  selector: 'app-estadisticas',
  imports: [BaseChartDirective],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
  constructor(private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cdRef: ChangeDetectorRef
  ) { }

  stats = {
    total_users: 0,
    total_tasks: 0,
    uncompleted_tasks: 0,
    pending_tasks: 0,
    completed_tasks: 0
  };

  ngOnInit(): void {
    this.userService.getAllUsersStats().subscribe({
      next: (data) => {
        console.log(data)
        this.getStats(data)
      }
    })
  }


  chartType: ChartType = 'polarArea';
  chartLabels = ['Completadas', 'Pendientes', 'Sin completar', 'Totales'];

  getStats(data: any) {
    this.stats = data
    this.updateChartData()
  }

  
  chartData = {
    labels: this.chartLabels,
    datasets: [
      {
        label: 'Tareas',
        data: [0, 0, 0, 0],
        backgroundColor: [
          '',
          '',
          '',
          ''
        ],
        hoverOffset : 0
      }
    ], 
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
    },
    scales:{
      r: {
        grid: {
          display: true,
          lineWidth: 1
        },
        ticks: {
          display: false,
          stepSize: 1
        }

      }
    },

    animations:{
      radius: {
        duration: 1000,
        easing: 'easeOutSine'
      }
    }
  };


  updateChartData() {



    this.chartData = {
      labels: this.chartLabels,
      datasets: [{
          label: 'Tareas',
          data: [this.stats.completed_tasks,
          this.stats.pending_tasks,
          this.stats.uncompleted_tasks,
          this.stats.total_tasks],
          backgroundColor: [
            'rgba(68, 255, 0, 0.3)',
            'rgba(246, 185, 29, 0.3)',
            'rgba(255, 0, 0, 0.49)',
            'rgba(0, 41, 246, 0.32)'
          ],
          hoverOffset: 20
      }]
    };

    this.cdRef.detectChanges();

  }


}

