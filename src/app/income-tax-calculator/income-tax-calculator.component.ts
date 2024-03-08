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
  isSubmitted:boolean = false;
  isNewProfitable: boolean = false;
  taxDifference: number = 0;
  totalTax_old: number = 0;
  totalTax_new: number = 0;
  tax_new_withcess: number = 0;
  tax_old_withcess: number = 0;
  total_tax_after_rebate_old: number = 0;
  total_tax_after_rebate_new: number = 0;
  total_rebate_old: number = 0;
  total_rebate_new: number = 0;

  tax_new_withcess_less_tds: number = 0;
  tax_old_withcess_less_tds: number = 0;

  netIncome: number = 0;
  calculated_netIncome_oldregime: number = 0;
  calculated_netIncome_newregime: number = 0;
  
  hra_deduction: number = 0;
  d80c_deduction: number = 0;
  d80ccd1b_deduction: number = 0;
  d80ccd2_deduction: number = 0;
  d80d_deduction: number = 0;
  prof_tax:number = 0;
  std_deduction: number = 50000;
  d80tta_deduction: number = 0;
  d24interest: number = 0;
  d80EEinterest: number = 0;
  d80E_educationloaninterest = 0;
  tcs_tax: number = 0;
  tds_tax: number = 0;
  other_income: number = 0;
  total_deductions_old: number = 0;
  total_deductions_new: number = 0;
  other_income_after_80tta: number = 0;
  eligible_80tta: number = 0;

       eligible_tax_rebate_old: number = 0
     eligible_tax_rebate_new: number = 0;
  constructor(
    private formBuilder: FormBuilder,
        private route: ActivatedRoute,
    private router: Router,
      private taxCalculatorService: TaxCalculatorService
  ) { }
  
  model = new IncomeInfo();
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      income: [[], Validators.required],
      other_income: [],
      hra_deduction: [],
      d80c_deduction: [[],Validators.max],
      d80ccd1b_deduction: [[],Validators.max],//specify
      d80ccd2_deduction:[[],Validators.max],
      d80d_deduction: [[],Validators.max],
      prof_tax: [[2400],Validators.max],
      d80tta_deduction: [[],Validators.max],//should mention other income saving interst,. then reduce this.. max 10k --done
      d24interest: [[],Validators.max],
      d80EEinterest: [[],Validators.max],
      d80E_educationloaninterest: [],
      tcs_tax: [],
      tds_tax:[]
      
  });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }
  onSubmit() {
    this.isSubmitted = true;
    this.netIncome = this.f['income'].value;
    
    if (this.form.invalid && this.netIncome <=0) {
      return;
}
    this.std_deduction = 50000;
    this.other_income = (!Number.isNaN(parseFloat(this.f['other_income'].value)))?parseFloat(this.f['other_income'].value): 0;
    this.hra_deduction = (this.f['hra_deduction'].value != null && this.f['hra_deduction'].value !=undefined) ? parseFloat(this.f['hra_deduction'].value): 0;
    this.d80c_deduction = (!Number.isNaN(parseFloat(this.f['d80c_deduction'].value)))?parseFloat(this.f['d80c_deduction'].value): 0;
    
    this.d80ccd1b_deduction = (!Number.isNaN(parseFloat(this.f['d80ccd1b_deduction'].value)))?this.f['d80ccd1b_deduction'].value: 0;
    this.d80ccd2_deduction = (!Number.isNaN(parseFloat(this.f['d80ccd2_deduction'].value)))?parseFloat(this.f['d80ccd2_deduction'].value): 0;
    this.d80d_deduction = (!Number.isNaN(parseFloat(this.f['d80d_deduction'].value)))?parseFloat(this.f['d80d_deduction'].value): 0;
    this.prof_tax = (!Number.isNaN(parseFloat(this.f['prof_tax'].value)))?parseFloat(this.f['prof_tax'].value) : 0;
    this.d80tta_deduction= (!Number.isNaN(parseFloat(this.f['d80tta_deduction'].value))) ? parseFloat(this.f['d80tta_deduction'].value): 0;
    this.d24interest = (!Number.isNaN(parseFloat(this.f['d24interest'].value))) ? parseFloat(this.f['d24interest'].value) : 0;
    this.d80EEinterest = (!Number.isNaN(parseFloat(this.f['d80EEinterest'].value))) ? parseFloat(this.f['d80EEinterest'].value): 0;
    
    this.d80E_educationloaninterest= (!Number.isNaN(parseFloat(this.f['d80E_educationloaninterest'].value))) ? parseFloat(this.f['d80E_educationloaninterest'].value): 0;
    this.tcs_tax = (!Number.isNaN(parseFloat(this.f['tcs_tax'].value))) ? parseFloat(this.f['tcs_tax'].value) : 0;
    this.tds_tax = (!Number.isNaN(parseFloat(this.f['tds_tax'].value))) ? parseFloat(this.f['tds_tax'].value) : 0;
    
    this.eligible_80tta = this.d80tta_deduction;
    if (this.other_income < this.d80tta_deduction)
      this.eligible_80tta = this.other_income;
    
    this.other_income_after_80tta = this.other_income >= this.d80tta_deduction ? (this.other_income - this.d80tta_deduction) : 0;
    this.total_deductions_old = this.std_deduction + this.prof_tax + this.hra_deduction + this.d80c_deduction +
      this.d80ccd1b_deduction + this.d80ccd2_deduction + this.d80d_deduction + this.d24interest + this.d80E_educationloaninterest;
    
    this.total_deductions_new = this.std_deduction + this.d80ccd2_deduction;

    this.calculated_netIncome_oldregime = Math.floor(this.netIncome +this.other_income_after_80tta - this.total_deductions_old);
    this.calculated_netIncome_newregime = Math.floor(this.netIncome +this.other_income- this.total_deductions_new);
    this.totalTax_old = this.taxCalculatorService.taxCalculator_old_regime(this.calculated_netIncome_oldregime);
    this.totalTax_new = this.taxCalculatorService.taxCalculated_new_regime(
      this.calculated_netIncome_newregime
    );

    let tax_rebate_newregime: number = 25000;
    let tax_rebate_oldregime: number = 12500;
    debugger;
    if (this.calculated_netIncome_newregime <= 700000)
      this.eligible_tax_rebate_new =
        tax_rebate_newregime - this.calculated_netIncome_newregime > 0
          ? this.calculated_netIncome_newregime
          : 0;
    else if (this.calculated_netIncome_oldregime <= 500000)
      this.eligible_tax_rebate_old =
        tax_rebate_oldregime - this.calculated_netIncome_oldregime >= 0
          ? this.calculated_netIncome_oldregime
          : 0;

    this.total_tax_after_rebate_new = Math.floor(
      this.totalTax_new - this.eligible_tax_rebate_new
    );
    this.total_tax_after_rebate_old = Math.floor(
      this.totalTax_old - this.eligible_tax_rebate_old
    );

    //include health cess
    this.tax_new_withcess = Math.floor(
      this.calculateTaxWithCess(this.total_tax_after_rebate_new)
    );
    this.tax_old_withcess = Math.floor(
      this.calculateTaxWithCess(this.total_tax_after_rebate_old)
    );

    this.tax_new_withcess_less_tds = Math.floor(
      this.calculateTaxWithCess(this.total_tax_after_rebate_new) -
        this.tcs_tax -
        this.tds_tax
    );
    this.tax_old_withcess_less_tds = Math.floor(
      this.calculateTaxWithCess(this.total_tax_after_rebate_new) -
        this.tcs_tax -
        this.tds_tax
    );

    if (this.total_tax_after_rebate_new < 0)
      this.total_tax_after_rebate_new = 0;

    if (this.total_tax_after_rebate_old < 0)
      this.total_tax_after_rebate_old = 0;

    if (this.tax_new_withcess_less_tds < 0) this.tax_new_withcess_less_tds = 0;

    if (this.tax_old_withcess_less_tds < 0) this.tax_old_withcess_less_tds = 0;

    if (this.tax_new_withcess_less_tds - this.tax_old_withcess_less_tds > 0) {
      this.isNewProfitable = false;
      this.taxDifference =
        this.tax_new_withcess_less_tds - this.tax_old_withcess_less_tds;
    } else {
      this.isNewProfitable = true;
      this.taxDifference =
        this.tax_old_withcess_less_tds - this.tax_new_withcess_less_tds;
    }
  }
  
  calculateTaxWithCess(tax: number): any{
    let taxWithCess: number = tax + (tax * 4 / 100);
    return taxWithCess;
  }
}
