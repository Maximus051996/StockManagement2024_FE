import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../core/services/product/product.service';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { CompanyService } from '../../core/services/company/company.service';
import { DropdownModule } from 'primeng/dropdown';
import { Message } from '../../core/constants/messages';
import { SharedService } from '../../core/services/shared/shared.service';
import { TableModule } from 'primeng/table';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { MessagesModule } from 'primeng/messages';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ButtonModule,
    RippleModule,
    CommonModule,
    FormsModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    FileUploadModule,
    MessagesModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  products!: any[];
  companyList!: any[];
  selectedCompany: any = null;
  loading!: boolean;
  filteredproducts!: any[];
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  messages: any;
  constructor(
    private productService: ProductService,
    private router: Router,
    private companyService: CompanyService,
    private sharedService: SharedService
  ) {
    this.getCompanyList();
    this.getproductDetails();
    this.messages = [
      {
        severity: 'info',
        detail: `Please search by Product Name and filter Product using Company Name Dropdown if required .`,
      },
    ];
  }

  ngOnInit(): void {}

  async getproductDetails(isExport?: boolean) {
    this.loading = true;
    await this.productService.getAllproducts().subscribe(
      (response) => {
        let transformedProducts = this.gettransformedData(response);
        this.products = transformedProducts;
        this.filteredproducts = transformedProducts;
        this.loading = false;
        isExport == true
          ? this.exportToExcel(this.products)
          : Message.excelUploadfalse;
      },
      (error) => {
        this.sharedService.openSnackBar(Message.errorMsg, 'OK');
        throw error;
      }
    );
  }

  gettransformedData(response: any) {
    const transformedProducts = response.flatMap((product: any) => {
      if (Array.isArray(product.productDetails)) {
        return product.productDetails.map((detail: any) => {
          return {
            _id: product._id,
            companyId: product.companyId,
            productName: product.productName,
            mrp: detail.mrp,
            quantity: detail.quantity,
            defaultpercentage: detail.defaultpercentage,
            doExpiry: detail.dOExpiry,
            selectedWarehouse: detail.selectedWarehouse,
          };
        });
      } else {
        return [];
      }
    });
    return transformedProducts;
  }

  onChangeproductDetailsByCompanyId(selectedCompany: any) {
    if (selectedCompany) {
      this.loading = true;
      this.productService
        .getAllProductsByCompanyId(selectedCompany.companyId)
        .subscribe(
          (response) => {
            let transformedProducts = this.gettransformedData(response);
            this.products = transformedProducts;
            this.loading = false;
          },
          (error) => {
            this.sharedService.openSnackBar(Message.errorMsg, 'OK');
            this.loading = false;
            throw error;
          }
        );
    } else {
      this.products = this.filteredproducts;
    }
  }

  addRecord() {
    this.router.navigate([`ins/add-product`]);
  }

  searchValue(targetValue: any): void {
    let searchTerm = targetValue.value.toLowerCase();

    if (!searchTerm) {
      this.products = [...this.filteredproducts];
    } else {
      this.products = this.filteredproducts.filter((result) =>
        result.productName.toLowerCase().includes(searchTerm)
      );
    }
  }

  selectDataById(rowDataId: any) {
    this.router.navigate([`ins/edit-product/${rowDataId}`]);
  }

  deleteDataById(rowDataId: any) {
    this.loading = true;
    this.productService.deleteProductById(rowDataId).subscribe(
      (responseData: any) => {
        let data = this.gettransformedData(responseData.products);
        this.products = data;
        this.filteredproducts = data;
        this.loading = false;
        this.sharedService.openSnackBar(responseData.message, 'OK');
      },
      (error) => {
        this.sharedService.openSnackBar(Message.errorAddeditdeleteMsg, 'OK');
        throw error;
      }
    );
  }

  getCompanyList() {
    this.companyService.getAllCompanies().subscribe((data) => {
      this.companyList = data;
    });
  }

  async exportData() {
    try {
      await this.getproductDetails(true);
      this.selectedCompany = null;
    } catch (err) {
      throw err;
    }
  }

  private async exportToExcel(products: any[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Define header row
    worksheet.columns = [
      { header: 'Company Name', key: 'companyName', width: 30 },
      { header: 'Product Name', key: 'productName', width: 60 },
      { header: 'MRP', key: 'mrp', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 30 },
      { header: 'Percentage', key: 'defaultpercentage', width: 30 },
      { header: 'Expiry Details', key: 'doExpiry', width: 30 },
      { header: 'Warehouse', key: 'selectedWarehouse', width: 30 },
    ];

    // Add rows
    products.forEach((product) => {
      const expiryDate = new Date(product.doExpiry);
      const expiryMonthYear = expiryDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
      });

      worksheet.addRow({
        companyName: this.companyList.find(
          (c) => c.companyId === product.companyId
        )?.companyName,
        productName: product.productName,
        mrp: product.mrp,
        quantity: product.quantity,
        defaultpercentage: product.defaultpercentage,
        doExpiry: expiryMonthYear,
        selectedWarehouse: product.selectedWarehouse,
      });
    });

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
      };
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      };
      cell.font = { bold: true };
    });

    // Style data cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        if (rowNumber !== 1) {
          // Skip header row
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } },
          };
        }
      });
    });

    // Generate buffer and create a blob
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Create download link and trigger download

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    let timestamp = this.sharedService.gettimeStamp();
    link.download = `product_${timestamp}.xlsx`;
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
  }

  onFileSelect(event: any) {
    this.loading = true;
    const file = event.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Process the data
      let resultData: any;
      // Convert to JSON format
      if (data.length > 0) {
        const header: any = data[0];
        if (
          header[0] === 'Company Name' &&
          header[1] === 'Product Name' &&
          header[2] === 'MRP' &&
          header[3] === 'Quantity' &&
          header[4] === 'Percentage' &&
          header[5] === 'Expiry Details' &&
          header[6] === 'Warehouse'
        ) {
          resultData = data.slice(1).map((row: any) => ({
            companyName: row[0],
            productName: row[1],
            mrp: row[2],
            quantity: row[3],
            defaultpercentage: row[4],
            dOExpiry: this.convertToISODate(row[5]),
            selectedWarehouse: row[6],
          }));
          this.productService
            .importproducts(resultData)
            .subscribe((response) => {
              this.sharedService.openSnackBar(response.message, 'OK');
              this.fileUpload.clear();
              this.getproductDetails();
              this.loading = false;
            });
        } else {
          this.sharedService.openSnackBar(
            `${Message.excelHeadererror} : ${header}`,
            'OK'
          );
        }
      }
    };
    reader.readAsBinaryString(file);
  }

  convertToISODate(dateString: string): string {
    // Create a Date object from the input string
    const date = new Date(dateString);

    // Ensure the date is valid
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${dateString}`);
    }

    // Get the components of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
    const day = String(date.getDate()).padStart(2, '0');

    // Construct the ISO string
    const isoDateString = `${year}-${month}-${day}T18:30:00.000+00:00`;

    return isoDateString;
  }
}
