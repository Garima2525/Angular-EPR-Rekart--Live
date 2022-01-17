import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
import { TosterService } from '../service/toster.service';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';
import { ActivatedRoute } from '@angular/router';

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
  userpassform!:FormGroup
  usereditform!: FormGroup;
  public mySelection: string[] = [];
  isValidFormSubmitted: any;
  isPasswordSame: any;
  buttondisabled: any = true;
  roledata: any;
  user: any
  userId:any
  id:any
  isValidbutton: any;
  userPermission: any
 
  username:any
  udata: any;
  email: any;
  editUsername: any;
  mobile: any;
  phone: any;
  designation: any;
  role: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private users: AuthService,
    private userservice: UserService,
    private Toaster: TosterService,
    private _Activatedroute: ActivatedRoute,
   
  ) { }

  ngOnInit(): void {
    this.users.userLoggedIn().subscribe((user: any) => {
      console.log(user)
      this.user = user.result
      this.userservice.getallrole().subscribe((data: any) => {
        // console.log(data.result);
        this.roledata = data.result;
      });

    })

    this.initform();
    this.getalluser();
    this.initformpass()
   
  }
  

  forminit(uni: any) {
    this.usereditform = this.fb.group(
      {
        username:  [uni.username, Validators.required],
        email: [uni.email, [Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')]],
        phone: [uni.phone, [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
        designation: [uni.designation, Validators.required],
        role: [uni.role, Validators.required],
      }
    );
  }
  
  getalluser() {
    this.userservice.getalluser().subscribe((data: any) => {
      this.gridData = data.result
      this.gridView = data.result;
      // this._id = data.result[0]._id;
      // console.log(this._id);
      // console.log(data)
    })
  }

  getId(id:any):void{
    // console.log(id);
    this.userservice.getuserbyid(id).subscribe((data:any)=>{
      this.initformpass()
      this.forminit(data.result[0]);
      this.editUsername=data.result[0].username;
      this.phone = data.result[0].phone;
      this.designation = data.result[0].designation;
      this.role = data.result[0].role;
      console.log(this.phone);
      
      this.email=data.result[0].email;
     
      // console.log(this.usereditform)
    });
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


  initformpass() {
    this.userpassform = this.fb.group(
      {
        
       
        password: ['', Validators.compose([Validators.required])],
        cpassword: ['', Validators.compose([Validators.required])],
        
      },
      { validator: this.checkPassword('password', 'cpassword') }
    );
  }


  get fm() {
    return this.usereditform.controls;
  }

  get f() {
    return this.userform.controls;
  }
  get fs() {
    return this.userpassform.controls;
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
          this.Toaster.showSuccess(data.message)
          window.location.reload();
          document.getElementById('closemodal')?.click()
        } else if (data.status === 500) {
          this.Toaster.showError(data.message)
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

  onFormSubmit() {
    this.isValidFormSubmitted = false;
    if (this.usereditform.invalid) {
      console.log(this.usereditform, 'error');
      this.isValidFormSubmitted = true;
      this.isValidbutton = false;
      this.Toaster.showError('Sorry!, Fields are mandatory.');
    } else {
      console.log(this.usereditform, 'true');
      this.isValidbutton = true;
     this.usereditform.value.phone = this.phone;
     
      this.userservice
        .updateForm(this.usereditform.value,this.id)
        .subscribe((data: any) => {
          console.log(data);
          this.Toaster.showSuccess(
            'Congratulation!, User has been updated.'
          );
          if (data.status == 200) {
                    this.Toaster.showSuccess(data.message)
                    window.location.reload();
                    document.getElementById('closemodal')?.click()
                  } else if (data.status === 500) {
                    this.Toaster.showError(data.message)
                  }
           });
     }
  }




  onFormSubmitpass() {
    this.isValidFormSubmitted = false;
    if (this.userpassform.invalid) {
      console.log(this.userpassform, 'error');
      this.isValidFormSubmitted = true;
      this.isValidbutton = false;
      this.Toaster.showError('Sorry!, Fields are mandatory.');
    } else {
      console.log(this.userpassform, 'true');
      this.isValidbutton = true;
     this.userpassform.value.phone = this.phone;
     
      this.userservice
        .passupdat(this.userpassform.value,this.id)
        .subscribe((data: any) => {
          console.log(data);
          this.Toaster.showSuccess(
            'Congratulation!, User has been updated.'
          );
          if (data.status == 200) {
                    this.Toaster.showSuccess(data.message)
                    window.location.reload();
                    document.getElementById('closemodal')?.click()
                  } else if (data.status === 500) {
                    this.Toaster.showError(data.message)
                  }
           });
     }
  }
 

 
}
