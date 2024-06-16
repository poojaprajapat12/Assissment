import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { Budget } from '../../models/budget';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css',
  providers:[BudgetService]
})
export class BudgetsComponent implements OnInit {
  budgets: Budget[] = [];
  newBudgetForm: FormGroup;

  constructor(
    private budgetService: BudgetService,
    private formBuilder: FormBuilder
  ) {
    this.newBudgetForm = this.formBuilder.group({
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      period: ['monthly', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgetService.getAllBudgets().subscribe(
      budgets => {
        this.budgets = budgets;
      },
      error => {
        console.error('Error loading budgets:', error);
      }
    );
  }

  onSubmitNewBudget(): void {
    if (this.newBudgetForm.invalid) {
      console.error('Invalid form data.');
      return;
    }

    const newBudget: Budget = {
      id: 0, // Will be assigned by the server
      category: this.newBudgetForm.value.category,
      amount: this.newBudgetForm.value.amount,
      period: this.newBudgetForm.value.period
    };

    this.budgetService.addBudget(newBudget).subscribe(
      () => {
        console.log('New budget added successfully:', newBudget);
        this.loadBudgets(); // Refresh budgets after adding
        this.newBudgetForm.reset({
          period: 'monthly'
        });
      },
      error => {
        console.error('Error adding budget:', error);
      }
    );
  }

  onDeleteBudget(budgetId: number): void {
    this.budgetService.deleteBudget(budgetId).subscribe(
      () => {
        console.log(`Budget with ID ${budgetId} deleted successfully.`);
        this.loadBudgets(); // Refresh budgets after deletion
      },
      error => {
        console.error(`Error deleting budget with ID ${budgetId}:`, error);
      }
    );
  }
}
