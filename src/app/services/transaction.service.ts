import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/transactions'; // JSON Server API URL

  constructor(private http: HttpClient) { }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  editTransaction(transaction: Transaction): Observable<Transaction> {
    const editUrl = `${this.apiUrl}/${transaction.id}`;
    return this.http.put<Transaction>(editUrl, transaction);
  }

  deleteTransaction(transactionId: number): Observable<void> {
    const deleteUrl = `${this.apiUrl}/${transactionId}`;
    return this.http.delete<void>(deleteUrl);
  }
}