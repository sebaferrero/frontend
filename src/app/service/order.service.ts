import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private product: ProductResponseModel[] = [];
  private serverUrl = environment.SERVER_URL;

  constructor(private http:HttpClient) {
  }

  getSingleOrder(orderId:number):Promise<ProductResponseModel[]>{
    return lastValueFrom(this.http.get<ProductResponseModel[]>(this.serverUrl+'/orders/'+orderId));
  }
  // getSingleOrder(orderId: number):Promise<ProductResponseModel[]>{
  //   return lastValueFrom(this.http.get<ProductResponseModel[]>(this.serverUrl+'/orders/'+orderId));
  // }

}

interface ProductResponseModel{
  id:number;
  title:string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}
