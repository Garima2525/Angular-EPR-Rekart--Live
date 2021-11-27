import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
import { TosterService } from '../service/toster.service';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;

  public gridData: any;
  public gridView: any;
  userform!: FormGroup;
  public mySelection: string[] = [];
  isValidFormSubmitted: any;
  isPasswordSame: any;
  buttondisabled: any = true;
  roledata: any;
  user: any

  userPermission: any

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private users: AuthService,
    private userservice: UserService,
    private toast: TosterService
  ) { }

  ngOnInit(): void {


    this.users.userLoggedIn().subscribe((user: any) => {
      console.log(user)
      this.user = user.result

      this.userservice.getallrole().subscribe((data: any) => {
        console.log(data.result);

        this.roledata = data.result;
      });
    })



    // this.getQuotes();
    this.initform();
    this.getalluser();
  }



  getalluser() {
    this.userservice.getalluser().subscribe((data: any) => {
      this.gridData = data.result
      this.gridView = data.result;
      console.log(data)
    })
  }
  initform() {
    this.userform = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')]],
        phone: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
        designation: ['', Validators.required],
        password: ['', Validators.compose([Validators.required])],
        cpassword: ['', Validators.compose([Validators.required])],
        role: ['', Validators.required],
      },
      { validator: this.checkPassword('password', 'cpassword') }
    );
  }

  get f() {
    return this.userform.controls;
  }
  onsubmit() {
    if (this.userform.invalid) {
      console.log(this.userform, 'error');
      this.isValidFormSubmitted = true;
    } else {
      console.log(this.userform, 'true');
      this.userservice.createUser(this.userform.value).subscribe((data: any) => {
        this.buttondisabled = "false";
        console.log(data)
        if (data.status == 200) {
          this.toast.showSuccess(data.message)
          window.location.reload();
          document.getElementById('closemodal')?.click()
        } else if (data.status === 500) {
          this.toast.showError(data.message)
        }
        // setTimeout(()=>{
        // },1000)
      })
    }
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



  public onFilter(e: any): void {
    let inputValue = e.target.value;
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'username',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'email',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'mobile',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'role',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'created_at',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

}
