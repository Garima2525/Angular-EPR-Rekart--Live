import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TargetService {
  base_url: any = 'https://epr.rekart.co.in/epr/target/';

  constructor(private http: HttpClient) {}
  submitForm(data: any) {
    let api_url = this.base_url;
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json;charset=UTF-8',
        apikey: '8GWF6J1-WVG40Q4-HBWGNVY-9VXTXQ8',
      }),
    };
    return this.http.post(api_url, data, httpOptions);
  }
  getalldetailscitywise(city:any) {
    let api_url = this.base_url + 'target_city_wise';
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json;charset=UTF-8',
        apikey: '8GWF6J1-WVG40Q4-HBWGNVY-9VXTXQ8',
      }),
    };

    return this.http.post(api_url,city,httpOptions);
  }

  getalltarget(){
    let api_url=this.base_url+'getalltarget'
    const httpOptions={
      headers:new HttpHeaders({
        'content-type': 'application/json;charset=UTF-8',
        apikey: '8GWF6J1-WVG40Q4-HBWGNVY-9VXTXQ8',
      }),
    }
    return this.http.get(api_url,httpOptions)
  }

  gettargetbyid(id: any){
    let api_url=this.base_url+'gettargetbyid/' + id;
    const httpOptions={
      headers:new HttpHeaders({
        'content-type': 'application/json;charset=UTF-8',
        apikey: '8GWF6J1-WVG40Q4-HBWGNVY-9VXTXQ8',
      }),
    }
    return this.http.get(api_url,httpOptions)
  }

  // targetupdatebyid(id: any) {
  //   let api_url = this.base_url + 'targetupdatebyid/' + id;
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'content-type': 'application/json;charset=UTF-8',
  //       apikey: '8GWF6J1-WVG40Q4-HBWGNVY-9VXTXQ8',
  //     }),
  //   };
  //   return this.http.get(api_url, httpOptions);
  // }

  targetupdatebyid(id:any,data: any) {
    let api_url = this.base_url + 'targetupdatebyid/' + id;
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json;charset=UTF-8',
        apikey: '8GWF6J1-WVG40Q4-HBWGNVY-9VXTXQ8',
      }),
    };
    return this.http.post(api_url, data, httpOptions);
  }



  deletetarget(id: any){
    let api_url=this.base_url+'deletetarget/' + id;
    const httpOptions={
      headers:new HttpHeaders({
        'content-type': 'application/json;charset=UTF-8',
        apikey: '8GWF6J1-WVG40Q4-HBWGNVY-9VXTXQ8',
      }),
    }
    return this.http.get(api_url,httpOptions)
  }
  getRecordBox(data: any) {
    let api_url = this.base_url+ 'targetRecords/';
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json;charset=UTF-8',
        apikey: '8GWF6J1-WVG40Q4-HBWGNVY-9VXTXQ8',
      }),
    };
    return this.http.post(api_url, data, httpOptions);
  }

}
