import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateCityService } from '../service/state-city.service';
import { CustomerService } from '../service/customer.service';
import { TosterService } from '../service/toster.service';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css'],
})
export class EditCustomerComponent implements OnInit {
  saveas: any = true;
  saveasnew: any = true;
  toggle: boolean = false;
  Customerform!: FormGroup;
  add1: any;
  add2: any;
  add3: any;
  states: any;
  display:string=''
  district: any;
  country: any;
  todayDate:any;
  currentUser:any
  uniqueId: any;
  users:any
  pincodeerrorStatus = false;
  pincodeerrormsg: any;
  c_states: any;
  c_district: any;
  c_country: any;
  customer_id:any
  c_pincodeerrorStatus = false;
  c_pincodeerrormsg: any;
  isValidFormSubmitted: any;
  com_city: any;
  com_state: any;
  com_country: any;
  isValidbutton: any;
  customerId: any;
  customerdata:any;
  industry_type:any;
  OwnerId:any
  Owner:any
  ownerDropdownSettings={}
  pan:any;
  login_id: any;
  selectedUser:any
  constructor(
    private form: FormBuilder,
    private pincode: StateCityService,
    private customerService: CustomerService,
    private Toaster: TosterService,
    private Route: Router,
    private _Activatedroute: ActivatedRoute,
    private Auth:AuthService,
    private user:UserService
  ) {}
  check() {
    this.add1 = !this.toggle ? this.Customerform.value.reg_address1 : '';
    this.add2 = !this.toggle ? this.Customerform.value.reg_address2 : '';
    this.add3 = !this.toggle ? this.Customerform.value.reg_zipcode : '';
    this.com_state = !this.toggle ? this.Customerform.value.com_state : '';
    this.com_city = !this.toggle ? this.Customerform.value.com_city : '';
    this.com_country = !this.toggle ? this.Customerform.value.com_country : '';
    console.log((this.toggle = !this.toggle));
    console.log(this.states);
    //  console.log(this.Customerform.value.red_address1)
  }
  handlePincode(e: any) {
    this.pincode.getstatecity(e.target.value).subscribe((data: any) => {
      console.log(data);

      if (data[0].Status == 'Success') {
        this.states = data[0].PostOffice[0].State;
        this.district = data[0].PostOffice[0].District;
        this.country = data[0].PostOffice[0].Country;
        this.pincodeerrorStatus = false;
      } else {
        this.pincodeerrorStatus = true;
        this.pincodeerrormsg = 'Invalid Pincode';
        this.states = '';
        this.district = '';
        this.country = '';
      }
    });
  }

  handlePincode1(e: any) {
    this.pincode.getstatecity(e.target.value).subscribe((data: any) => {
      console.log(data);

      if (data[0].Status == 'Success') {
        this.c_states = data[0].PostOffice[0].State;
        this.c_district = data[0].PostOffice[0].District;
        this.c_country = data[0].PostOffice[0].Country;
        this.c_pincodeerrorStatus = false;
      } else {
        this.c_pincodeerrorStatus = true;
        this.c_pincodeerrormsg = 'Invalid Pincode';
        this.c_states = '';
        this.c_district = '';
        this.c_country = '';
      }
    });
  }

  ngOnInit(): void {
    this.todayDate = new Date();
    this.customerId=this._Activatedroute.snapshot.paramMap.get("id")
    this.Auth.userLoggedIn().subscribe((logindata:any)=>{
      console.log(logindata);
      // this.login_id=logindata.result._id

      this.currentUser=logindata.result.username
      console.log(this.currentUser,'user');
      
      this.login_id=logindata.result._id
      this.selectedUser=[logindata.result]
    })
    this.customerService.getcustomerbyid(this.customerId).subscribe((data:any)=>{
      this.forminit(data.result[0]);
      this.industry_type = data.result[0].industry_type;
      this.customer_id=data.result[0].customer_id
      console.log(this.customer_id,'...wd');
      this.pan=data.result[0].pan
      console.log(this.pan)
      console.log(this.industry_type)
    });
    this.user.getalluser().subscribe((data:any)=>{
      console.log(data)
      this.users=data.result
    })
  }
  forminit(uni: any) {
    this.Customerform = this.form.group({
      customer_id: [uni.customer_id, Validators.required],
      industry_type: [uni.industry_type],
      organization_name: [uni.organization_name, Validators.required],
      title: uni.title,
      first_name: [uni.first_name, Validators.required],
      last_name: uni.last_name,
      phone: uni.phone,
      mobile: [
        uni.mobile,
        [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')],
      ],
      email: [uni.email,[ Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')]],
      secondary_email: [uni.secondary_email,[ Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')]],
      red_address1: uni.red_address1,
      reg_address2: uni.reg_address2,
      reg_zipcode: uni.reg_zipcode,
      reg_state: uni.reg_state,
      reg_city: uni.reg_city,
      reg_country: uni.reg_country,
      com_address1: uni.com_address1,
      com_address2: uni.com_address2,
      com_zipcode: uni.com_zipcode,
      com_state: uni.com_state,
      com_city: uni.com_city,
      com_country: uni.com_country,
      com_phone: uni.com_phone,
      com_mobile: uni.com_mobile,
      com_email: uni.com_email,
      com_secondary_email: uni.com_secondary_email,
      pan_no: [uni.pan_no, [Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      msme_no: uni.msme_no,
      cin_no: uni.cin_no,
      pan:[uni.pan, [Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      gst_no: [
        uni.gst_no,
        [
          Validators.pattern(
            '^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5}[0-9]{4}[A-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$'
          ),
        ],
      ],
      cpcb_registration: uni.cpcb_registration,
      cpcb_validity: uni.cpcb_validity,
      spcb_registration: uni.spcb_registration,
      spcb_validity: uni.spcb_validity,
      remark: uni.remark,
      
    });
  }

  get f() {
    return this.Customerform.controls;
  }
  saveform(svalue: any) {
    if (this.Customerform.invalid) {
      this.saveas = true;
    } else {
      this.saveas = svalue;
    }
  }
  saveasnewform(savalue: any) {
    if (this.Customerform.invalid) {
      this.saveasnew = true;
    } else {
      this.saveas = savalue;
    }
  }

  onFormSubmit() {
    this.isValidFormSubmitted = false;
    if (this.Customerform.invalid) {
      console.log(this.Customerform, 'error');
      this.isValidFormSubmitted = true;
      this.isValidbutton = false;
      this.Toaster.showError('Sorry!, Fields are mandatory.');
    } else {
      console.log(this.Customerform, 'true');
      this.isValidbutton = true;
      this.Customerform.value.reg_city = this.district;
      this.Customerform.value.reg_state = this.states;
      this.Customerform.value.reg_country = this.country;
      this.Customerform.value.com_city = this.c_district;
      this.Customerform.value.com_state = this.c_states;
      this.Customerform.value.com_country = this.c_country;
      this.Customerform.value.pan_no=this.display;
      this.Customerform.value.created_by=this.currentUser
      this.customerService
        .updateForm(this.customerId,this.Customerform.value)
        .subscribe((resdata: any) => {
          console.log(resdata);
          this.Toaster.showSuccess(
            'Congratulation!, Customer has been updated.'
          );
          if (this.saveas == 'save') {
            console.log(this.saveas);
            setTimeout(() => {
              this.Route.navigate(['/view-customer']);
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
        window.location.href="view-customer"
      } else if (result.isDismissed) {
        console.log('Clicked No, File is safe!');
      }
    });
  }
  getval(val:string){
    console.log(val);
    // this.display=display
this.display = val.slice(2,12)
  }

}
