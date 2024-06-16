import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule ,ColorHelper,MultiSeries} from '@swimlane/ngx-charts';
import { TransactionService } from '../../services/transaction.service';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [TransactionService]
})
export class ReportsComponent implements OnInit {
  barChartData!: any[]; // Data for bar chart
  pieChartData!: any[]; // Data for pie chart
  view: [number, number] = [700, 400]; // View dimensions for charts

  // Configuration options for charts
  showLegend = true;
  legendTitle = 'Legend';
  colorScheme: any = {
    domain: ['#5AA454', '#E44D25']
  };

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    // Fetch data and initialize charts
    this.fetchFinancialData();
  }

  fetchFinancialData() {
    // Replace with actual logic to fetch data from transactionService or backend API
    // Example data for bar chart
    this.barChartData = [
      {
        name: 'Income',
        series: [
          { name: 'January', value: 1000 },
          { name: 'February', value: 1200 },
          { name: 'March', value: 800 },
          // Add more data as needed
        ]
      },
      {
        name: 'Expenses',
        series: [
          { name: 'January', value: 600 },
          { name: 'February', value: 900 },
          { name: 'March', value: 700 },
          // Add more data as needed
        ]
      }
    ];

    // Example data for pie chart
    this.pieChartData = [
      { name: 'Food', value: 300 },
      { name: 'Rent', value: 800 },
      { name: 'Transportation', value: 200 },
      { name: 'Utilities', value: 400 },
      // Add more data as needed
    ];
  }

  exportToPDF() {
    // Implement PDF export logic using jsPDF or other library
    console.log('Exporting to PDF...');
  }

  exportToExcel() {
    // Implement Excel export logic using ExcelJS or other library
    console.log('Exporting to Excel...');
  }
}
