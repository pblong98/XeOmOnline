import { Component, OnInit } from '@angular/core';
import {APIService} from '../API.service';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-driver-login',
  templateUrl: './driver-login.component.html',
  styleUrls: ['./driver-login.component.css']
})
export class DriverLoginComponent implements OnInit {
  username:string;
  password:string;
  mess:string;
  messstyle:string;
  constructor(private ApiService: APIService, private CookieService: CookieService ) { }

  ngOnInit() {
    this.mess ="";
    this.messstyle = "text-danger";
  }

  SigninBtnClicked()
  {
    this.mess ="";
    this.messstyle = "text-danger";
    if(this.username == null || this.password == null)
    {
      this.mess = "Vui lòng điền đầy đủ các trường !";
      return;
    }
    this.ApiService.SignIn(this.username, this.password).subscribe(data =>{
      var _data:any = data;
      if(_data.status == "fail")
      {
        this.mess = "Tài khoản hoặc mật khẩu không chính xác !";
        return;
      }
      else
      {
        this.mess ="Đăng nhập thành công !";
        this.messstyle = "text-success";
        this.CookieService.set("token",_data.token);
        AppComponent.ThisApp.ComponentShowControl("map");
      }
    });
  }

  SignupBtnClicked()
  {
    AppComponent.ThisApp.ComponentShowControl("up");
  }

  BackBtnClicked()
  {
    AppComponent.ThisApp.ComponentShowControl("ind");
  }


}
