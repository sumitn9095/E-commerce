import { inject, Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';



export const authGuard: CanActivateFn = (route, state) => {
 
  let _router = inject(Router)
  var token;
  if (typeof window !== "undefined") token = sessionStorage.getItem("shop_token");
  
  if(!token || token === '' || token === undefined || token === null) {
    
    if (typeof window !== "undefined") alert("To access products for shopping, please signin first.")
    _router.navigate(['../../../signin']);
    return false;
  }
  else return true;
};  