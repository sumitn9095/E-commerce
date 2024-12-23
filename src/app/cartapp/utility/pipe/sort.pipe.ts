import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: any[], order:any = '', column: string = ''): any[] {
    if (!value || order === '' || !order) { return value; } // no array
    if (value.length <= 1) { return value; } // array with only one item
    if (!column || column === '') { 
      if(order==='asc'){return value.sort();}
      else if(order==='desc'){return value.sort().reverse();}
      else{return value.sort().reverse();}
    } // sort 1d array
    console.log("table values > ",value);
    return orderBy(value, [column], [order]);
  }
}