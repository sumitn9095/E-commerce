import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormsModule, Validators, FormBuilder ,ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { PanelModule } from 'primeng/panel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, FormsModule, PanelModule, OverlayPanelModule, InputTextModule, AutoCompleteModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {
  _ms = inject(MessageService)
  _auth = inject(AuthService)
  _fb = inject(FormBuilder)
  _router = inject(Router)

  studentRegForm!:FormGroup;
  constructor(){}

  ngOnInit(): void {
    this.studentRegForm = this._fb.group({
      email : ['',[Validators.required]],
      password : ['',[Validators.required]]
    });
  }


  signin(){
    let payload = this.studentRegForm.value;
    this._ms.add({ severity: 'success', key:'std', summary: `Loading...` });
    this._auth.signin(payload)
      .subscribe({
        next: (user)=>{
            console.log("user >>",user);
          if(user?.err && user?.err?.errors?.name) {
            //console.log("user error");
            this._ms.add({ severity: 'error', summary: `${user?.err?.message}` });
          } else {
            //console.log("user signedin");
            this._ms.add({ severity: 'success', key:'std', summary: `Hello, ${user?.user?.name}. Welcome to the Shop.`, detail: `You can now go product shopping.` });
            sessionStorage.setItem("shop_token",user?.token);
            sessionStorage.setItem("shop_user_details",JSON.stringify(user?.user));
            if(user?.admin == 'true') sessionStorage.setItem("admin",user?.isAdmin);
            setTimeout(() => {
                 this._router.navigate(['/shopping-with-db']);
            }, 3000);
          }
        },
        error: (err)=>{
          console.log("user error >>",err);
          this._ms.add({ severity: 'error', summary: `${err?.message}` });
        }
      })
  }
}
