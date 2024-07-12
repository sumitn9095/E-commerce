import { Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { DeferComponent } from './defer/defer.component';
import { RegistrationComponent } from './cartapp/pages/registration/registration.component';
import { ShoppingComponent } from './cartapp/pages/shopping/shopping.component';


export const routes: Routes = [
    {path: 'test', component: TestComponent},
    {path: 'defer', component: DeferComponent},
    // {path: 'student-registration', component: StudentRegisterComponent},
    {path: 'new-feature-model', loadComponent:()=> import('./new-feature-model/new-feature-model.component').then(m=>m.NewFeatureModelComponent)},
    {path: 'new-features', loadComponent: ()=>import('./new-features/new-features.component').then(m=>m.NewFeaturesComponent)},
    {path: 'change-detection-with-signal', loadComponent: ()=>import('./change-detection-with-signal/change-detection-with-signal.component').then(m=>m.ChangeDetectionWithSignalComponent)},

    {path: 'registration', component: RegistrationComponent},
    {path: 'shopping', component: ShoppingComponent}
];
