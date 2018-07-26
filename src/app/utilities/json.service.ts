import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import { Observable , of} from 'rxjs';
import { Util } from './util';
import { map} from 'rxjs/operators';

@Injectable()
export class JsonService {
  
  
  initService( data: any,Url:string): Observable<any> {
    
    return this.http.post(
      Url,
      JSON.stringify(data),
      {withCredentials:Util.Env() }
    ).pipe(map((res:Response) => res));

  }

  

  constructor(private http: HttpClient) { }
  

}
@Injectable()
export class HtmlService {
  
  
  initService( Url:string): Observable<any> {
    
    return this.http.get(
      Url,
      {responseType:'text'}
    );

  }

  

  constructor(private http: HttpClient) { }
  

}
