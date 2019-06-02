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

  GetDriverInfor(driver)
  {
    return this._http.get(this.GetOrigin()+"/GetDriverInfor/"+driver);
  }

  GetAllDriverPos()
  {
    return this._http.get(this.GetOrigin()+"/GetAllDriverPos");
  }

  PostDriverPos(token,lat, lng)
  {
    //console.log("ac");
    return this._http.get(this.GetOrigin()+"/DriverUploadPosition/token/"+token+"/lat/"+lat+"/lng/"+lng);
  }

  DriverUnready(token)
  {
    return this._http.get(this.GetOrigin()+"/DriverUnready/"+token);
  }

  CreatePassengerRequest(s_lat, s_lng, d_lat, d_lng)
  {
    return this._http.get(this.GetOrigin()+"/PassengerNewRequest/"+s_lat+"/"+s_lng+"/"+d_lat+"/"+d_lng);
  }

  GetPassengerRequestResponse(RequestId)
  {
    return this._http.get(this.GetOrigin()+"/PassengerGetRequest/"+RequestId);
  }

  PassengerDestroyRequest(RequestId)
  {
    return this._http.get(this.GetOrigin()+"/PassengerDestroyRequest/"+RequestId);
  }

  DriverDeniePassengerRequest(token, RequestId)
  {
    return this._http.get(this.GetOrigin()+"/DriverDeniePassengerRequest/"+token+"/"+RequestId);
  }

  DriverListeningToNotification(token)
  {
    return this._http.get(this.GetOrigin()+"/DriverListeningToNotification/"+token);
  }

  DriverGetPassengerRequestInfor(token, RequestId)
  {
    return this._http.get(this.GetOrigin()+"/DriverGetPassengerRequestInfor/"+token+"/"+RequestId);
  }

  DriverAppceptRequestInfor(token, RequestId)
  {
    //console.log(token + "  " + RequestId);
    return this._http.get(this.GetOrigin()+"/DriverAppceptRequestInfor/"+token+"/"+RequestId);
  }

  MissionFinishDriverConfirm(token, RequestId)
  {
    return this._http.get(this.GetOrigin()+"/MissionFinishDriverConfirm/"+token+"/"+RequestId);
  }

  MissionFinishPassengerConfirm(RequestId)
  {
    return this._http.get(this.GetOrigin()+"/MissionFinishPassengerConfirm/"+RequestId);
  }

  DriverGetAllHistory(token)
  {
    return this._http.get(this.GetOrigin()+"/ShowHistory/"+token);
  }
}
