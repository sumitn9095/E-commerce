import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ShopService } from '../../utility/shop.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  var _shop = inject(ShopService)
  let token;
  if(typeof window !== "undefined") token = sessionStorage.getItem('shop_token');
  let tokenAuth;

  if (token !== '') {
    tokenAuth = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    tokenAuth = req;
  }
  
  let gt = next(tokenAuth)
  return gt;
  // .pipe(
  //   catchError((error: HttpErrorResponse) => {
  //       let errorMsg = '';
  //       if (error.error instanceof ErrorEvent) {
  //         console.log('this is client side error');
  //         errorMsg = `Error: ${error.error.message}`;
  //       } else {
  //         console.log('this is server side error');
  //         errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
  //       }
  //       _shop.printApiState(error);
  //       return error;
  //   })
  // )
};
