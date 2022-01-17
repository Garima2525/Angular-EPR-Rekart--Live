import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, 
  Validators } from '@angular/forms';
  import { TosterService } from '../service/toster.service';
  import Swal from 'sweetalert2';
  import { AuthService } from '../service/auth.service';

  import { UserService } from '../service/user.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor
  (
    private router: Router,
    private fb: FormBuilder, 
    private Toaster: TosterService,
    private auth: AuthService,
    private toast: TosterService,
    private users:UserService,
    private userAuth:AuthService
    ) { }
  changeform!: FormGroup;
  username:any;
  saveas: any = true;
  isValidbutton: any;
  isPasswordSame:any;
  isValidFormSubmitted: any;
  buttondisabled: any = true;
  login_id:any

  ngOnInit(): void {
    this.userAuth.userLoggedIn().subscribe((user:any)=>{
      console.log(user.result._id)
      this.login_id=user.result._id;
      this.username=user.result.username?user.result.username:this.router.navigate(['/login'])
      // this.username?null:
    })
    this.initform();
  }

  handleLogOut(){
    localStorage.removeItem('user')
    localStorage.removeItem('username')
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
      this.toast.showError('Sorry!, Fields are mandatory.');
    }else {
      console.log(this.changeform.value, 'true');
      this.users.changePassword(this.changeform.value,this.login_id).subscribe((data: any) => {
        this.buttondisabled = "false";
        console.log(data)
        if (data.status == 200) {
          this.toast.showSuccess(data.message)
          window.location.reload();
          document.getElementById('closemodal')?.click()
          this.handleLogOut()
          window.location.href='/login'
          
        } else {
          this.toast.showError(data.message)
        }
      
      })
    }
  }

}
