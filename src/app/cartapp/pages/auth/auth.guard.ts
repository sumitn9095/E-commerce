import { inject, Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let _router = inject(Router)
  var token;
  if (typeof window !== undefined && window && sessionStorage && window.sessionStorage) token = sessionStorage.getItem("shop_token");
  if(!token || token === '' || token === undefined || token === null) {
    alert("To access products for shopping, please signin first.")
    _router.navigate(['../../../signin']);
    return false;
  }
  else return true;
};  