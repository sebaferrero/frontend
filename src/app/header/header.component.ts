import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CartModelServer } from '../models/cart.model';
import * as $ from "jquery";
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {


  categories: any = [
    {
      nombre: 'Tecnología'
    },
    {
      nombre: 'Librería'
    },
    {
      nombre: 'Alimentos y Bebidas'
    },
    {
      nombre: 'Indumentaria'
    },
    {
      nombre: 'Servicios'
    }
  ]

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

    this.cartService.cartData$.subscribe(data => this.cartData = data);
  }

  ngAfterViewInit(): void {
    // Mobile Nav toggle
    $('.menu-toggle > a').on('click', function (e:any) {
      e.preventDefault();
      $('#responsive-nav').toggleClass('active');
    })

    // Fix cart dropdown from closing
    $('.cart-dropdown').on('click', function (e) {
      e.stopPropagation();
    });
  }
  

}
