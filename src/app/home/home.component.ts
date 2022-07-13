import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModelServer } from '../models/product.model';
import { CartService } from '../service/cart.service';
import { ProductsService } from '../service/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: ProductModelServer[] = [];

  categories:any= [
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

  constructor(private productService: ProductsService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getAllProducts()
    .subscribe({
      next:(data:ProductModelServer[])=>{
        console.log(data);
        this.products = data;
      },
      error:(e:any)=>{console.log(e)}
    })
  }

  selectedProduct(id:number){
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id: number){
    this.cartService.AddProductToCart(id);
  }

}
