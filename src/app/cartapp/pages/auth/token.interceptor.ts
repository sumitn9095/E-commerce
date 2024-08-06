import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  //return next(req);
  let token;
  if (typeof window !== undefined && window.sessionStorage) token = sessionStorage.getItem('shop_token');
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
  return next(tokenAuth);
};
