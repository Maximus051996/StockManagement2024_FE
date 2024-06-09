import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule } from 'primeng/messages';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
  FormArray,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product/product.service';
import { SharedService } from '../../../../core/services/shared/shared.service';
import { CompanyService } from '../../../../core/services/company/company.service';
import { Message } from '../../../../core/constants/messages';
import { NgxSpinnerModule } from 'ngx-spinner';
@Component({
  selector: 'app-addeditproduct',
  standalone: true,
  imports: [
    MatInputModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DropdownModule,
    InputTextModule,
    FloatLabelModule,
    InputNumberModule,
    CalendarModule,
    MessagesModule,
    NgxSpinnerModule,
  ],
  templateUrl: './addeditproduct.component.html',
  styleUrl: './addeditproduct.component.scss',
})
export class AddeditproductComponent implements OnInit {
  companyList!: any[];
  totalQuantity: number = 0;
  messages: any;
  isEditMode: boolean = true;
  addeditForm = this.fb.group({
    selectedCompany: [null, Validators.required],
    productName: ['', Validators.required],
    rows: this.fb.array([]), // Initialize rows here
  });
  warehouseList = [
    { name: 'Upper Big Room', code: 'UBR' },
    { name: 'Upper Small Room', code: 'USR' },
    { name: 'Lower Small Room', code: 'LSR' },
    { name: 'Primary Home', code: 'PH' },
    { name: 'Secondary Home', code: 'SH' },
  ];
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private sharedService: SharedService,
    private companyService: CompanyService,
    private router: Router,
    private activaterouter: ActivatedRoute
  ) {
    this.messages = [
      { severity: 'info', detail: `Total Quantity ${this.getTotalQuantity()}` },
    ];
    this.getCompanyList();
    this.rows.valueChanges.subscribe(() => {
      this.updateTotalQuantityMessage();
    });
  }
  ngOnInit() {
    this.activaterouter.paramMap.subscribe((params) => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadProductDetails(this.productId);
      }
    });
  }

  get rows(): FormArray {
    return this.addeditForm.get('rows') as FormArray;
  }

  addRow() {
    this.rows.push(
      this.fb.group({
        selectedWarehouse: null,
        mrp: 0,
        quantity: 0,
        dOExpiry: null,
        defaultpercentage: 0,
      })
    );
  }

  getCompanyList() {
    this.companyService.getAllCompanies().subscribe((data) => {
      this.companyList = data;
    });
  }

  getTotalQuantity(): number {
    return this.rows.controls.reduce((total, control) => {
      return total + (control.get('quantity')?.value || 0);
    }, 0);
  }
  updateTotalQuantityMessage() {
    this.totalQuantity = this.getTotalQuantity();
    this.messages = [
      { severity: 'info', detail: `Total Quantity ${this.totalQuantity}` },
    ];
  }

  onSubmit() {
    this.sharedService.showSpinner();
    const formjsonData = this.convertToJson(this.addeditForm.value);

    const request$ = this.productId
      ? this.productService.updateProduct(this.productId, formjsonData)
      : this.productService.createProduct(formjsonData);

    request$.subscribe(
      (response) => {
        this.sharedService.openSnackBar(response.message, 'OK');
        this.router.navigate(['/ins/product']);
        this.sharedService.hideSpinner();
      },
      (error) => {
        this.sharedService.openSnackBar(Message.errorAddeditdeleteMsg, 'OK');
        this.sharedService.hideSpinner();
        throw error;
      }
    );
  }

  onCancel() {
    this.addeditForm.reset();
    this.router.navigate(['/ins/product']);
  }

  deleteRowByIndex(index: number) {
    this.rows.removeAt(index);
    this.updateTotalQuantityMessage();
  }

  convertToJson(formData: any): any {
    const rows = formData.rows.map((row: any) => ({
      selectedWarehouse: row.selectedWarehouse.name,
      mrp: row.mrp,
      defaultpercentage: row.defaultpercentage,
      quantity: row.quantity,
      dOExpiry: row.dOExpiry,
    }));

    const jsonData = {
      productName: formData.productName,
      companyId: formData.selectedCompany.companyId,
      productDetails: rows,
      totalQuantity: this.totalQuantity,
    };
    return jsonData;
  }

  loadProductDetails(productId: string) {
    this.sharedService.showSpinner();
    this.productService.getProductByProductId(productId).subscribe(
      (product: any) => {
        this.addeditForm.patchValue({
          selectedCompany: this.companyList.find(
            (company) => company.companyId === product.companyId
          ),
          productName: product.productName,
        });

        this.rows.clear();
        product.productDetails.forEach((detail: any) => {
          this.rows.push(
            this.fb.group({
              selectedWarehouse: this.warehouseList.find(
                (warehouse) => warehouse.name === detail.selectedWarehouse
              ),
              mrp: detail.mrp,
              quantity: detail.quantity,
              dOExpiry: new Date(detail.dOExpiry),
              defaultpercentage: detail.defaultpercentage,
            })
          );
        });
        this.sharedService.hideSpinner();
        this.updateTotalQuantityMessage();
      },
      (error: any) => {
        this.sharedService.openSnackBar(Message.errorAddeditdeleteMsg, 'OK');
        this.sharedService.hideSpinner();
        throw error;
      }
    );
  }
}
