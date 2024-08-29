import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SidecartComponent } from '../../components/sidecart/sidecart.component';
import { CartService } from '../../utility/cart.service';
import { CourseService } from '../../utility/course.service';

import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AsyncPipe } from '@angular/common';
import { ShoppingListRxjsComponent } from '../../components/shopping-list-rxjs/shopping-list-rxjs.component';
import { RouterOutlet } from '@angular/router';
import { ShoppingListDbComponent } from '../../components/shopping-list-db/shopping-list-db.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LatestProduct } from '../../utility/latest-product';
import { ShopService } from '../../utility/shop.service';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { ShoppingFiltersComponent } from '../../components/shopping-filters/shopping-filters.component';
import { ShoppingListComponent } from '../../components/shopping-list/shopping-list.component';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { environment } from '../../../../environments/environment';
import { CarouselModule } from 'primeng/carousel';
import { saveAs } from 'file-saver';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-shopping-with-db',
  standalone: true,
  imports: [
    RouterOutlet, HeaderComponent, ShoppingListRxjsComponent, FormsModule, ReactiveFormsModule, SidecartComponent, ToastModule, AsyncPipe, ShoppingListDbComponent,
    FormsModule, ShoppingListComponent, ReactiveFormsModule,ButtonModule, PanelModule, TableModule, SkeletonModule, AutoCompleteModule, InputTextModule, ProgressSpinnerModule,  InputGroupAddonModule, InputGroupModule, ShoppingFiltersComponent, DialogModule, CalendarModule,FloatLabelModule, CarouselModule, FileUploadModule],
  providers: [MessageService],
  templateUrl: './shopping-with-db.component.html',
  styleUrl: './shopping-with-db.component.scss'
})
export class ShoppingWithDbComponent implements OnInit {
  _cart = inject(CartService);
  _cs = inject(CourseService);
  _ms = inject(MessageService);
  _shop = inject(ShopService);
  _fb = inject(FormBuilder);

  env = environment.base_url;
  user:any={};

  uploadedFiles:any[]=[]

  cartSpecs:WritableSignal<any> = signal<any>([]);
  orderId:any= '';
  shouldOpenSideCart = signal<boolean>(false);

  categoryListDefined:any=[];
  categoryList:any=[];
  selectedCategory:any;
  maxProductPrice:number=0;

  rangeDates: Date[] | undefined;

  public buyProductsForm!: FormGroup;
  public products:WritableSignal<any>  = signal({});
  public selectedProducts: any;
  public selectedMultipleProducts: any;
  public selectedProductsDetails: any = {};
  public stockOptions:any=[]

  addEditProductForm!: FormGroup;
  showAddEditPoductModal:boolean=false;
  productToBeEdited:any={}
  productToBeEdited_md_date:Date=new Date();
  productToBeEdited_ed_date:Date=new Date();

  shouldAddNewProduct:boolean=false;

  public latestProductAdded:LatestProduct = {
    type:'',
    product:{
      id:0,
      no:0,
      equipment:'',
      brand:'',
      price:0
    }
  }

  progressAddEditFormUploadImgs:number=0
  productImgToBeUploaded : any;
  
  constructor(){
    if(typeof window !== "undefined") this.user = JSON.parse(sessionStorage.getItem("shop_user_details") as any);
    console.log("selectedCategory",this.selectedCategory)
  }
    
  ngOnInit(): void {
    this.fetch_products();
    this.fetch_cart();
    this.getCategoryList();
    this.getMaxProductPrice();
    this.addEditProductForm = this._fb.group({
      name:['',[Validators.required]],
      category:['',Validators.required],
      price:[0,Validators.required],
      instock:[true,Validators.required],
      img:['',[]],
      ed:[new Date(),Validators.required],
      md:[new Date(),Validators.required]
    })
  }

  notifyProductAdded() {
    let productAdded = {
      type: 'multiple',
      product: this.selectedProducts
    }
    //this._ms.add({ key: 'addProduct', severity: 'success', summary: 'Can you send me the report?' });
    let allProductNames = this.selectedProducts.map((r:any) => r.name);
    let allCategorys = this.selectedProducts.map((r:any) => r.category);
    let allCost = this.selectedProducts.map((r:any) => r.price);
    let totalPrice = this.selectedProducts.reduce((acc:any, item:any)=>parseInt(acc+item.price),0);

    this.selectedProductsDetails.productNames = [];
    this.selectedProductsDetails.categorys = [];
    this.selectedProductsDetails.cost = [];
    this.selectedProductsDetails.totalPrice = totalPrice;

    console.log("this.selectedProductsDetails",this.selectedProductsDetails)
    this.selectedProductsDetails.productNames.push(allProductNames);
    this.selectedProductsDetails.categorys.push(allCategorys);
    this.selectedProductsDetails.cost.push(allCost);

     this._ms.add({ key: 'addProduct', severity: 'success', data:this.selectedProductsDetails, summary: 'Can you send me the report?' });
  }
  
  getselectedProducts(){
    console.log("selected Products are",this.selectedProducts)
  }

  // - ADMIN (action)
  editProduct(product:any){
    this.productToBeEdited=product;
    this.productToBeEdited_md_date = new Date(this.productToBeEdited.md);
    this.productToBeEdited_ed_date = new Date(this.productToBeEdited.ed);
    console.log("product",product)
  }

  addNewProduct(){
    this.productToBeEdited = null;
    this.showAddEditPoductModal = true;
    this.productToBeEdited_md_date = new Date();
    this.productToBeEdited_ed_date = new Date();
    this.productImgToBeUploaded = [];
    this.progressAddEditFormUploadImgs=0;
  }

  handleProductImg(e :any) {
    //var newFile = new File([e.target.files[0]], "taskPhoto", {type: ".png"});
    this.productImgToBeUploaded = e.target.files;
    // for(let file of e.target.files) {
    //     this.uploadedFiles.push(file);
    // }
  }
  handleProductImgFileupload(e :any) {
   // this.productImgToBeUploaded = e.target.files;
    console.log("this.productImgToBeUploaded",e);
    for(let file of e.files) {
        this.uploadedFiles.push(file);
    }
  }

  onSend(e:any){
    console.log("onSend",e);
  }

  onSelect(e:any){
     console.log("onSend",e);
  }

  uploadHandler(e:any){
     console.log("uploadHandler",e);
  }

  // - ADMIN (action)
  processAddEditProductForm(){
    if(this.addEditProductForm.status === 'INVALID') return;
    this.addEditProductForm.value.instock = this.addEditProductForm.value.instock.value !== undefined ? this.addEditProductForm.value.instock.value : true;
    //console.log("this.addEditProductForm.value",this.addEditProductForm.value, this.addEditProductForm.status);
    let obj;
    if(this.shouldAddNewProduct){
      obj = {
        payload:this.addEditProductForm.value,
        files:this.productImgToBeUploaded,
        shouldAddNewProduct:true,
      }
    } else {
      obj = {
        payload:this.addEditProductForm.value,
        files:this.productImgToBeUploaded,
        shouldAddNewProduct:false,
        id:this.productToBeEdited.id
      }
    }

    this._shop.addEditProduct(obj).subscribe({
      next: (event:any)=>{
        if (event.type == HttpEventType.Sent) {
          console.log("upload started - ")
          this.progressAddEditFormUploadImgs = 0;
        } else if(event.type == HttpEventType.UploadProgress) {
          this.progressAddEditFormUploadImgs = (100 * event.loaded) / event.total;
          console.log("upload progress - ",this.progressAddEditFormUploadImgs);
        } else if(event instanceof HttpResponse) {
          this.progressAddEditFormUploadImgs = 100;
          console.log("upload completed - ",event.body);
          this.fetch_products()
        }
      },
      error: (err:Error)=>console.error(err)
    })
  }


  removeProduct(productId:number){
    this._shop.removeProduct(productId).subscribe({
      next: (p)=>{
        this.fetch_products()
      },
      error: (err:Error)=>console.error(err)
    })
  }


  // - ADMIN (action)
  removeProductImg(productId:number,productImg:string) {
    let obj = {productId,productImg}
    this._shop.removeProductImg(obj).subscribe({
      next: (p)=>{
        let remainingProductImgs:string[] = this.productToBeEdited?.imagePath.filter((i:string) => i !== productImg);
        this.productToBeEdited.imagePath = [...remainingProductImgs]
      },
      error: (err:Error)=>console.error(err)
    })
  }


  processDownloadProductPDF(){
    this._shop.downloadPDF('downloadPDF').subscribe({
      next: (event:any) => {

      //  console.log("event",event)
      // // const jsonString = JSON.stringify(event);
      //  let blob = new Blob([event.body], {type: "application/pdf"})
      //   saveAs(blob,`products3.pdf`);

        if (event.type == HttpEventType.Sent) {
          console.log("upload started - ")
        } else if(event.type == HttpEventType.DownloadProgress) {
          let progress = (100 * event.loaded) / event.total;
          console.log("upload progress - ", progress);
        } else if(event instanceof HttpResponse) {
          console.log("upload completed - ",event.body);
          // let binaryData = [];
          //   binaryData.push(event.body);
          // let llop = new Uint8Array(event.body, 0, event.body.byteLength)
          //  let kkj = event.body['[Uint8Array]'];
          let buffer:BlobPart[] = [event.body];

          //var uint8View = new Uint8Array([event.body]);
          
          /////let blob = new Blob(buffer, { type: "application/octet-stream" });
          //var file = new File([event.body], "MyTasks", {type: 'application/pdf'});
          var file = new File([event.body], "", {type: 'text/plain'});
          // const blob = new Blob([event.body], {
          //   type: 'application/pdf',
          // });
          console.log("processDownloadProductPDF-blob",file)

          saveAs(file,"Products.txt");
          //const blob = new Blob([response.data], {type: 'application/pdf'})
          // const link = document.createElement('a')
          // link.href = window.URL.createObjectURL(blob)
          // link.download = `your-file-name.pdf`
          // link.click()

        }
      },
      error: (err:Error)=>console.error(err)
    })
  }

  processDownloadProductExcel(){
    this._shop.downloadPDF('downloadProductExcel').subscribe({
      next: (event:any) => {
        if (event.type == HttpEventType.Sent) {
          console.log("upload started - ")
        } else if(event.type == HttpEventType.DownloadProgress) {
          let progress = (100 * event.loaded) / event.total;
          console.log("download progress - ", progress);
        } else if(event instanceof HttpResponse) {
          console.log("upload completed - ",event.body);
          var file = new File([event.body], "MyTasks", {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          saveAs(file);
        }
      },
      error: (err:Error)=>console.error(err)
    })
  }

  // - USER (action)
  // - Add single product
  addProduct(product:any){
    console.log("product added",product);
    this.addInCartCore(this._cart.cart(), product);
    let productAdded = {
      type: 'single',
      product: product
    };
    this._ms.add({ key: 'addProduct', severity: 'success', data:productAdded, summary: 'Can you send me the report?' });
  }

  filterMethodCategory(event:any) {
    console.log("event.query",event);
    let cl = [];
    cl = this.categoryListDefined.categories;
    //.log("cl",cl)
    this.categoryList = ['All',...cl];
  }


  selectDate(data:any){
    console.log(data)
  }

  // - USER (action)
  // - Add multiple products
  addToCart = () => {
    console.log("selected-products",this.selectedProducts)
    this.selectedProducts.map((g:any, i:number) => {
      let islast:boolean=false;
      //console.log("this.selectedProducts.length",this.selectedProducts.length, i)
      if(this.selectedProducts.length == i+1) islast=true;
      this.addInCartCore(this._cart.cart(), g, islast,true);
    });
    this.selectedMultipleProducts = [...this.selectedProducts]
    this.notifyProductAdded();
  }

  // - USER (action)
  // Process added products
  addInCartCore = (cart:any, product:any, isLast?:boolean, multipleProductsAdd?:boolean) => {
    console.log("multipleProductsAdd",multipleProductsAdd);
    //console.log("selected-products",this.selectedProducts)
    let isProductAlreadyInCart = cart.some((c:any)=> c.id === product.id);
    //var cart_temp : Array<any> = cart;
    let product_qty_added = 1;
    if (!isProductAlreadyInCart) {
      // -- Product NOT Already in Cart. Product added is NEW
      //console.log("not matching")
      product.qty = 1;
      //cart_temp.push(product);
      this._cart.cart.update(prev => [...prev,product])
      this.cartSpecs.update(prev => [...prev,product])
    } else {
      // -- Product Already in Cart.
      this._cart.cart.update(prev => prev.map((c:any) => {
        if(c.id === product.id) {
          product_qty_added = c.qty + 1;
          // -- Update the product's quantity in Cart Signal.
          c.qty = product_qty_added;
          console.log("product-already-in-cart",product);
        }
        return c
      }));
    }
    if(multipleProductsAdd && isLast) this.updateCartInSidecart();
    else if(!multipleProductsAdd) this.updateCartInSidecart();
    // -- Update the product's quantity in MongoDB document
    this._shop.addProductToOrderedProducts(product.id, product_qty_added).subscribe({
      next: (product2)=>{
        console.log("product added",product);
        this.selectedProducts= [];
      },
      error: (err)=>{throw new Error(err)}
    })
  }

    // - USER (action)
  // - Signgle Request | Add multiple products
  singleReq_addProducts = () => {
    console.log("selected-products",this.selectedProducts)
    this.selectedProducts.map((g:any, i:number) => {
      let islast:boolean=false;
      if(this.selectedProducts.length == i+1) islast=true;
      this.singleReq_processAddProducts(this._cart.cart(), g, islast,true);
    });
    this.selectedMultipleProducts = [...this.selectedProducts]
    this.notifyProductAdded();
  }

  // - USER (action)
  // Signgle Request | Process added products
  singleReq_processAddProducts = (cart:any, product:any, isLast?:boolean, multipleProductsAdd?:boolean) => {
    let productsToAdd_notInCart:any = []
    let productsToAdd_alreadyInCart:any = []
    console.log("multipleProductsAdd",multipleProductsAdd);
    //console.log("selected-products",this.selectedProducts)
    let isProductAlreadyInCart = cart.some((c:any)=> c.id === product.id);
    //var cart_temp : Array<any> = cart;
    let product_qty_added = 1;
    if (!isProductAlreadyInCart) {
      // -- Product NOT Already in Cart. Product added is NEW
      //console.log("not matching")
      product.qty = 1;
      //cart_temp.push(product);
      this._cart.cart.update(prev => [...prev,product])
      this.cartSpecs.update(prev => [...prev,product])
      productsToAdd_notInCart.push(product)
    } else {
      // -- Product Already in Cart.
      this._cart.cart.update(prev => prev.map((c:any) => {
        if(c.id === product.id) {
          product_qty_added = c.qty + 1;
          // -- Update the product's quantity in Cart Signal.
          c.qty = product_qty_added;
          console.log("product-already-in-cart",product);
          productsToAdd_alreadyInCart.push(c)
        }
        return c
      }));
    }
    if(multipleProductsAdd && isLast) this.updateCartInSidecart();
    else if(!multipleProductsAdd) this.updateCartInSidecart();
    // -- Update the product's quantity in MongoDB document

    if(isLast){
      console.log("productsToAdd",productsToAdd_alreadyInCart,productsToAdd_notInCart)
      // this._shop.addProductToOrderedProducts(product.id, product_qty_added).subscribe({
      //   next: (product2)=>{
      //     console.log("product added",product);
      //     this.selectedProducts= [];
      //   },
      //   error: (err)=>{throw new Error(err)}
      // })
    }
  }

  // - USER (action)
  updateCartInSidecart(){
    // Just by updating "_cart.cart" signal, doesnt update thee 'sidecart.
    // 
    let cart_temp:any = [];
    cart_temp = this._cart.cart();
    this._cart.cart.set([]);
      setTimeout(() => {
          this._cart.cart.update(() => [...cart_temp]);
          this.cartSpecs.update(() => [...cart_temp]);
      },100)
  }

  // UNIVERSAL (action)
  // Fetching Products from Display
  fetch_products() {
    this._shop.fetchAllProducts().subscribe({
      next:(products)=>{
        if(products instanceof HttpResponse){
            this.products.update(()=>products.body)
            console.log("this.products",this.products());
        }
      },
      error:(err)=>{
        let error = new Error(err);
      },
      complete:()=>{}
    })
  }

  // USER (action)
  // Filtering Products in Cart
  filter_cart(payload:{}){
    var cart_products:any[] = [];
     this._shop.fetch_orderedProducts(payload).subscribe({
      next:(response)=>{
          response.order.cart.map((order:any) => {
            if(order.products !== undefined) cart_products.push({...order.products, qty: order.qty});
          })
          this._cart.cart.update(()=>[...cart_products]);
          //console.log("this._cart.cart",this._cart.cart());
      },
      error:(err)=>{
        let error = new Error(err);
      }
    })
  }

  // - USER (action)
  // Fetching Products from Cart
  fetch_cart(){
    // Fetch ------------ Order ID ----------------------
    this._shop.fetch_orderId().subscribe({
      next:(response)=>{
        console.log("order >>",response.orderDetails);
        if(typeof response.orderDetails === 'object' && response.orderDetails.length) {
          this.orderId = sessionStorage.getItem("shop_orderId")?.toString();
          sessionStorage.setItem("shop_orderId",response.orderDetails[0].orderId);
        } else {
          let orderId = Math.random()*38747388948737;
          this.orderId = orderId.toString();
          sessionStorage.setItem("shop_orderId",orderId.toString());
          this._shop.orderInit(orderId).subscribe({
            next:(orderDetails)=>{
              //------
            },
            error:(err)=>{
              let error = new Error(err);
            },
          })
        }
      },
      error:(err)=>{
        let error = new Error(err);
      },
      complete:()=>{}
    })

    // Fetch ------------ Order ID ----------------------
    let cart_products:any[]=[];
    this._shop.fetch_orderedProducts(false).subscribe({
      next:(response)=>{
            response.order.cart.map((order:any)=>{
              //let obj = {id:product.id, email:product.email,...product.products}
              cart_products.push({...order.products, qty: order.qty});
              //products.push(product);
            })
            this._cart.cart.update(()=>[...cart_products]);
            this.cartSpecs.update(()=>[...cart_products])
            console.log("this._cart.cart",this._cart.cart());
      },
      error:(err)=>{
        let error = new Error(err);
      }
    })
  }

  // UNIVERSAL (action)
  // Filtering Products on display
  filterProducts(payload:{}) {
    this._shop.filterProducts(payload)
    .subscribe({
      next: (products)=>{
        if(products instanceof HttpResponse) {
          this.products.update(() => products.body);
        }
      },
      error: (err)=>{
        console.log("Error",err);
      }
    })
  }

  // UNIVERSAL (action)
  getCategoryList(){
    this._shop.getCategoryList().subscribe({
      next:(categories)=>{
        if(categories instanceof HttpResponse){
          this.categoryListDefined = categories.body;
        }
      },
      error:(err)=>{
        let error = new Error(err);
      },
      complete:()=>{}
    })
  }

  // UNIVERSAL (action)
  getMaxProductPrice(){
    this._shop.getMaxProductPrice().subscribe({
      next: (maxProduct:any) => {
        if(maxProduct instanceof HttpResponse) {
          let maxProductPrice = maxProduct.body;
          this.maxProductPrice = maxProductPrice.product[0].price;
          console.log("maxProductPrice",maxProductPrice);
          //this.rangeValues = [0,maxProductPrice.product[0].price]
        }
      },
      error: (err:Error)=>{
        //ssssssss
      }
    })
  }
}
