import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Message } from '../../constants/messages';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  serverUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  getAllproducts(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.serverUrl}product-details`)
      .pipe(catchError(this.handleError));
  }

  getAllProductsByCompanyId(companyId: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.serverUrl}product-details-companyId/${companyId}`)
      .pipe(catchError(this.handleError));
  }

  createProduct(payload: any): Observable<any> {
    return this.http
      .post(`${this.serverUrl}add-product`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteProductById(productId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.serverUrl}delete-product/${productId}`)
      .pipe(catchError(this.handleError));
  }

  getProductByProductId(productId: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.serverUrl}product-details/${productId}`)
      .pipe(catchError(this.handleError));
  }

  updateProduct(productId: string, payload: any): Observable<any> {
    return this.http
      .put(`${this.serverUrl}update-product/${productId}`, payload)
      .pipe(catchError(this.handleError));
  }

  importproducts(payload: any[]): Observable<any> {
    return this.http
      .post(`${this.serverUrl}import-products`, payload)
      .pipe(catchError(this.handleError));
  }

  getAlldamageproducts(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.serverUrl}get-damage-products-details`)
      .pipe(catchError(this.handleError));
  }

  getAlldamageProductsById(damageproductId: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.serverUrl}damage-products-byId/${damageproductId}`)
      .pipe(catchError(this.handleError));
  }

  createdamageProduct(payload: any): Observable<any> {
    return this.http
      .post(`${this.serverUrl}add-damage-products`, payload)
      .pipe(catchError(this.handleError));
  }

  deletedamageProductById(damageproductId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.serverUrl}delete-damage-products/${damageproductId}`)
      .pipe(catchError(this.handleError));
  }

  updatedamageProduct(damageproductId: string, payload: any): Observable<any> {
    return this.http
      .put(`${this.serverUrl}update-damage-product/${damageproductId}`, payload)
      .pipe(catchError(this.handleError));
  }

  importdamageProducts(payload: any[]): Observable<any> {
    return this.http
      .post(`${this.serverUrl}import-damage-products`, payload)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(Message.errorMsg));
  }
}
