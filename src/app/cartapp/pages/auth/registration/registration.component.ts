import { Component, OnInit, computed, inject } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { StepsModule } from 'primeng/steps';
import { PanelModule } from 'primeng/panel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { MenuItem, MessageService } from 'primeng/api';
import { FormGroup, FormsModule, Validators, FormBuilder ,ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../../utility/cart.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AuthService } from '../auth.service';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, FormsModule,StepsModule, PanelModule, OverlayPanelModule, CalendarModule, InputTextModule, InputGroupModule, AutoCompleteModule, ButtonModule, ToastModule],
  providers: [CartService, MessageService],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})

export class RegistrationComponent implements OnInit {
  formSteps: MenuItem[] | undefined;
  activeIndex: number = 0;
  sidebarVisible2: boolean = false;
  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }
  public studentRegForm!: FormGroup;
  public formSectionValid:boolean = true;
  public isSectionValid:boolean = false;

  public currntSelectedInpIs : string = '';

  public genderOptions:any[]=[];
  public occupationOptions:any[]=[];

  _fb = inject(FormBuilder);
  _cart = inject(CartService);
  _ms = inject(MessageService);
  _router = inject(Router);


  _auth = inject(AuthService)

  constructor(){}

  ngOnInit(): void {
    this.studentRegForm = this._fb.group({
      name : ['',[Validators.required]],
      birthDate : [new Date(),[Validators.required]],
      gender: ['',[Validators.required]],
      occupation: ['',[Validators.required]],
      designation: ['',[Validators.required]],
      email: ['',[Validators.required]],
      phone: ['',Validators.required],
      password: ['',Validators.required]
    });

    // this.studentRegForm.valueChanges
    // .pipe(debounceTime(2000),distinctUntilChanged())
    // .subscribe((d:any) => {
    //   //console.log("FORM",d)
    //   if(this.currntSelectedInpIs == 'firstName' || this.currntSelectedInpIs == 'lastName') {
    //     let fullName = computed(()=> this._cart.firstName() + ' -- ' + this._cart.lastName())
    //     this._ms.add({ severity: 'success', summary: 'Welcome, ', detail: fullName() });
    //   }
    //   if(this.currntSelectedInpIs == 'birthDate') {
    //     this._ms.add({ severity: 'success', summary: 'Your age is', detail: this._cart.birthDate() });
    //   }
    // })

    this.studentRegForm.valueChanges
    .subscribe((d:any) => {
      this.checkFormInputs();
    })
  }

  get cn(){
    return this.studentRegForm.controls;
  }

  currentInp(e:any) {
    this.currntSelectedInpIs = e.target.name
     console.log("this input is",e);
   }

  checkFormInputs(){
    let fnm = this.cn['name'].valid;
    console.log("firstname >> ",fnm);

    switch (this._cart.registrationStep) {
      case 1:
        this.isSectionValid = this.cn['name'].valid && this.cn['birthDate'].valid && this.cn['gender'].valid;
        break;
      case 2:
        this.isSectionValid = this.cn['occupation'].valid && this.cn['designation'].valid;
        break;
      case 3:
        this.isSectionValid = this.cn['email'].valid && this.cn['phone'].valid;
        break;
      default:
        break;
    }
  }

  prevStep() {
    this._cart.registrationStep--;
  }
  nextStep() {
    this._cart.registrationStep++;
  }

  processForm() {
    this._cart.registrationStep++;
    this.isSectionValid = false;
    let payload = this.studentRegForm.value;
    if(this._cart.registrationStep > 3) {
      this._auth.regisgter(payload)
      .subscribe({
        next: (user)=>{
          this._ms.add({ severity: 'success', summary: `Hi ${user.name}, Welcome to Shop`, detail: 'Please Signin, for products shopping.' });
          this._router.navigate(['/signin']);
        },
        error: (err)=>{
          this._cart.registrationStep = 1;
          this._ms.add({ severity: 'error', summary: `${err.error.message}` });
        }
      })
      //let ff = toObservable(this._cart.firstName);
      // ff.subscribe
    }
  }

  // processForm(){
  //   let fnm = this.cn['firstName'].valid;
  //   console.log("firstname >> ",fnm);

  //   switch (this._cart.registrationStep) {
  //     case 1:

  //       this.isSectionValid = this.cn['firstName'].valid && this.cn['lastName'].valid;
  //       //if(!this.isSectionValid) return;
  //       //this._cart.registrationStep++;
  //       break;
  //     case 2:
  //       this.isSectionValid = this.cn['standard8th'].valid && this.cn['standard9th'].valid && this.cn['standard10th'].valid;
  //       // if(!this.isSectionValid) return;
  //       // this._cart.registrationStep = 3;
  //       // this._cart.isShoppingPage = true;
  //       break;
  //     default:
  //       break;
  //   }
  //   //
  // }
}
