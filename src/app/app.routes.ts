import { Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { DeferComponent } from './defer/defer.component';
import { RegistrationComponent } from './cartapp/pages/auth/registration/registration.component';
import { ShoppingComponent } from './cartapp/pages/shopping/shopping.component';
import { ShoppingWithDbComponent } from './cartapp/pages/shopping-with-db/shopping-with-db.component';
import { ShoppingListDbComponent } from './cartapp/components/shopping-list-db/shopping-list-db.component';
import { authGuard } from './cartapp/pages/auth/auth.guard';
import { CategoryComponent } from './cartapp/pages/category/category.component';
import { ProductComponent } from './cartapp/pages/product/product.component';

export const routes: Routes = [
  { path: 'test', component: TestComponent },
  { path: 'defer', component: DeferComponent },
  // {path: 'student-registration', component: StudentRegisterComponent},
  {
    path: 'new-feature-model',
    loadComponent: () =>
      import('./new-feature-model/new-feature-model.component').then(
        (m) => m.NewFeatureModelComponent
      ),
  },
  {
    path: 'new-features',
    loadComponent: () =>
      import('./new-features/new-features.component').then(
        (m) => m.NewFeaturesComponent
      ),
  },
  {
    path: 'change-detection-with-signal',
    loadComponent: () =>
      import(
        './change-detection-with-signal/change-detection-with-signal.component'
      ).then((m) => m.ChangeDetectionWithSignalComponent),
  },
  {
    path: 'registration',
    loadComponent: () =>
      import('./cartapp/pages/auth/registration/registration.component').then(
        (m) => m.RegistrationComponent
      ),
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./cartapp/pages/auth/signin/signin.component').then(
        (m) => m.SigninComponent
      ),
  },
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  },
  {
    path: 'shopping',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./cartapp/pages/shopping/shopping.component').then(
        (m) => m.ShoppingComponent
      ),
    children: [
      {
        path: 'rxjs',
        loadComponent: () =>
          import(
            './cartapp/components/shopping-list-rxjs/shopping-list-rxjs.component'
          ).then((m) => m.ShoppingListRxjsComponent),
      },
      {
        path: 'signal',
        loadComponent: () =>
          import(
            './cartapp/components/shopping-list-signal/shopping-list-signal.component'
          ).then((m) => m.ShoppingListSignalComponent),
      },
      {
        path: 'custom',
        loadComponent: () =>
          import(
            './cartapp/components/shopping-list-custom/shopping-list-custom.component'
          ).then((m) => m.ShoppingListCustomComponent),
      },
    ],
  },
  {
    path: 'shopping-with-db',
    canActivate: [authGuard],
    component: ShoppingWithDbComponent,
    children: [
      {
        path: 'db',
        component: ShoppingListDbComponent,
      },
    ],
  },
  {
    path: 'cart-history',
    canActivate: [authGuard],
    loadComponent: ()=>import('./cartapp/pages/cart-history/cart-history.component').then((m)=>m.CartHistoryComponent)
  },
  {
    path: 'category', canActivate: [authGuard], loadComponent: ()=>import('./cartapp/pages/shopping-with-db/shopping-with-db.component').then((m)=>m.ShoppingWithDbComponent)
  },
  {
    path: 'category/:slug',
    canActivate: [authGuard],
    loadComponent: ()=>import('./cartapp/pages/shopping-with-db/shopping-with-db.component').then((m)=>m.ShoppingWithDbComponent)
  },
  {
    path: 'product/:id',
    canActivate: [authGuard],
    loadComponent: ()=>import('./cartapp/pages/shopping-with-db/shopping-with-db.component').then((m)=>m.ShoppingWithDbComponent)
  },
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  // { path: '**', component: ErrorComponent }
  // {
  //     path: 'shopping/rxjs',
  //     loadComponent: ()=>import('./cartapp/components/shopping-list-rxjs/shopping-list-rxjs.component').then(m=>m.ShoppingListRxjsComponent)
  // },
  // {
  //     path: 'shopping/signal',
  //     loadComponent: ()=>import('./cartapp/components/shopping-list-signal/shopping-list-signal.component').then(m=>m.ShoppingListSignalComponent)
  // },
  // {
  //     path: 'shopping/custom',
  //     loadComponent: ()=>import('./cartapp/components/shopping-list-custom/shopping-list-custom.component').then(m=>m.ShoppingListCustomComponent)
  // }
];
