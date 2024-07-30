import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, Input , ViewChild, ViewChildren, ElementRef, QueryList} from '@angular/core';
import {FormControl} from '@angular/forms';
import { filter, map, tap} from 'rxjs/operators';
import { SortPipe } from '../../utility/pipe/sort.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
// import { FakeApiService, pageItems } from 'src/app/data/service/fake-api.service';
import {PaginationInstance, PaginatePipe, PaginationControlsDirective} from 'ngx-pagination';

enum pageItems {'a'=5,'b'=10,'c'=20};

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  imports: [NgxPaginationModule],
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
    //private search_sample_url : string = 'https://jsonplaceholder.typicode.com/posts/1/comments?q=occaecati&_limit=1&_page=1';

  //@Input() columns:any;
  @Input() url:any;
  @Input() sort:any;
  @Input() gridID:any;
  @Input() itemsPerPage:any;
  
  
 // private urlSuffix:string = 'posts/1/comments';
  
  public column_sort_value: any;
  public my_orders_data: any[] = [];
  public postsData: any[] = [];
  public sortedPostsData: any[] = [];
  //public itemsPerPage:number = pageItems.a;
  public itemsPerPageOptions:any[] = [pageItems.a, pageItems.b, pageItems.c];
  //public itemsPerPage:number = 5;
  public selectedItemPerPage:number = 5;
  public totalItemsCount:number=0;
  public currentPage:number=1;
  public config : PaginationInstance = {
        itemsPerPage: 5,
        currentPage: 1,
        totalItems: this.totalItemsCount,
    };
    public searchTerm:any='';
  public params:string = `_limit=${this.config.itemsPerPage}&_page=${this.config.currentPage}&q=${this.searchTerm}`;
 
  public toppings = new FormControl('');
  public columns: string[] = [];
  public columnsShow: any[] = [];
  
  page: number = 1;
  first_record: any;


  constructor(private readonly cdr: ChangeDetectorRef) { }

    @ViewChild('globalSearch') 'globalSearch' : ElementRef;
    @ViewChildren('singleSearch') 'singleSearch' : QueryList<any>;

  ngOnInit(): void {
    this.config.itemsPerPage = this.itemsPerPage;
    this.config.id = this.gridID;
    console.log('sort default > ',this.sort);
    //this.columnsShow = this.columns;
    //this.paginatePipe.transform()
    //console.log("itemsPerPageOptions > ",this.itemsPerPageOptions);

    this.cdr.detectChanges();
    // this._fakeS.getComments(this.url,this.params).subscribe((data:any)=> {
    //     if(data instanceof HttpResponse) {
    //         //console.log("data > ",data);
    //         this.postsData = data.body;
    //         this.sortDefault(this.postsData,this.sort);
    //         this.columnsShow = Object.keys(this.postsData[0]);
    //         this.columns = this.columnsShow;
    //     }
    // });

    this.getTotalCount();
    console.log('getTotalCount',this.config.totalItems,this.totalItemsCount);
    console.log("this.postsData > ",this.postsData);
  }




  getTotalCount(searchTerm?:any){
    let params = `q=${searchTerm}`;
    // return this._fakeS.getComments(this.url,(searchTerm != undefined)?params:'')
    // .subscribe((s:any)=>{
    //   this.totalItemsCount = s.body.length;
    //   this.config.totalItems = this.totalItemsCount;
    //   console.log('getTotalCount-----',this.config.totalItems,this.totalItemsCount);
    // })
  }

  samp(){
    return "llop";
  }

  updateColumnsShow(data:any) {
    this.columnsShow = data.value;
  }

  search(searchTerm:any, columnName?:string) {
    console.log('search column , columnName > ',searchTerm.value, columnName);
    
    this.searchTerm = searchTerm.value;
    this.config.currentPage = 1;
    if(columnName != undefined) {
        this.params = `_limit=${this.config.itemsPerPage}&_page=${this.config.currentPage}&column=${columnName}&q=${this.searchTerm}`;
    } else {
        this.params = `_limit=${this.config.itemsPerPage}&_page=${this.config.currentPage}&q=${this.searchTerm}`;
    }

    // this._fakeS.getComments(this.url,this.params).subscribe((data:any)=> {
    //   if(data instanceof HttpResponse) {
    //     this.postsData = data.body;
    //     this.sortDefault(this.postsData);
    //   }
    // });

  if(columnName == undefined){
    this.singleSearch.map((a:any,ind:number)=>{
      (a.nativeElement.name != columnName)?a.nativeElement.value='':'';
      console.log("a",a);
    });
  } else {
    this.globalSearch.nativeElement.value = '';
    this.singleSearch.map((a:any,ind:number)=>{
      (a.nativeElement.name != columnName)?a.nativeElement.value='':'';
      console.log("a",a);
    });
  }
  
  this.getTotalCount(this.searchTerm);
  //console.log('getTotalCount',this.totalItemsCount);
  this.cdr.detectChanges();
  }

  // searchGlobal(searchTerm:any) {
  //   console.log('searchGlobal > ',searchTerm.value);

  //   this.searchTerm = searchTerm.value;
  //   this.config.currentPage = 1;
  //   this.params = `_limit=${this.config.itemsPerPage}&_page=${this.config.currentPage}&q=${this.searchTerm}`;
    
  //   this._fakeS.getComments(this.url,this.params).subscribe((data:any)=> {
  //       if(data instanceof HttpResponse) {
  //           this.sortDefault(data.body);
  //       }
  //   });
  //   this.singleSearch.map((a:any,ind:number)=>a.nativeElement.value='')
  //   this.getTotalCount(this.searchTerm);
  //   console.log('getTotalCount',this.totalItemsCount);
  //   this.cdr.detectChanges();
  // }

  renderPageFirst(){
    this.config.currentPage = 1;
  }

  onPageItemsCountChange() {
    this.config.itemsPerPage;
    this.onPageChange(this.config.currentPage);
  }

  onPageChange(pageNumber: number) {
    this.config.currentPage = pageNumber;
    console.log("pageNumber > ",pageNumber);
    this.params = `_limit=${this.config.itemsPerPage}&_page=${this.config.currentPage}&q=${this.searchTerm}`;
    // this._fakeS
    // .getComments(this.url,this.params).subscribe((data:any) => {
    //     if(data instanceof HttpResponse) {
    //       this.postsData = data.body;
    //       this.sortDefault(this.postsData);
    //     }
    //   }
    // );
   }
   onPageBoundsCorrection(number: number) {
    this.config.currentPage = number;
    }



  sortTable(column: string, $event:any) {
    const filterPipe = new SortPipe();
    this.column_sort_value = $event.target.attributes['data_sort'].value;
    var sort_column_as='';
    if (this.column_sort_value == 'asc') {
        sort_column_as = 'desc';
        $event.target.attributes['data_sort'].value = 'desc';
    } else {
        sort_column_as = 'asc';
        $event.target.attributes['data_sort'].value = 'asc';
    }

    this.sort = {dir:sort_column_as, column: column};

    this.sortDefault(this.postsData,{dir:sort_column_as,column:column});
    console.log('column_sort_value: ', this.column_sort_value);
    }

    sortDefault(data:any, sort?:any){
      (sort==undefined)? sort = {dir:'desc', column: 'id'} : sort;
      const filterPipe = new SortPipe();
      setTimeout(() => {
        this.sortedPostsData = filterPipe.transform(data,sort.dir,sort.column);
      }, 400);
    }

}
