import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Chart, PolarAreaController, ArcElement, RadialLinearScale, Tooltip, Legend, Title } from 'chart.js';

Chart.register(PolarAreaController, ArcElement, RadialLinearScale, Tooltip, Legend, Title);


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
