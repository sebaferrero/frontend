import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartModelServer } from '../models/cart.model';
import { CartService } from '../service/cart.service';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartTotal : number = 0;
  cartData: CartModelServer = {
    total: 0,
    data: [
      {
        product: undefined,
        numInCart: 0
      }
    ]
  };

  constructor(private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {

    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

  }

  onCheckOut(){
    this.spinner.show().then(p => {
      this.cartService.CheckoutFromCart(1);
    })
  }
  
}
