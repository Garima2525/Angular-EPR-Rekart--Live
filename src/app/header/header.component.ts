import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, 
  Validators } from '@angular/forms';
  import { TosterService } from '../service/toster.service';
  import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router,private fb: FormBuilder, private Toaster: TosterService,) { }
  changeform!: FormGroup;
  username:any;
  saveas: any = true;
  isValidbutton: any;
  isPasswordSame:any;
  isValidFormSubmitted: any;
  ngOnInit(): void {
   this.username= localStorage.getItem('username')?localStorage.getItem('username'):this.router.navigate(['/login'])
   this.initform();
  }


  initform() {
    this.changeform = this.fb.group(
      {

        old_pass: ['', Validators.required],
        new_pass: ['', Validators.compose([Validators.required])],
        c_pass: ['', Validators.compose([Validators.required])],
        
      },
      { validator: this.checkPassword('new_pass', 'c_pass') }
    );
  }
  saveform(svalue: any) {
    if (this.changeform.invalid) {
      this.saveas = true;
    } else {
      this.saveas = svalue;
    }
  }
  get f() {
    return this.changeform.controls;
  }
  checkPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {

        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        this.isPasswordSame = matchingControl.status == 'VALID' ? true : false;
      } else {
        matchingControl.setErrors(null);
        this.isPasswordSame = matchingControl.status == 'VALID' ? true : false;
      }
    };
  }
  onFormSubmit() {
    this.isValidFormSubmitted = false;
    if (this.changeform.invalid) {
      console.log(this.changeform,'error');
      this.isValidFormSubmitted = true;
      this.isValidbutton = false;
      this.Toaster.showError('Sorry!, Fields are mandatory.');
    }else{
      this.Toaster.showSuccess('save');
    }
  }
  handleWarningAlert() {
    Swal.fire({

      text: 'Are you sure you want to exit?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Clicked Yes, File deleted!');
        window.location.href = "userlist"
      } else if (result.isDismissed) {
        console.log('Clicked No, File is safe!');
      }
    });
  }



}
