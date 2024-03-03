import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IncomeInfo } from '../_models/income-info';
import { TaxCalculatorService } from '../_services/tax-calculator.service';

@Component({
  selector: 'app-income-tax-calculator',
  templateUrl: './income-tax-calculator.component.html',
  styleUrls: ['./income-tax-calculator.component.css']
})
export class IncomeTaxCalculatorComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false;
  totalTax_old = 0;
  totalTax_new = 0;
  tax_new_withcess = 0;
  tax_old_withcess = 0;
  constructor(
    private formBuilder: FormBuilder,
        private route: ActivatedRoute,
    private router: Router,
      private taxCalculatorService: TaxCalculatorService
  ) { }
  
  model = new IncomeInfo();
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      income: [0, Validators.required],
      hra_deduction: [0],
      d80c_deduction: [0],
      d80ccd1b_deduction: [0],
      d80ccd2_deduction:[0],
      d80d_deduction: [0],
      prof_tax: [2500],
      d80ttattb_deduction: [0],
      d24interest: [0],
      d80E_educationloaninterest: [0],
      tcs_tax:[0]
      
  });
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
}
    //debugger;
    let hra_deduction:number = parseFloat(this.f['hra_deduction'].value);
    let d80c_deduction: number = parseFloat(this.f['d80c_deduction'].value);
    let calculated_80c: number = (d80c_deduction > 150000)? 150000: d80c_deduction;
    let d80ccd1b_deduction: number = parseFloat(this.f['d80ccd1b_deduction'].value);
    let d80ccd2_deduction: number = parseFloat(this.f['d80ccd2_deduction'].value);
    let d80d_deduction: number = parseFloat(this.f['d80d_deduction'].value);
    let prof_tax:number = parseFloat(this.f['prof_tax'].value);
    let std_deduction: number = 50000;
    let d80ttattb_deduction: number = parseFloat(this.f['d80ttattb_deduction'].value);
    let d24interest: number = parseFloat(this.f['d24interest'].value);
    let d80E_educationloaninterest: number = parseFloat(this.f['d80E_educationloaninterest'].value);
    let netIncome: number = this.f['income'].value;
    let tcs_tax: number = this.f['tcs_tax'].value;
    let total_deductions: number = std_deduction + prof_tax + hra_deduction + calculated_80c + d80ccd1b_deduction + d80ccd2_deduction +
                                    d80d_deduction + d80ttattb_deduction + d24interest + d80E_educationloaninterest ;
    let calculated_netIncome_oldregime:number = netIncome - total_deductions;
    
  //debugger;
    this.totalTax_old = this.taxCalculatorService.taxCalculator_old_regime(calculated_netIncome_oldregime)-tcs_tax;
    //include health cess
    this.totalTax_new = this.taxCalculatorService.taxCalculated_new_regime(netIncome) -tcs_tax;
    this.tax_new_withcess = this.calculateTaxWithCess(this.totalTax_new);
    this.tax_old_withcess = this.calculateTaxWithCess(this.totalTax_old);
  console.log('totalTax_old', calculated_netIncome_oldregime, this.totalTax_old);
    console.log('totalTax_new', this.totalTax_new);
    
  }
  calculateTaxWithCess(tax: number): any{
    let taxWithCess: number = tax + (tax * 4 / 100);
    return taxWithCess;
  }
}
