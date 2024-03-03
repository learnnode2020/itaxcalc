import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaxCalculatorService {
 
  constructor() { }
  totalTax: any = 0.00;
  exceeded_income: any = 0.00;
  calculated_tax: any = 0.00;
  taxCalculator_old_regime(netincome: any): any{
    
    if (netincome <= 250000) {
      return this.totalTax;
    }
    else if (netincome > 1000000) {
      this.exceeded_income = netincome - 1000000;
      this.calculated_tax = this.exceeded_income * 30 / 100;
      this.totalTax = 112500 + this.calculated_tax;
      return this.totalTax;
    }
    else if (netincome > 500000 && netincome <= 1000000) {
      this.exceeded_income = netincome - 500000;
      this.calculated_tax = this.exceeded_income * 20 / 100;
      this.totalTax = 12500 + this.calculated_tax;
      return this.totalTax;
    }
    else if (netincome > 250000 && netincome <= 500000) {
      this.exceeded_income = netincome - 250000;
      this.totalTax = this.exceeded_income * 5 / 100;
      return this.totalTax;
    }
  }

  taxCalculated_new_regime(netIncome: any): any{
    if (netIncome <= 250000) {
      return this.totalTax;
    }
    else if (netIncome > 1500000) {
      this.exceeded_income = netIncome - 1500000;
      this.calculated_tax = this.exceeded_income * 30 / 100;
      this.totalTax = 187500 + this.calculated_tax;
      return this.totalTax;
    }
    else if (netIncome > 1250000 && netIncome <= 1500000) {
      this.exceeded_income = netIncome - 1250000;
      this.calculated_tax = this.exceeded_income * 25 / 100;
      this.totalTax = 125000 + this.calculated_tax;
      return this.totalTax;
    }
    else if (netIncome > 1000000 && netIncome <= 1250000) {
      this.exceeded_income = netIncome - 1000000;
      this.calculated_tax = this.exceeded_income * 20 / 100;
      this.totalTax = 75000 + this.calculated_tax;
      return this.totalTax;
    }
    else if (netIncome > 750000  && netIncome <= 1000000) {
      this.exceeded_income = netIncome - 750000;
      this.calculated_tax = this.exceeded_income * 15 / 100;
      this.totalTax = 37500 + this.calculated_tax;
      return this.totalTax;
    }
    else if (netIncome > 500000  && netIncome <= 750000) {
      this.exceeded_income = netIncome - 500000;
      this.calculated_tax = this.exceeded_income * 10 / 100;
      this.totalTax = 12500 + this.calculated_tax;
      return this.totalTax;
    }
    else if (netIncome > 250000  && netIncome <= 500000) {
      this.exceeded_income = netIncome - 250000;
      this.totalTax = this.exceeded_income * 5 / 100;
      return this.totalTax;
    }
  }
}
