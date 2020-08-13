import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _BASE_URL: string = "http://128.199.32.64:8080/api"
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) { }

  postEd(data){
    return this.http.get(`${this._BASE_URL}/stanja/${data.ed_broj}`);
  }

  patchData(data){
    return this.http.patch(`${this._BASE_URL}/stanja/update`, data, {responseType: 'text'});
  }

}
