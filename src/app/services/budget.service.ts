import { Injectable } from '@angular/core';
import { Budget } from '../models/budget';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = 'http://localhost:3000/budgets';
  private transactionsUrl = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) {}

  getAllBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl);
  }

  addBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, budget);
  }

  deleteBudget(budgetId: number): Observable<void> {
    const url = `${this.apiUrl}/${budgetId}`;
    return this.http.delete<void>(url);
  }

  editBudget(budget: Budget): Observable<Budget> {
    const url = `${this.apiUrl}/${budget.id}`;
    return this.http.put<Budget>(url, budget);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.transactionsUrl);
  }

  trackSpending(): Observable<{ [key: string]: number }> {
    return this.getTransactions().pipe(
      map(transactions => {
        const spending: { [key: string]: number } = {};
        transactions.forEach(transaction => {
          if (!spending[transaction.category]) {
            spending[transaction.category] = 0;
          }
          spending[transaction.category] += transaction.amount;
        });
        return spending;
      })
    );
  }

  notifyUserExceedingBudget(): Observable<string[]> {
    return this.getAllBudgets().pipe(
      map(budgets => {
        const notifications: string[] = [];
        this.trackSpending().subscribe(spending => {
          budgets.forEach(budget => {
            if (spending[budget.category] && spending[budget.category] > budget.amount) {
              notifications.push(`You have exceeded the budget for category: ${budget.category}`);
            }
          });
        });
        return notifications;
      })
    );
  }

  getBudgetByCategoryAndPeriod(category: string, period: 'monthly' | 'annual'): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}?category=${category}&period=${period}`);
  }
}
