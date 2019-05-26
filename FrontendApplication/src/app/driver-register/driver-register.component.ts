import { Component, OnInit } from '@angular/core';
import {APIService} from '../API.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-driver-register',
  templateUrl: './driver-register.component.html',
  styleUrls: ['./driver-register.component.css']
})

export class DriverRegisterComponent implements OnInit {
  username:string;
  password:string;
  password2:string;
  name:string;
  phone:string; 
  licenseplates:string;
  mess:string;
  messstyle:string;

  constructor(private ApiService: APIService) { }

  ngOnInit( ) {
    this.mess ="";
  }

  SignupBtnClicked() {
    this.mess = "";
    this.messstyle="text-danger";
    if(this.username == null || this.password == null || this.name == null || this.phone == null || this.licenseplates == null)
    {
      this.mess = "Hãy điền đầy đủ tất cả các trường !";
      return;
    }
    if(this.password != this.password2)
    {
      this.mess = "Mật khẩu không khớp !";
      return;
    }
    this.ApiService.SignUp(this.username,this.password,this.name,this.phone,this.licenseplates).subscribe(data => {
      console.log(data);
      if(data == "fail")
      {
        this.mess = "Tài khoản đã tồn tại !";
        return;
      }
      else
      {
        this.username = null;
        this.password = null;
        this.password2 = null;
        this.name = null;
        this.phone = null;
        this.licenseplates = null;
        this.messstyle="text-success";
        this.mess = "Đăng ký thành công !";
        AppComponent.ThisApp.ComponentShowControl("in");
      }
    });
  }

  BackBtnClicked()
  {
    AppComponent.ThisApp.ComponentShowControl("in");
  }

}
