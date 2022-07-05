import { Component, OnInit } from '@angular/core';
import { CartModelServer } from '../models/cart.model';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartData: CartModelServer = {
    total: 0,
    data: [
      {
        product: undefined,
        numInCart: 0
      }
    ]
  };

  cartTotal : number = 0;
  subTotal : number = 0;

  constructor(public cartService: CartService) { }

  ngOnInit(): void {

    this.cartService.cartData$.subscribe((data:CartModelServer)=> this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

  }

  ChangeQuantity(index:number, increase: boolean){
    this.cartService.UpdateCartItems(index, increase);
  }

}
