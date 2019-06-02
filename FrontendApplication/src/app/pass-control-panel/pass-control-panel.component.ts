import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';
import {APIService} from '../API.service';
import { from } from 'rxjs';
import { delay } from 'q';

@Component({
  selector: 'app-pass-control-panel',
  templateUrl: './pass-control-panel.component.html',
  styleUrls: ['./pass-control-panel.component.css']
})
export class PassControlPanelComponent implements OnInit {

  constructor(private APIService:APIService) { }

  ngOnInit() {
  }

  public ButtonContent = "Tìm xe ôm";
  public ButtonClass = "btn btn-info";
  public IsActive = false;
  public RequesId = "";

  public Driver_Avatar = "";
  public Driver_LisensePlate = "";
  public Driver_Name = "";
  public Driver_Phone = "";
  public IsShowDriverInfor = false;
  public ConfirmBtn = false;
  public DriverStatusContent = "Đợi tài xế xác nhận...";
  public IsFinish = false;

  CreatePassengerRequest()
  {
    this.IsActive = !this.IsActive;
    var app = AppComponent.ThisApp;
    
    if(this.IsActive == true)
    {
      //console.log(this.IsActive);
      this.APIService.CreatePassengerRequest(app.from_latitude, app.from_longitude, app.to_latitude, app.to_longitude).subscribe(_data =>{
        var data:any = _data;
        if(data != null)
        {
          this.RequesId = data.RequestKey;
          this.ListeningResquestResponse(data.RequestKey);
          //console.log(data);
        }
      });
    }
    if(!this.IsActive && this.RequesId != "")
    {
      this.PassengerDestroyRequest();
    }
  }

  PassengerDestroyRequest()
  {
    this.APIService.PassengerDestroyRequest(this.RequesId).subscribe(data =>{
      this.RequesId = "";
      this.HideDriverInfor();
    });
  }

  ListeningResquestResponse(RequestId)
  {
    //console.log(this.RequesId +"   "+this.IsActive);
    this.APIService.GetPassengerRequestResponse(RequestId).subscribe(_data =>{
      var data:any = _data;
      //console.log(data);
      if(data!=null && this.IsActive)
      {
        this.ButtonContent = "Hủy...";
        this.ButtonClass = "btn btn-danger";
        if(data.Driver != "null")
        {
          this.GetDriverInfor(data.Driver);
        }
        else
        {
          //console.log(data);
          this.delay(1000)
          .then(() => {
            this.ListeningResquestResponse(RequestId);
          });  
        }
      }
    });
  }

  ListeningDriverResponse(RequestId)
  {
    if(!this.IsFinish)
    {
      this.APIService.GetPassengerRequestResponse(RequestId).subscribe(_data =>{
        var data:any = _data;
        if(data!=null)
        {
          if(data.Driver == "null")
          {
            this.DriverStatusContent = "Tài xế đã hủy chuyến";
            this.APIService.PassengerDestroyRequest(RequestId);
            this.delay(1000)
            .then(() => {
              this.HideDriverInfor();
            });  
          }
          else
          {
            if(data.DriverStatus == 1)
            {
              this.ConfirmBtn = true;
              this.DriverStatusContent = "Tài xế đang tới đón bạn...";
              this.delay(1000)
              .then(() => {
                this.ListeningDriverResponse(RequestId);
              });  
            }
            else
            {
              this.delay(1000)
              .then(() => {
                this.ListeningDriverResponse(RequestId);
              });  
            }
          }
        }
        else
        {
          this.DriverStatusContent = "Tài xế đã hủy chuyến";
          this.APIService.PassengerDestroyRequest(RequestId);
          this.delay(1000)
            .then(() => {
              this.HideDriverInfor();
            });  
        }
      });
    }
    
  }

  GetDriverInfor(driver)
  {
    this.APIService.GetDriverInfor(driver).subscribe((_data)=>{
      //console.log(data);
      var data:any = _data;
      this.Driver_Avatar = data.data.Avatar;
      this.Driver_LisensePlate = data.data.LisensePlate;
      this.Driver_Name = data.data.Name;
      this.Driver_Phone = data.data.Phone;
      this.ShowDriverInfor();
    });
  }

  ShowDriverInfor()
  {
    this.IsShowDriverInfor = true;
    this.DriverStatusContent = "Đợi tài xế xác nhận...";
    this.ListeningDriverResponse(this.RequesId);
  }

  HideDriverInfor()
  {
    this.RequesId = "";
    this.IsShowDriverInfor = false;
    this.ConfirmBtn = false;
    this.DriverStatusContent = "Đợi tài xế xác nhận...";
    this.ListeningDriverResponse(this.RequesId);
    this.IsActive = false;
    this.IsShowDriverInfor = false;
    this.ButtonContent = "Tìm xe ôm";
    this.ButtonClass = "btn btn-info";

  }

  PassengerFinishConfirm()
  {
    this.APIService.MissionFinishPassengerConfirm(this.RequesId).subscribe(data=>{
      this.DriverStatusContent = "Bạn đã xác nhận hoàn tất chuyến đi !";
      alert("Chuyến đi kết thúc");
      AppComponent.ThisApp.HideStartAndDestPoint();
      this.IsFinish = true;
      this.delay(1000).then(()=>{
        this.HideDriverInfor();
      });
      this.delay(5000).then(()=>{
        this.IsFinish = false;
      });
    });
  }

  delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    });
  }
}
