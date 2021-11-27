import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
import { TosterService } from '../service/toster.service';
import { UserService } from '../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit {
  roleId:any;
  saveas: any = true;
  saveasnew: any = true;
  isValidbutton: any;
  buttondisabled: any=true;
  constructor(private fb: FormBuilder, private userService:UserService,
    private router:Router,
    private Route: Router,
    private toast:TosterService,
    private _Activatedroute: ActivatedRoute,
    private Toaster: TosterService,
    ) {}
  addroleform!: FormGroup;
  isValidFormSubmitted:any;



  ngOnInit(): void {
    this.roleId=this._Activatedroute.snapshot.paramMap.get("id")
    this.userService.getrolebyid(this.roleId).subscribe((data:any)=>{
      this.forminit(data.result[0]);
    });
  }
  get f() {
    return this.addroleform.controls;
  }


  forminit(uni: any) {
    this.addroleform = this.fb.group({
      role_name:  [uni.role_name, [Validators.required]],
     
      description:uni.description,
      customerview: uni.customerview,
      customercreate: uni.customercreate,
      customeredit: uni.customeredit,
      customerdelete: uni.customerdelete,

      orderview: uni.orderview,
      ordercreate: uni.ordercreate,
      orderedit: uni.orderedit,
      orderdelete: uni.orderdelete,

      targetview: uni.targetview,
      targetcreate: uni.targetcreate,
      targetedit: uni.targetedit,
      targetdelete: uni.targetdelete,

      collectiondisposalview: uni.collectiondisposalview,
      collectiondisposalcreate: uni.collectiondisposalcreate,
      collectiondisposaledit: uni.collectiondisposaledit,
      collectiondisposaldelete: uni.collectiondisposaldelete,

      ulbview: uni.ulbview,
      ulbcreate: uni.ulbcreate,
      ulbedit: uni.ulbedit,
      ulbdelete: uni.ulbdelete,

      collectioncenterview: uni.collectioncenterview,
      collectioncentercreate: uni.collectioncentercreate,
      collectioncenteredit: uni.collectioncenteredit,
      collectioncenterdelete: uni.collectioncenterdelete,

      transporterview: uni.transporterview,
      transportercreate: uni.transportercreate,
      transporteredit: uni.transporteredit,
      transporterdelete: uni.transporterdelete,

      disposalview: uni.disposalview,
      disposalcreate: uni.disposalcreate,
      disposaledit: uni.disposaledit,
      disposaldelete:uni.disposaldelete,

      userview: uni.userview,
      usercreate: uni.usercreate,
      useredit: uni.useredit,
      userdelete: uni.userdelete,

      roleview: uni.roleview,
      rolecreate: uni.rolecreate,
      roleedit: uni.roleedit,
      roledelete: uni.roledelete
    });
  }

  saveform(svalue: any) {
    if (this.addroleform.invalid) {
      this.saveas = true;
    } else {
      this.saveas = svalue;
    }
  }
  saveasnewform(savalue: any) {
    if (this.addroleform.invalid) {
      this.saveasnew = true;
    } else {
      this.saveas = savalue;
    }
  }
 
  onFormSubmit() {
    this.isValidFormSubmitted = false;
    if (this.addroleform.invalid) {
      console.log(this.addroleform, 'error');
      this.isValidFormSubmitted = true;
      this.isValidbutton = false;
      this.Toaster.showError('Sorry!, Fields are mandatory.');
    } else {
      console.log(this.addroleform, 'true');
      this.isValidbutton = true;
      
      this.userService
        .updaterolebyid(this.roleId,this.addroleform.value)
        .subscribe((resdata: any) => {
          console.log(resdata);
          this.Toaster.showSuccess(
            'Congratulation!, Role has been updated.'
          );
          if (this.saveas == 'save') {
            console.log(this.saveas);
            setTimeout(() => {
              this.Route.navigate(['/role']);
            }, 5000);
          } else {
            console.log(this.saveas);
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          }
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


