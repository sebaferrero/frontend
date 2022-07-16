import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { ProductModelServer, ServerResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient) { }

  /* This is to fetch all products from the backend server */
  getAllProducts():Observable<ProductModelServer[]>{
    return this.http.get<ServerResponse>(this.SERVER_URL+"/products/").pipe(map((value:ServerResponse)=>value.products))
  }

  /* GET SINGLE PRODUCT FROM SERVER */
  getSingleProduct(id: number):Observable<ProductModelServer>{
    return this.http.get<ProductModelServer>(this.SERVER_URL + '/products/'+id);
  }

  /* GET PRODUCTS FROM ONE CATEGORY */
  getProductsFromCategory(catName: string):Observable<ProductModelServer[]>{
    return this.http.get<ProductModelServer[]>(this.SERVER_URL + '/products/category/'+catName)
  }
}
