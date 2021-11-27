import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SwiperOptions } from 'swiper';
import { AuthService } from '../service/auth.service';
import { CountryStateCityService } from '../service/country-state-city.service';
import { TargetService } from '../service/target.service';
import { TosterService } from '../service/toster.service';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.css'],
})
export class GoalComponent implements OnInit {


  targetInfo: any = [
    {
      material_name: null,
      state: null,
      city: null,
      ulb: null,
      collection_center: null,
      disposal: null,
      collection_target: null,
      target_date: null,
    },
  ];
  districtdata: any;
  statedata: any;
  targetForm!:FormGroup;
  statesdata: any;
  statename: any;
  isValidFormSubmitted: any;
  saveas: any;
  saveasnew: any;
  isValidbutton: any;
  login_id: any;
  targetname: any;
  targetDuration: any;
  constructor( private CountryStateCityService: CountryStateCityService,private fb:FormBuilder, private target:TargetService,private toast: TosterService,
    private Auth: AuthService,
    private Route: Router,) {}

  ngOnInit(): void {
    this.Auth.userLoggedIn().subscribe((logindata: any) => {
      console.log(logindata);
      this.login_id = logindata.result._id;
    });
    this.CountryStateCityService.getallstates().subscribe((data: any) => {
      console.log(data.result);
      this.statedata = data.result;
      this.onformInit()
    });
  }
 
  addinfo(e: any) {
    e.preventDefault();
    this.targetInfo.push({
      material_name: null,
      state: null,
      city:  null,
      ulb: null,
      collection_center: null,
      disposal: null,
      collection_target: null,
      target_date: null,
    });
    console.log(this.targetInfo);
  }
  deleteinfo(e: any, index: any) {
    e.preventDefault();
    this.targetInfo.splice(index, 1);
  }
  valueInsert(e: any, name: any, index: any) {
    this.targetInfo[index][name] = e.target.value;
  }
  onformInit(){
    this.targetForm=this.fb.group({
      material_name:'',
      target_name:'',
      target_duration:'',
      state:'',
      user_id:'',
      target_info:''
    })
  }

  getdistrict(e: any) {
    console.log(e.target.value);
    this.statename=e.target.value
    this.CountryStateCityService.getalldistrictwithstatewise({
      statename: e.target.value,
    }).subscribe((data: any) => {
      console.log(data);
      this.districtdata = data.result;
      this.targetInfo.map((item:any,i:any)=>{
        this.targetInfo[i].state=e.target.value
      })
    });
  }

  getdetails(e:any,i:any){
    this.target.getalldetailscitywise({city:e.target.value}).subscribe((citywise:any)=>{
      console.log(citywise)
      this.targetInfo[i].city=e.target.value;
      this.targetInfo[i].ulb=citywise.ulbresult[0]?.ulb_name
      this.targetInfo[i].collection_center=citywise.collectionresult[0]?.collection_center_name;
      this.targetInfo[i].disposal=citywise.disposalresult[0]?.disposal_company_name
    })
  }

  saveform(svalue: any) {
    if (this.targetForm.invalid) {
      this.saveas = true;
    } else {
      this.saveas = svalue;
    }
  }
  saveasnewform(savalue: any) {
    if (this.targetForm.invalid) {
      this.saveasnew = true;
    } else {
      this.saveas = savalue;
    }
  }

  getTargetName(e:any){
    this.targetname = e.target.value;
  }
  getTargetDuration(e:any){
    this.targetDuration = e.target.value;
  }

  onFormSubmit() {
    this.isValidFormSubmitted = false;
    if (this.targetForm.invalid) {
      console.log(this.targetForm, 'error');
      this.isValidFormSubmitted = true;
      this.isValidbutton = false;
      // this.toast.showError('Sorry!, Fields are mandatory.');
    } else {
      this.isValidbutton = true;
      this.targetForm.value.user_id = this.login_id;
      this.targetForm.value.target_info = this.targetInfo;
      this.targetForm.value.state = this.statename;
      this.targetForm.value.target_name = this.targetname;
      this.targetForm.value.target_duration = this.targetDuration;
      console.log(this.targetForm, 'true');
      this.target.submitForm(this.targetForm.value).subscribe((data:any) => {
        console.log(data);
        this.toast.showSuccess(
          'Congratulation!, Target has been created.'
        );
        if (this.saveas == 'save') {
          console.log(this.saveas);
          setTimeout(() => {
            this.Route.navigate(['/goal-list']);
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
        window.location.href="disposal-list"
      } else if (result.isDismissed) {
        console.log('Clicked No, File is safe!');
      }
    });
  }

  getChanges(w:any,i:any,value:any){
    this.targetInfo[i][value]=w.target.value;
    this.targetInfo[i].state=this.statename;
  }


}
