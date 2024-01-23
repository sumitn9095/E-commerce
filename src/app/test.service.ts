import { Injectable,  WritableSignal, Signal, signal, computed} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  public mssg: WritableSignal<any>= signal('');
  public mssg2: WritableSignal<any>= signal('');


  public books: WritableSignal<any[]> = signal([])

  public mssgUpdated : Signal<any> = computed( () => this.mssg + 'is computed')
  
  // const color = computed(() => isAdult() ? ‘green’ : ‘red’);

  constructor() { }

  setMessg = (val:any) => {
    this.mssg.update(s => s+val)
  }
  readMssg = () => {
    return this.mssg()
  }
  mssgComputed = () => {
    return this.mssgUpdated()
  }
  //---------
  setMessg2 = (val:any) => {
    this.mssg2.set(val)
  }
  readMssg2 = () => {
    return this.mssg2()
  }
  //---------
  addBooks=(obj:any)=>{
    console.log("obj to add",obj)
    this.books.update( (s:any) => [...s, obj])
  }

  getBooks=()=>{
    return this.books()
  }
  

}
