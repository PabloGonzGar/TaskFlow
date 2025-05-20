import { Component, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Chart, ChartOptions, ChartType, PolarAreaController, RadialLinearScale, ArcElement, Legend, Title, Tooltip } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChangeDetectorRef } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';


@Component({
  selector: 'app-stats',
  imports: [BaseChartDirective, MatProgressBar],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})


export class StatsComponent {
  constructor(private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cdRef: ChangeDetectorRef
  ) { }

  userStats = {
    completed_tasks: 0,
    total_tasks: 0,
    uncompleted_tasks: 0,
    pending_tasks: 0
  };

  progreso = 0
  pendientes = 0
  sinCompletar = 0

  chartType: ChartType = 'polarArea';
  chartLabels = ['Completadas', 'Pendientes', 'Sin completar', 'Totales'];

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
          display: true,
          stepSize: 1,
          font: {
            size: 12,
            family: 'Inter',
            style: 'normal',
            lineHeight: 1.5
          }
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
    this.progreso = Math.round((this.userStats.completed_tasks / this.userStats.total_tasks) * 100)
    this.pendientes = Math.round((this.userStats.pending_tasks / this.userStats.total_tasks) * 100)
    this.sinCompletar = Math.round((this.userStats.uncompleted_tasks / this.userStats.total_tasks) * 100)
    this.updateChartData()
  }


  updateChartData() {



    this.chartData = {
      labels: this.chartLabels,
      datasets: [{
          label: 'Tareas',
          data: [this.userStats.completed_tasks,
          this.userStats.pending_tasks,
          this.userStats.uncompleted_tasks,
          this.userStats.total_tasks],
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
