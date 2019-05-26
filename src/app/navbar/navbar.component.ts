import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServices } from 'src/services/common.service';
import { UpdateUserRegistrationDetails } from 'src/models/response.model';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  displayName;
  userid: string = '';
  formIsValid: boolean = false;
  updateUserRegistrationDetails = new UpdateUserRegistrationDetails();
  mismatchPassword: boolean;
  validationMsg: string;
  isSubmitForm: boolean = false;

  constructor(private router: Router, private objCommonServices: CommonServices) {
    this.objCommonServices.displayName.subscribe(res => {
      this.displayName = res;
    })
    this.userid = localStorage.getItem("id")
  }

  ngOnInit() {
    if (this.displayName == undefined) {
      if (localStorage.getItem("uname") != null) {
        this.displayName = localStorage.getItem("uname");
      }
    }
  }

  ngAfterViewInit() {
    $('.modal').modal();
  }


  ShowEditUserModal() {
    var userid = localStorage.getItem("id")
    this.updateUserRegistrationDetails.newpassword = '';
    this.updateUserRegistrationDetails.oldpassword = '';

    this.objCommonServices
      .getUserDetails(Number(userid))
      .subscribe(res => {
        var usrDetails = res;
        this.updateUserRegistrationDetails.username = usrDetails["username"];
        this.updateUserRegistrationDetails.name = usrDetails["name"];
        this.updateUserRegistrationDetails.password = usrDetails["password"];
      });

    setTimeout(() => {
      $("#editUserModel").modal('open');
    }, 200);

  }

  updateDetails(data, isValild) {
    debugger;
    if (isValild) {
      this.formIsValid = false;
      if (this.updateUserRegistrationDetails.password == data["oldpassword"]) {
        this.mismatchPassword = false;
        this.isSubmitForm = true;
        
        var postData = {
          "name": data["name"],
          "password": data["newpassword"]
        }
        this.objCommonServices
          .updateUserDetails(JSON.stringify(postData), Number(this.userid))
          .subscribe(res => {
            if (res != null) {
              this.isSubmitForm = false;

              this.UpdateStorage(data["name"]);

              this.validationMsg = "Profile updated successfuly..!!";
              $(".success-error").fadeIn();
              setTimeout(function () {
                $(".success-error").fadeOut();
                setTimeout(function () {
                  $("#editUserModel").modal('close');
                }, 1000);
              }, 2000);
            }
          });
      }
      else {
        this.mismatchPassword = true;
      }
    }
    else {
      this.formIsValid = true;
    }
  }

  UpdateStorage(name) {
    localStorage.removeItem("uname");
    localStorage.setItem("uname", name);
    this.objCommonServices.displayName.emit(name);
  }

  Logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("uname");
    localStorage.removeItem("id");
    this.displayName = undefined;
    this.router.navigateByUrl("/login")

  }

}
