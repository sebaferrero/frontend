import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {
  
  message?:string;
  orderId?:number;
  products:any=[];
  cartTotal:number=0;
  
  constructor(private router:Router,
              private orderService: OrderService
             ){
    const navigation = this.router.getCurrentNavigation(); // Obtener Nav Actual.
    const state = navigation?.extras.state as {
      message:string;
      products:ProductResponseModel[],
      orderId:number;
      total:number;
    }
    this.message = state.message;
    this.products = state.products;
    console.log(this.products);
    this.orderId = state.orderId;
    this.cartTotal = state.total;
  }

  ngOnInit(): void {
  }

}

interface ProductResponseModel{
  id:number;
  name:string;
  description:string;
  price:number;
  quantityOrdered:number;
  image:string;
}
