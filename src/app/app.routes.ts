import { Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { DeferComponent } from './defer/defer.component';
import { StudentRegisterComponent } from './student-register/student-register.component';


export const routes: Routes = [
    {path: 'test', component: TestComponent},
    {path: 'defer', component: DeferComponent},
    {path: 'student-registration', component: StudentRegisterComponent}
];
