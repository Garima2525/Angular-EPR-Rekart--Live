import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GoalService {
  base_url:any=" http://localhost:3159/epr/target/"
  constructor(private http:HttpClient) { }
  getalltarget(){
    let api_url=this.base_url+'getalltarget'
    const httpOptions={
      headers:new HttpHeaders({
        'content-type': 'application/json;charset=UTF-8',
        apikey: 'HXTYAEM-TRAMG09-QAEQNQ0-51S6B04',
      }),
    }
    return this.http.get(api_url,httpOptions)
  }
}

