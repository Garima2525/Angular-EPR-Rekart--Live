import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { SwiperOptions } from 'swiper';
import { AuthService } from '../service/auth.service';
import { CountryStateCityService } from '../service/country-state-city.service';
import { TargetService } from '../service/target.service';
import { TosterService } from '../service/toster.service';
import { AttachmentService } from '../service/attachment.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-edit-target',
  templateUrl: './edit-target.component.html',
  styleUrls: ['./edit-target.component.css']
})
export class EditTargetComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 1
      }
    },
    nav: true
  }


  @ViewChild('closebutton')
  closebutton:any;

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
  uniqueId: any;
  isValidFormSubmitted: any;
  isValidFormSubmittedModal: any;
  saveas: any;
  saveasnew: any;
  isValidbutton: any;
  isValidbuttonModal: any;
  login_id: any;
  targetname: any;
  filedatainput:any;
  targetDuration: any;
  goalModalform!: FormGroup;
  goalattachments: any = [];
 tarId:any
  tname:any;
  ulbattachments: any = [];
  constructor(
     private CountryStateCityService: CountryStateCityService,
     private fb:FormBuilder, 
     private target:TargetService,
     private toast: TosterService,
      private Auth: AuthService,
      private Route: Router,
      private Attach: AttachmentService,
      private router:Router,
      private _Activatedroute: ActivatedRoute,
    ) {}
    title = 'angular';

  ngOnInit(): void {
    this.tarId = this._Activatedroute.snapshot.paramMap.get('id');
    this.Auth.userLoggedIn().subscribe((logindata: any) => {
      console.log(logindata);
      this.login_id = logindata.result._id;
    });
    this.CountryStateCityService.getallstates().subscribe((data: any) => {
      console.log(data.result);
      this.statedata = data.result;
     
    });
    this.target.gettargetbyid(this.tarId).subscribe((data: any) => {
      console.log(data.result[0]);
      this.onformInit(data.result[0]);
      // this.getdistrictonload(data.result[0].state);
     
      this.tname = data.result[0].target_name;
      this.ulbattachments =
        (data.result[0].attachments == null
          ? this.ulbattachments
          : data.result[0].attachments);
      console.log(this.ulbattachments);
      
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
  onformInit(tdata:any){
    this.targetForm=this.fb.group({
      material_name:tdata.material_name,
      target_name:tdata.target_name,
      target_duration:tdata.target_duration,
      state:tdata.state,
      user_id:tdata.user_id,
      target_info:tdata.target_info,
      attachments:[]
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
  getdistrictonload(state: any) {
    console.log(state);
    this.statename=state
    this.CountryStateCityService.getalldistrictwithstatewise({
      statename: state,
    }).subscribe((data: any) => {
      console.log(data);
      this.districtdata = data.result;
      this.targetInfo.map((item:any,i:any)=>{
        this.targetInfo[i].state=state
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
  modalforminit() {
    this.goalModalform = this.fb.group({
      type_id: this.uniqueId,
      type: 'target',
      document_type: ['', Validators.required],
      document_no: ['', Validators.required],
      image: ['', Validators.required],
      validity: ['', Validators.required],
    });
  }

  get fm() {
    return this.goalModalform.controls;
  }
  fileupload(e: any) {
    console.log(e.target.files[0].type);
    if (
      e.target.files[0].type == 'application/pdf' ||
      e.target.files[0].type == 'image/png' ||
      e.target.files[0].type == 'image/jpeg' ||
      e.target.files[0].type == 'image/jpg'
    ) {
      this.Attach.UploadFile(e.target.files, this.uniqueId).subscribe(
        (imagedata: any) => {
          console.log(imagedata);
          this.filedatainput = imagedata.url;
          this.isValidbuttonModal=false;
        }
      );
    } else {
      this.filedatainput = null;
      this.isValidbuttonModal=true;
      this.toast.showError('Invalid File.');
    }
  }
  onFormSubmit() {
    // this.isValidFormSubmitted = false;
    // if (this.targetForm.invalid) {
    //   console.log(this.targetForm, 'error');
    //   this.isValidFormSubmitted = true;
    //   this.isValidbutton = false;
    //   // this.toast.showError('Sorry!, Fields are mandatory.');
    // } else {
    //   this.isValidbutton = true;
    //   this.targetForm.value.user_id = this.login_id;
    //   this.targetForm.value.target_info = this.targetInfo;
    //   this.targetForm.value.state = this.statename;
    //   this.targetForm.value.target_name = this.targetname;
    //   this.targetForm.value.target_duration = this.targetDuration;
    //   this.targetForm.value.attachments = this.goalattachments;
    //   console.log(this.targetForm, 'true');
    //   this.target.submitForm(this.targetForm.value).subscribe((data:any) => {
    //     console.log(data);
    //     this.toast.showSuccess(
    //       'Congratulation!, Target has been created.'
    //     );
    //     if (this.saveas == 'save') {
    //       console.log(this.saveas);
    //       setTimeout(() => {
    //         this.Route.navigate(['/goal-list']);
    //       }, 5000);
    //     } else {
    //       console.log(this.saveas);
    //       setTimeout(() => {
    //         window.location.reload();
    //       }, 5000);
    //     }
    //   });
    // }
  }
  onModalFormSubmit() {
    this.isValidFormSubmittedModal = false;
    if (this.goalModalform.invalid) {
      console.log(this.goalModalform, 'error');
      this.isValidFormSubmittedModal = true;
      this.isValidbuttonModal = false;
    } else {
      console.log(this.goalModalform, 'true');
      this.isValidbuttonModal = true;
      this.goalModalform.value.image = this.filedatainput;
      this.goalModalform.value.type_id = this.uniqueId;
      this.goalModalform.value.type = 'ULB';
      let formadata = this.goalModalform.value;
      this.Attach.submitForm(formadata).subscribe((data: any) => {
        this.ulbattachments.push(data);
        console.log(this.ulbattachments);
        this.toast.showSuccess('Attachment added.');
        this.goalModalform.reset();
        this.closebutton.nativeElement.click();
        this.isValidbuttonModal = false;
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
  deleteAttachment(i:any){
    console.log(i)
    this.goalattachments.splice(i, 1);
    console.log(this.goalattachments);
  }

  
}

