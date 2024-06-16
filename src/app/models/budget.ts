export class Budget {
    id: number;
    category: string;
    amount: number;
    period: 'monthly' | 'annual';
  
    constructor(id: number, category: string, amount: number, period: 'monthly' | 'annual') {
      this.id = id;
      this.category = category;
      this.amount = amount;
      this.period = period;
    }
  }
  