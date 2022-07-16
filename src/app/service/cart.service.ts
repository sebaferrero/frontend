import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { ProductModelServer } from '../models/product.model';
import { OrderService } from './order.service';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private serverURL = environment.SERVER_URL;

  // Data variable to store the cart information on the client's localStorage
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [
      {
        incart: 0,
        id: 0,
      },
    ],
  };

  // Data variable to store cart information on the server
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [
      {
        numInCart: 0,
        product: undefined,
      },
    ],
  };

  /* OBSERVABLES FOR THE COMPONENTS TO SUBSCRIBE */
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);
  producto:any
  prods:any = [];
  constructor(
    private http: HttpClient,
    private productService: ProductsService,
    private orderService: OrderService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    // Get the information from local storage (if any)

    let info: CartModelPublic = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') || '') : null;
    // Check if the info variable is null or has some data in it
    if (info != null && info != undefined && info.prodData[0].incart != 0) {
      // local Storage is not empty ad has some information
      this.cartDataClient = info;
      // Loop through each entre and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach((p) => {
        this.productService
          .getSingleProduct(p.id)
          .subscribe((actualProductSInfo: ProductModelServer) => {
            this.producto = actualProductSInfo
            if (this.cartDataServer.data[0].numInCart == 0) {
              this.cartDataServer.data[0].numInCart = p.incart;
              this.cartDataServer.data[0].product = this.producto['prod'];
              // TODO Create CalculateTotal Function and replace it here
              this.CalculateTotal();
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {
              // CartDataServer already has some entry in it
              this.cartDataServer.data.push({
                numInCart: p.incart,
                product: actualProductSInfo,
              });
              // TODO Create CalculateTotal Function and replace it here
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }
            this.cartData$.next({ ...this.cartDataServer });
          });
      });
    }
  }

  AddProductToCart(id: number, quantity?: number) {
    this.productService.getSingleProduct(id).subscribe((prod) => {
      this.producto = prod;
      // 1.If the cart is empty
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = this.producto['prod'];
        this.cartDataServer.data[0].numInCart =
          quantity != undefined ? quantity : 1;
        // TODO CALCULATE TOTAL AMOUNT
        this.CalculateTotal();
        this.cartDataClient.prodData[0].incart =
          this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = this.producto['prod']['id'];
        this.cartDataClient.total = this.cartDataServer.total;
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({ ...this.cartDataServer });
        // TODO DISPLAY A TOAST NOTIFICATION
        this.toast.success(`${this.producto['prod']['name']} added to the cart`, 'Product Added', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right',
        });
      } else {
        // 2. If the cart has some items
        let index = this.cartDataServer.data.findIndex(
          (p) => p.product!.id === this.producto['prod']['id']
        ); // -1 or a positive value
        // a. If that item is already in the cart => index is positive value
        if (index != -1) {
          if (quantity != undefined && quantity <= this.producto['prod']['quantity']) {
            this.cartDataServer.data[index].numInCart =
              this.cartDataServer.data[index].numInCart < this.producto['prod']['quantity']
                ? quantity
                : prod.quantity;
          } else {
              this.cartDataServer.data[index].numInCart < this.producto['prod']['quantity']
                ? this.cartDataServer.data[index].numInCart++
                : this.producto['prod']['quantity'];
          }

          this.cartDataClient.prodData[index].incart =
            this.cartDataServer.data[index].numInCart;
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          // TODO DISPLAY A TOAST NOTIFICATION
          this.toast.info(
            `${this.producto['prod']['name']} quantity update in the cart`,
            'Product Updated',
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            }
          );
        } // END OF IF
        else {
          // b. If that item is not in the cart
          this.cartDataServer.data.push({
            numInCart: quantity != undefined && quantity <= this.producto['prod']['quantity'] ? quantity : 1,
            product: this.producto['prod'],
          });

          this.cartDataClient.prodData.push({
            incart: quantity != undefined && quantity <= this.producto['prod']['quantity'] ? quantity : 1,
            id: this.producto['prod']['id'],
          });
          this.CalculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          // TODO DISPLAY A TOAST NOTIFICATION
          this.toast.success(
            `${this.producto['prod']['name']} added to the cart`,
            'Product Added',
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            }
          );
        } // END OF ELSE
      }
    });
  }

  UpdateCartItems(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];

    if (increase) {
      data.numInCart < data.product!.quantity
        ? data.numInCart++
        : data.product?.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;

      // TODO CALCULATE TOTAL AMOUNT
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({ ...this.cartDataServer });
    } else {
      data.numInCart--;
      if (data.numInCart < 1) {
        // TODO DELETE THE PRODUCT FROM CART
        this.DeleteProductFromCart(index);
        this.cartData$.next({ ...this.cartDataServer });
      } else {
        this.cartData$.next({ ...this.cartDataServer });
        this.cartDataClient.prodData[index].incart = data.numInCart;
        // TODO CALCULATE TOTAL AMOUNT
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({ ...this.cartDataServer });
      }
    }
  }

  DeleteProductFromCart(index: number) {
    if (window.confirm('Are you sure you want t remove the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      // TODO CALCULATE TOTAL AMOUNT
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      if (this.cartDataClient.total === 0) {
        this.cartDataClient = { total: 0, prodData: [{ incart: 0, id: 0 }] };
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          total: 0,
          data: [{ numInCart: 0, product: undefined }],
        };
        this.cartData$.next({ ...this.cartDataServer });
      }
    } else {
      // IF THE USER CLICKS THE CANCEL BUTTON
      return;
    }
  }

  private CalculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach((p) => {
      const { numInCart } = p;
      const { price } = p.product!;
      Total += numInCart * price;
    });

    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  CheckoutFromCart(userId: number) {
    this.http.post(`${this.serverURL}/orders/payment/`, null).subscribe((res) => {
      //aca lo hice distinto (recibe un boolean)
      if (res) {
        this.resetServerData();
        this.http
          .post<OrderResponse>(`${this.serverURL}/orders/new/`, {
            userId: userId,
            products: this.cartDataClient.prodData,
          })
          .subscribe((data: OrderResponse) => {
            this.orderService.getSingleOrder(data.order_id).then((productos) => {
              this.prods = productos;
              console.log(this.prods);
              if (data.success) {
                const navigationExtras: NavigationExtras = {
                  state: {
                    message: data.message,
                    products: this.prods,
                    orderId: data.order_id,
                    total: this.cartDataClient.total,
                  },
                };

                // TODO HIDE SPINNER
                this.spinner.hide().then();
                this.router
                  .navigate(['/thankyou'], navigationExtras)
                  .then((p) => {
                    this.cartDataClient = {
                      total: 0,
                      prodData: [{ incart: 0, id: 0 }],
                    };
                    this.cartTotal$.next(0);
                    localStorage.setItem(
                      'cart',
                      JSON.stringify(this.cartDataClient)
                    );
                  });
              } else {
                this.spinner.hide().then();
                this.router.navigateByUrl('/checkout').then();
                // TODO DISPLAY A TOAST NOTIFICATION
                this.toast.error(
                  `Sorry, failed to book the order`,
                  'Order Status',
                  {
                    timeOut: 1500,
                    progressBar: true,
                    progressAnimation: 'increasing',
                    positionClass: 'toast-top-right',
                  }
                );
              }
            });
          });
      }
    });
  }

  private resetServerData() {
    this.cartDataServer = {
      total: 0,
      data: [
        {
          numInCart: 0,
          product: undefined,
        },
      ],
    };

    this.cartData$.next({ ...this.cartDataServer });
  }

  CalculateSubTotal(index:number): number {
    let subTotal = 0;
    const p = this.cartDataServer.data[index];

    subTotal = p.product!.price*p.numInCart;

    return subTotal;

  }

}
interface OrderResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [
    {
      id: string;
      numIntCart: number;
    }
  ];
}
