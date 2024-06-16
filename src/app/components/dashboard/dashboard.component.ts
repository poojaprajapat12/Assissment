import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers:[TransactionService]
})
export class DashboardComponent implements OnInit {
  totalIncome = 0;
  totalExpenses = 0;
  currentBalance = 0;
  recentTransactions: Transaction[] = [];
  newTransactionForm: FormGroup;

  constructor(
    private transactionService: TransactionService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.newTransactionForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      type: ['income', Validators.required],
      date: [new Date().toISOString().substr(0, 10), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFinancialSummary();
    this.loadRecentTransactions();
  }

  loadFinancialSummary(): void {
    this.transactionService.getAllTransactions().subscribe(
      transactions => {
        this.totalIncome = this.calculateTotalAmount(transactions, 'income');
        this.totalExpenses = this.calculateTotalAmount(transactions, 'expense');
        this.currentBalance = this.totalIncome - this.totalExpenses;
      },
      error => {
        console.error('Error fetching transactions:', error);
      }
    );
  }

  calculateTotalAmount(transactions: Transaction[], type: string): number {
    return transactions
      .filter(transaction => transaction.type === type)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  }

  loadRecentTransactions(): void {
    this.transactionService.getAllTransactions().subscribe(
      transactions => {
        this.recentTransactions = transactions.slice(0, 5);
      },
      error => {
        console.error('Error fetching recent transactions:', error);
      }
    );
  }

  onSubmitTransactionForm(): void {
    if (this.newTransactionForm.invalid) {
      console.error('Invalid form data.');
      return;
    }

    const newTransaction: Transaction = {
      id: 0, // Will be assigned by JSON Server
      amount: this.newTransactionForm.value.amount,
      category: this.newTransactionForm.value.category,
      type: this.newTransactionForm.value.type,
      date: this.newTransactionForm.value.date
    };

    this.transactionService.addTransaction(newTransaction).pipe(
      catchError(error => {
        console.error('Error adding transaction:', error);
        return of(null);
      })
    ).subscribe(
      () => {
        console.log('New Transaction added successfully:', newTransaction);
        this.loadFinancialSummary();
        this.loadRecentTransactions();
        this.newTransactionForm.reset({
          type: 'income',
          date: new Date().toISOString().substr(0, 10)
        });
      }
    );
  }

  deleteTransaction(transactionId: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(transactionId).subscribe(
        () => {
          console.log('Transaction deleted successfully:', transactionId);
          this.loadFinancialSummary();
          this.loadRecentTransactions();
        },
        error => {
          console.error('Error deleting transaction:', error);
        }
      );
    }
  }
}