import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { ProductService } from '../../../../core/services/product/product.service';
import { CompanyService } from '../../../../core/services/company/company.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CalendarModule } from 'primeng/calendar';
import { SharedService } from '../../../../core/services/shared/shared.service';
import { Message } from '../../../../core/constants/messages';
@Component({
  selector: 'app-addeditdamageproduct',
  standalone: true,
  imports: [
    NgxSpinnerModule,
    CommonModule,
    ButtonModule,
    RippleModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule,
  ],
  templateUrl: './addeditdamageproduct.component.html',
  styleUrl: './addeditdamageproduct.component.scss',
})
export class AddeditdamageproductComponent implements OnInit {
  companyList!: any;
  productList!: any;
  filteredProductList: any[] = [];
  addeditForm!: FormGroup;
  isEdit = false;
  damageproductId: string | undefined;
  constructor(
    private productService: ProductService,
    private router: Router,
    private companyService: CompanyService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.sharedService.showSpinner();
    this.addeditForm = this.fb.group({
      selectedCompany: [null, Validators.required],
      selectedProduct: [null, Validators.required],
      quantity: [null, Validators.required],
      mrp: [0, Validators.required],
      dOExpiry: [null, Validators.required],
    });
    Promise.all([this.getCompanyDetails(), this.getproductDetails()])
      .then(() => {
        this.patchValueById();
      })
      .catch((error) => {
        this.sharedService.openSnackBar(Message.errorMsg, 'OK');
        throw error;
      });
  }

  patchValueById() {
    if (this.router.url.includes('edit')) {
      this.isEdit = true;
      const segments = this.router.url.split('/');
      this.damageproductId = segments[segments.length - 1];
      this.patchFormData();
    }
  }

  patchFormData() {
    if (this.damageproductId) {
      this.filteredProductList = this.productList;
      this.productService
        .getAlldamageProductsById(this.damageproductId)
        .subscribe(
          (data: any) => {
            this.addeditForm.patchValue({
              selectedCompany: this.companyList.find(
                (company: any) => company.companyId === data.companyId
              ),
              selectedProduct: this.productList.find(
                (product: any) => product.productId === data.productId
              ),
              quantity: data.quantity,
              mrp: data.mrp,
              dOExpiry: new Date(data.dOExpiry),
            });

            this.sharedService.hideSpinner();
          },
          (error) => {
            this.sharedService.hideSpinner();
            this.sharedService.openSnackBar(Message.errorMsg, 'OK');
            throw error;
          }
        );
    }
  }

  getCompanyDetails(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.companyService.getAllCompanies().subscribe(
        (companies) => {
          this.companyList = companies;
          resolve(companies);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getproductDetails(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.productService.getAllproducts().subscribe(
        (products) => {
          this.productList = products;
          resolve(products);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  onCancel() {
    this.addeditForm.reset();
    this.router.navigate(['/ins/damage-details']);
  }

  onCompanyChange(companyDetails: any) {
    if (companyDetails) {
      this.filteredProductList = this.productList.filter(
        (product: any) => product.companyId === companyDetails.companyId
      );
    } else {
      this.filteredProductList = [];
      this.addeditForm.get('selectedProduct')!.reset();
    }
  }

  onSubmit() {
    if (this.addeditForm.valid) {
      this.sharedService.showSpinner();
      const damageproductData = {
        companyId: this.addeditForm.value.selectedCompany.companyId,
        productId: this.addeditForm.value.selectedProduct.productId,
        quantity: this.addeditForm.value.quantity,
        mrp: this.addeditForm.value.mrp,
        dOExpiry: this.addeditForm.value.dOExpiry,
        isDeleted: false,
      };
      const saveObservable =
        this.isEdit && this.damageproductId
          ? this.productService.updatedamageProduct(
              this.damageproductId,
              damageproductData
            )
          : this.productService.createdamageProduct(damageproductData);

      saveObservable.subscribe(
        (res) => {
          this.sharedService.openSnackBar(res.message, 'OK');
          this.router.navigate(['/ins/damage-details']);
          this.sharedService.hideSpinner();
        },
        (error) => {
          this.sharedService.openSnackBar(Message.errorAddeditdeleteMsg, 'OK');
          this.sharedService.hideSpinner();
          throw error;
        }
      );
    }
  }
}
