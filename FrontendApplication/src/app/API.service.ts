import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  constructor(private _http: HttpClient) { }

  //Thay đổi đường dẫn API khi chạy tại local và hosting
  GetOrigin()
  {
    return isDevMode() ? `http://localhost:3000` :`https://xeomonlinebackend.web.app`;
  }

  SignIn(username, password){
    return this._http.get(this.GetOrigin()+"/signin/username/"+username+"/password/"+password);
  }

  SignUp(username, password, name, phone, lisense){
    return this._http.get(this.GetOrigin()+"/signup/username/"+username+"/password/"+password+"/name/"+name+"/phone/"+phone+"/lisense/"+lisense);
  }
}
