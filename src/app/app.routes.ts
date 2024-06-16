import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'transactions', component: TransactionsComponent },
    { path: 'budgets', component: BudgetsComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: '/dashboard' }
];
