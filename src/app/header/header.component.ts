import { Component, OnInit } from '@angular/core';
import { CartModelServer } from '../models/cart.model';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  cartData: CartModelServer = {
    total: 0,
    data: [
      {
        product: undefined,
        numInCart: 0
      }
    ]
  };
  cartTotal: number = 0;

  constructor(public cartService: CartService) { }
  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this.cartService.cartData$.subscribe(data=> this.cartData = data);
  }

}
