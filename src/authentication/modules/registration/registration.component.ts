import { Inject, Component, OnInit } from '@angular/core';
import { CommonServices } from '../../../services/common.service';
import { UserRegistrationDetails } from '../../../models/response.model';
import { Router } from '@angular/router';


declare var $: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {

  userRegistrationDetails = new UserRegistrationDetails();
  formIsValid = false;

  constructor(private router: Router, private objCommonServices: CommonServices) {
    if (localStorage.getItem("username") != null) {
      this.router.navigateByUrl('/blogs')
    }
  }

  ngOnInit() {

  }

  onSubmit(data, formIsValid) {

    if (formIsValid) {
      this.formIsValid = false;
      var userData = JSON.stringify(data);

      this.objCommonServices
        .registerUser(userData)
        .subscribe(res => {
          console.log(res);
        })

      $(".success-alert").fadeIn();
      setTimeout(function () {
        $(".success-alert").fadeOut();
      }, 2000);
      this.userRegistrationDetails = new UserRegistrationDetails();
    }
    else {
      this.formIsValid = true;
    }
  }

  removeSpecialChar(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 0 || (k >= 48 && k <= 57));
  }
}
