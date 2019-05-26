import { Component, OnInit } from '@angular/core';
import { UserRegistrationDetails } from '../../../models/response.model';
import { CommonServices } from '../../../services/common.service';
import { Router } from '@angular/router';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public userRegistrationDetails = new UserRegistrationDetails();
  public formIsValid = false;
  public userList: any;
  public validationMsg = '';


  constructor(private router: Router, private objCommonServices: CommonServices) {
    if (localStorage.getItem("username") != null) {
      this.router.navigateByUrl('/blogs')
    }
  }

  ngOnInit() {
    this.objCommonServices
      .getUserList()
      .subscribe(res => {
        var usrList = res;
        this.userList = usrList;
      });

  }

  onSubmitLogin(data, formIsValid) {
    if (formIsValid) {
      this.formIsValid = false;
      var userList = this.userList

      userList.forEach(element => {
        var passwrd = element["password"];
        var username = element["username"];

        if (username.toLowerCase() == data["username"].toLowerCase()) {
          if (passwrd.toLowerCase() == data["password"]) {
            Materialize.toast('Welcome to Bloovo blogging site..!', 4000)
            this.removeData();
            
            localStorage.setItem("username", data["username"]);
            localStorage.setItem("uname", element["name"]);
            localStorage.setItem("id", element["id"]);
            this.objCommonServices.displayName.emit(element["name"]);
            this.router.navigateByUrl('/blogs');
          }
          else {
            this.validationMsg = "Username and password does not match..!!";
            $(".success-error").fadeIn();
            setTimeout(function () {
              $(".success-error").fadeOut();
            }, 3000);
          }
        }
        else {
          if (userList.some(e => e["username"].toLowerCase() === data["username"].toLowerCase())) { }
          else {
            this.validationMsg = "User does not exist..!!";

            $(".success-error").fadeIn();
            setTimeout(function () {
              $(".success-error").fadeOut();
            }, 3000);
          }


        }
      });
    }
    else {
      this.formIsValid = true;
    }
  }

  removeData()
  {
    localStorage.removeItem("username");
    localStorage.removeItem("uname");
    localStorage.removeItem("id");
  }
}
