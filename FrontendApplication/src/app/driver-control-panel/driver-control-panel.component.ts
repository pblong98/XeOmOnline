import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import {APIService} from '../API.service';
import { CookieService } from 'ngx-cookie-service';
//import { delay } from 'q';

@Component({
  selector: 'app-driver-control-panel',
  templateUrl: './driver-control-panel.component.html',
  styleUrls: ['./driver-control-panel.component.css']
})
export class DriverControlPanelComponent implements OnInit {

  constructor(private AppComponent:AppComponent, private APIService:APIService, private CookieService:CookieService) { }

  ngOnInit() {
  }

  ButtonContent:string = "Bắt đầu nhận khách";
  IsReady = false;
  ClassButton:string = "btn btn-warning";

  isShowMess = false;
  mess = "";
  messstyle = "text-infor";

  flat = "";
  flng = "";
  tlat = "";
  tlng = "";
  money = "";
  distance = "";
  requestTittle = "Bạn nhận được yêu cầu mới: ";
  isShoInfor = false;
  isShowFinishBtn = false;
  isFinish = false;
  CurrentReuestId = null;

  delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    });
  }

  ReadyForMission()
  { 
    if(!this.IsReady)
    {
      this.ButtonContent = "Hủy";
      this.ClassButton = "btn btn-danger";
      this.isShowMess = true;
      this.mess = "Vui lòng chờ...";
      this.IsReady = !this.IsReady;
      this.APIService.PostDriverPos(this.CookieService.get('token'),AppComponent.ThisApp.current_latitude, AppComponent.ThisApp.current_longitude).subscribe(data=>{
        if(data == true)
        {
          this.DriverListeningToNotification();
        }
      });
    }
    else
    {
      this.APIService.DriverUnready(this.CookieService.get("token")).subscribe(()=>{});
      this.HideRequestInfor();
    }
  }

  DriverListeningToNotification()
  {
    this.APIService.DriverListeningToNotification(this.CookieService.get('token')).subscribe(_data=>{
      //console.log(data);
      var data:any = _data;
      if(data.data == "")
      {
        this.delay(1000).then(()=>{
          this.DriverListeningToNotification();
        })
      }
      else
      {
        if(data.data != null)
        {
          console.log(data.data);
          this.ShowRequestInfor(data.data);
        }
         
      }
    });
  }

  ShowRequestInfor(requestId)
  {
    this.CurrentReuestId = requestId;
    this.APIService.DriverGetPassengerRequestInfor(this.CookieService.get('token'), requestId).subscribe(_data=>{
      var _:any = _data;
      var data =_.data;
      this.isShowMess = false;
      this.isShoInfor = true;
      this.flat = data.start.lat.substring(0,6);
      this.flng = data.start.lng.substring(0,6);
      this.tlat = data.dest.lat.substring(0,6);
      this.tlng = data.dest.lng.substring(0,6);
      this.requestTittle = "Bạn nhận được yêu cầu mới: ";
      this.distance = data.Distance.toString().substring(0,6) + " KM";
      this.money = data.Price.toString().substring(0,data.Price.toString().indexOf('.')) + " VNĐ";
      AppComponent.ThisApp.SetStartLocation(Number(data.start.lat), Number(data.start.lng));
      AppComponent.ThisApp.SetDestLocation(Number(data.dest.lat), Number(data.dest.lng));
      AppComponent.ThisApp.MoveViewToCenterOf3Point();
      //console.log(data);
    });
  }

  HideRequestInfor()
  {
    this.CurrentReuestId = null;
    this.isShoInfor = false;
    this.flat = "";
    this.flng = "";
    this.tlat = "";
    this.tlng = "";
    this.distance = "";
    this.money = "";
    this.ButtonContent = "Bắt đầu nhận khách";
    this.ClassButton = "btn btn-warning";
    this.isShowMess = false;
    this.mess = "";
    this.IsReady = false;
    this.isShowFinishBtn = false;
  }

  DriverUnready()
  {
    this.HideRequestInfor();
    this.APIService.DriverUnready(this.CookieService.get("token")).subscribe(()=>{});
  }

  DriverDenieRequest()
  {
    this.APIService.DriverDeniePassengerRequest(this.CookieService.get('token'), this.CurrentReuestId).subscribe(_data=>{
      this.DriverUnready();
    });
  }

  AppceptMission()
  {
    this.APIService.DriverAppceptRequestInfor(this.CookieService.get("token"),this.CurrentReuestId).subscribe(()=>{
      this.isShowFinishBtn = true;
      this.requestTittle = "Bạn đã chấp nhận yêu cầu này, khi xong nhiệm vụ, hãy ấn nút xác nhận phía dưới !";
      this.DriverListenMisionState();
    });
  }

  DriverListenMisionState()
  {
    this.APIService.GetPassengerRequestResponse(this.CurrentReuestId).subscribe(data =>{
      //console.log(_data);
      var _data:any = data;
      if(_data == null && !this.isFinish)
      {
        this.requestTittle = "Khách hàng đã hủy chuyến xe này !";
        this.HideRequestInfor();
        alert("Khách hàng đã hủy chuyến xe này !");
        return;
      }
      else
      {
        if(_data.DriverFinishConfirm == "1" && _data.PassengerFinishConfirm == "1")
        {
          alert("Khách hàng đã xác nhận, chuyến đi kết thúc !");
          this.HideRequestInfor();
          this.isFinish = false;
          AppComponent.ThisApp.HideStartAndDestPoint();
        }
        else
        {
          this.delay(1000).then(()=>{
            this.DriverListenMisionState();
          });
        }
        return;
      }
    })
  }

  MissionFinishDriverConfirm()
  {
    this.APIService.MissionFinishDriverConfirm(this.CookieService.get("token"),this.CurrentReuestId).subscribe(()=>{
      //this.DriverUnready();
      this.isShoInfor = false;
      this.mess = "Bạn đã xác nhận hoàn tất chuyến đi, hãy đợi lượt của khách hàng...";
      this.isShowMess = true;
      this.isFinish = true;
    });
  }

}
