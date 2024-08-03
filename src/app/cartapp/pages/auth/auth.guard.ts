import { inject, Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
// import { MessageService } from 'primeng/api';

export const authGuard: CanActivateFn = (route, state) => {
  //let _ms = inject(MessageService)
  let token = sessionStorage.getItem("shop_token");
  if(!token || token === '' || token === undefined || token === null) {
    //_ms.add({ severity: 'error', summary: 'You need to Login first, to access Dashboard' });
    return false;
  }
  else return true;
};