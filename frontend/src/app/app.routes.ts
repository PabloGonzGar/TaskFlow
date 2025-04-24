import { Routes } from '@angular/router';
import { LandingComponent } from './public/landing/landing.component';
import { LoginComponent } from './public/login/login.component';
import { RegisterComponent } from './public/register/register.component';
import { LayoutComponent } from './private/layout/layout.component';
import { StatsComponent } from './private/stats/stats.component';
import { AuthGuard } from './core/auth/auth.guard';
import { TaskComponent } from './private/task/task.component';
import { DashboardComponent } from './private/dashboard/dashboard.component';
import { DashboardComponent as AdminComponent}   from './private/admin/dashboard/dashboard.component';

export const routes: Routes = [
    {path:  '', redirectTo:'landing', pathMatch: 'full'},
    {path: 'landing', component: LandingComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
    {path: 'dashboard', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            {path: '', component: DashboardComponent},
            {path: 'stats', component: StatsComponent},
            {path: 'tasks', component: TaskComponent},
        ]
    },
    {path: '**', redirectTo:'landing', pathMatch: 'full'},
];
