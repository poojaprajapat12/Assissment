import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  providers:[TransactionService,BudgetService]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  errorMessage: string = '';
  transactionForm: FormGroup;
  isEditing: boolean = false;
  currentTransactionId: number | null = null;
  budgetExceededMessage: string = '';

  constructor(
    private transactionService: TransactionService,
    private budgetService: BudgetService,
    private formBuilder: FormBuilder
  ) {
    this.transactionForm = this.formBuilder.group({
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe(
      transactions => {
        this.transactions = transactions;
        this.filteredTransactions = [...this.transactions]; // Initialize filtered transactions
      },
      error => this.errorMessage = `Error loading transactions: ${error}`
    );
  }

  onDeleteTransaction(transactionId: number): void {
    this.transactionService.deleteTransaction(transactionId).subscribe(
      () => {
        console.log(`Transaction with ID ${transactionId} deleted successfully.`);
        this.loadTransactions(); // Reload transactions after deletion
      },
      error => {
        console.error(`Error deleting transaction with ID ${transactionId}: ${error}`);
        this.errorMessage = `Error deleting transaction with ID ${transactionId}: ${error}`;
      }
    );
  }

  onEditTransaction(transaction: Transaction): void {
    this.isEditing = true;
    this.currentTransactionId = transaction.id;
    this.transactionForm.patchValue({
      category: transaction.category,
      amount: transaction.amount,
      date: this.formatDateToInput(transaction.date) // Format date for input
    });
  }

  onSubmitTransactionForm(): void {
    if (this.transactionForm.invalid) {
      return;
    }

    const transactionData = this.transactionForm.value;

    if (this.isEditing && this.currentTransactionId !== null) {
      const updatedTransaction: Transaction = { ...transactionData, id: this.currentTransactionId };
      this.transactionService.editTransaction(updatedTransaction).subscribe(
        () => {
          console.log(`Transaction with ID ${this.currentTransactionId} updated successfully.`);
          this.checkBudget(updatedTransaction); // Check budget after updating
          this.loadTransactions(); // Reload transactions after updating
          this.resetForm();
        },
        error => {
          console.error(`Error updating transaction with ID ${this.currentTransactionId}: ${error}`);
          this.errorMessage = `Error updating transaction with ID ${this.currentTransactionId}: ${error}`;
        }
      );
    } else {
      const newTransaction: Transaction = { ...transactionData, id: 0 }; // ID will be assigned by the server
      this.transactionService.addTransaction(newTransaction).subscribe(
        () => {
          console.log('New transaction added successfully.');
          this.checkBudget(newTransaction); // Check budget after adding
          this.loadTransactions(); // Reload transactions after adding
          this.resetForm();
        },
        error => {
          console.error('Error adding transaction:', error);
          this.errorMessage = `Error adding transaction: ${error}`;
        }
      );
    }
  }

  filterTransactionsByCategory(event: Event): void {
    const category = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredTransactions = this.transactions.filter(transaction =>
      transaction.category.toLowerCase().includes(category)
    );
  }

  resetFiltersAndSorting(): void {
    this.filteredTransactions = [...this.transactions];
  }

  resetForm(): void {
    this.transactionForm.reset();
    this.isEditing = false;
    this.currentTransactionId = null;
  }

  checkBudget(transaction: Transaction): void {
    const period = this.getTransactionPeriod(transaction.date);

    this.budgetService.getBudgetByCategoryAndPeriod(transaction.category, period).subscribe(
      budgets => {
        if (budgets.length > 0) {
          const budget = budgets[0];
          const totalSpent = this.transactions
            .filter(t => t.category === transaction.category && this.getTransactionPeriod(t.date) === period)
            .reduce((sum, t) => sum + t.amount, 0) + transaction.amount;

          if (totalSpent > budget.amount) {
            this.budgetExceededMessage = `Warning: You have exceeded your ${period} budget for ${transaction.category}.`;
            console.log(this.budgetExceededMessage);
          } else {
            this.budgetExceededMessage = '';
          }
        }
      },
      error => {
        console.error('Error checking budget:', error);
      }
    );
  }

  getTransactionPeriod(date: string): 'monthly' | 'annual' {
    const transactionDate = new Date(date);
    const currentDate = new Date();

    if (transactionDate.getFullYear() === currentDate.getFullYear() &&
        transactionDate.getMonth() === currentDate.getMonth()) {
      return 'monthly';
    }
    return 'annual';
  }

  private formatDateToInput(date: string | Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }
}