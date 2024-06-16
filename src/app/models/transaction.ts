export class Transaction {
  id: number;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string; // Assume date is stored as string for compatibility with form inputs

  constructor(id: number, amount: number, category: string, type: 'income' | 'expense', date: string) {
    this.id = id;
    this.amount = amount;
    this.category = category;
    this.type = type;
    this.date = date;
  }
}
