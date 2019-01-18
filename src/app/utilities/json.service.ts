import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Util } from './util';
import { map} from 'rxjs/operators';

@Injectable()
export class JsonService {
  
  
  initService( data: any,Url:string): Observable<any> {
    
    return this.http.post(
      Url,
      JSON.stringify(data).replace(/%/g, '%25'),
      {withCredentials:Util.Env() }
    ).pipe(map((res:Response) => res));

  }

  

  constructor(private http: HttpClient) { }
  

}
@Injectable()
export class HtmlService {
  
  
  initService( Url:string): Observable<any> {
    
    return this.http.get(
      Url+'?ts='+Util.makeid(),
      {responseType:'text'}
    );

  }

  

  constructor(private http: HttpClient) { }
  

}
