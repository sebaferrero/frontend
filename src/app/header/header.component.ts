import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CartModelServer } from '../models/cart.model';
import * as $ from "jquery";
import { CartService } from '../service/cart.service';
import { CategoriesModelServer } from '../models/categories.models';
import { CategoriesService } from '../service/categories.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {


  categories: CategoriesModelServer[] = [];


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

  constructor(public cartService: CartService, public categoryService: CategoriesService) { }
  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.categoryService.getAllCategories()
    .subscribe((data:any) => {
      this.categories = data;
    });
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
    $(function() {    
      $("ul.dropdown-menu [data-toggle='dropdown']").on("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).siblings().toggleClass("show");
        if (!$(this).next().hasClass('show')) {
          $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
          $('.dropdown-submenu .show').removeClass("show");
        });
      });
      
    });
  }
  

}
