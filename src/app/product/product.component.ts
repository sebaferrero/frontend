import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { ProductsService } from '../service/products.service';
import { CartService } from '../service/cart.service';

declare let $: any; //JQUERY

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, AfterViewInit {
  id: number = 0;
  product: any;
  thumbImages: any[] = [];
  @ViewChild('quantity') quantityInput:any;

  constructor(
    private productService: ProductsService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => {
          return params.get('id');
        })
      )
      .subscribe((prodId) => {
        this.id = parseInt(prodId!);
        this.productService
          .getSingleProduct(this.id)
          .subscribe((product: any) => {
            this.product = product.prod;
            if (this.product.images != null) {
              this.thumbImages = this.product.images.split(';');
            }
          });
      });
  }

  ngAfterViewInit(): void {
    // Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [
        {
          breakpoint: 991,
          settings: {
            vertical: false,
            arrows: false,
            dots: true,
          },
        },
      ],
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  Decrease() {
    let value = parseInt(this.quantityInput.nativeElement.value);

    if(this.product.quantity > 0){
      value--;

      if(value <= 1){
        value = 1;
      }

    }else{
      return;
    }

    this.quantityInput.nativeElement.value = value.toString();
  }

  Increase() {
    let value = parseInt(this.quantityInput.nativeElement.value);

    if(this.product.quantity >= 1){
      value++;

      if(value > this.product.quantity){
        value = this.product.quantity;
      }

    }else{
      return;
    }

    this.quantityInput.nativeElement.value = value.toString();
  }

  addToCart(id: number) {
    this.cartService.AddProductToCart(id, this.quantityInput.nativeElement.value);
  }
}
