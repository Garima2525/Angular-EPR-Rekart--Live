import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TosterService } from '../service/toster.service';
import { UserService } from '../service/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-addrole',
  templateUrl: './addrole.component.html',
  styleUrls: ['./addrole.component.css']
})
export class AddroleComponent implements OnInit {
  buttondisabled: any=true;
  constructor(private fb: FormBuilder, private userService:UserService,
    private router:Router,
    private toast:TosterService
    ) {}
 
  addroleform!: FormGroup;
  isValidFormSubmitted:any;
  ngOnInit(): void {
    this.forminit();
  }
  get f() {
    return this.addroleform.controls;
  }
  
  forminit() {
    this.addroleform = this.fb.group({
      role_name: ['', Validators.required],
      description: '',
      customerview: false,
        customercreate: false,
        customeredit: false,
        customerdelete: false,

        orderview: false,
        ordercreate: false,
        orderedit: false,
        orderdelete: false,

        targetview: false,
        targetcreate: false,
        targetedit: false,
        targetdelete: false,

        collectiondisposalview: false,
        collectiondisposalcreate: false,
        collectiondisposaledit: false,
        collectiondisposaldelete: false,

        ulbview: false,
        ulbcreate: false,
        ulbedit: false,
        ulbdelete: false,

        collectioncenterview: false,
        collectioncentercreate: false,
        collectioncenteredit: false,
        collectioncenterdelete: false,

        transporterview: false,
        transportercreate: false,
        transporteredit: false,
        transporterdelete: false,

        disposalview: false,
        disposalcreate: false,
        disposaledit: false,
        disposaldelete: false,

        userview: false,
        usercreate: false,
        useredit: false,
        userdelete: false,

        roleview: false,
        rolecreate: false,
        roleedit: false,
        roledelete: false
    });
  }


 

  onsubmit() {
    if (this.addroleform.invalid) {
      console.log(this.addroleform, 'error');
      this.isValidFormSubmitted = true;
    } else {
      console.log(this.addroleform, 'true');
       console.log(this.addroleform, 'true');
       this.userService.createRole(this.addroleform.value).subscribe((data) => {
         this.buttondisabled = 'false';
        //  this.toast.showSuccess("Success")
         this.toast.showSuccess(
          'Congratulation!, Role has been created.'
        );
         setTimeout(()=>{
          this.router.navigate(['/role'])
         },5000)
       });
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
        window.location.href="role"
      } else if (result.isDismissed) {
        console.log('Clicked No, File is safe!');
      }
    });
  }

}
