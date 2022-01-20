import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryStateCityService } from '../service/country-state-city.service';
import { StateCityService } from '../service/state-city.service';
import { TosterService } from '../service/toster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { UlbserviceService } from '../service/ulbservice.service';
import { AttachmentService } from '../service/attachment.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-ulb',
  templateUrl: './edit-ulb.component.html',
  styleUrls: ['./edit-ulb.component.css'],
})
export class EditUlbComponent implements OnInit {
   @ViewChild('closebutton')
  closebutton:any;
  ulbform!: FormGroup;
  ulbModalform!: FormGroup;
  statedata: any = [];
  display:string=''
  uniqueId: any;
  saveas: any = true;
  saveasnew: any = true;
  isValidFormSubmitted: any;
  isValidbutton: any;
  isValidFormSubmittedModal: any;
  isValidbuttonModal: any;
  allowedExtensions = ['csv', 'xls'];
  districtdata: any;
  login_id: any;
  customerId: any;
  ulbid: any;
  ulbname: any;
  ulbattachments: any = [];
  filedatainput:any;
  constructor(
    private CountryStateCityService: CountryStateCityService,
    private ulb: FormBuilder,
    private ulbservice: UlbserviceService,
    private toast: TosterService,
    private Auth: AuthService,
    private Route: Router,
    private _Activatedroute: ActivatedRoute,
    private Attach: AttachmentService
  ) {}

  ngOnInit(): void {
    this.customerId = this._Activatedroute.snapshot.paramMap.get('id');
    this.Auth.userLoggedIn().subscribe((logindata: any) => {
      console.log(logindata);
      this.login_id = logindata.result._id;
    });
    this.CountryStateCityService.getallstates().subscribe((data: any) => {
      console.log(data.result);
      this.statedata = data.result;
    });
    this.ulbservice.getulbbyid(this.customerId).subscribe((data: any) => {
      console.log(data.result[0]);
      this.forminit(data.result[0]);
      this.getdistrictonload(data.result[0].state);
      this.ulbid = data.result[0].ulb_id;
      this.ulbname = data.result[0].ulb_name;
      this.ulbattachments =
        (data.result[0].attachments == null
          ? this.ulbattachments
          : data.result[0].attachments);
      console.log(this.ulbattachments);
      
    });

    this.modalforminit();
  }
  forminit(ulbdata: any) {
    this.ulbform = this.ulb.group({
      ulb_id: [ulbdata.ulb_id,[ Validators.required]],
      ulb_name: [ulbdata.ulb_name, [Validators.required]],
      pan:[ulbdata.pan,[Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      gstin: [ulbdata.gstin,[Validators.pattern(/^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5})([0-9]{4})([A-Z]{1}[1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})+$/)]],
      state: [ulbdata.state, [Validators.required]],
      city: [ulbdata.city,[ Validators.required]],
      address: [ulbdata.address],
      latitude: [ulbdata.latitude],
      longitude: [ulbdata.longitude],
      title: [ulbdata.title],
      first_name: [ulbdata.first_name],
      last_name: [ulbdata.last_name],
      phone: [ulbdata.phone],
      mobile: [ulbdata.mobile,[Validators.pattern('^[6-9][0-9]{9}$')]],
      email: [ulbdata.email,[ Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')]],
      secondary_email: [ulbdata.secondary_email,[ Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')]],
      monthly_oty_mlp: [ulbdata.monthly_oty_mlp],
      population: [ulbdata.population],
      remark: [ulbdata.remark],
      attachments:[this.ulbattachments]
    });
  }

  getulbname(eventval:any){
    this.ulbname=eventval.target.value;
  }

  deleteAttachment(i:any){
    console.log(i)
    this.ulbattachments.splice(i, 1);
    console.log(this.ulbattachments);
  }
  modalforminit() {
    this.ulbModalform = this.ulb.group({
      type_id: this.uniqueId,
      type: 'ULB',
      document_type: ['', Validators.required],
      document_no: ['', Validators.required],
      image: ['', Validators.required],
      validity: ['', Validators.required],
    });
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
  get f() {
    return this.ulbform.controls;
  }

  get fm() {
    return this.ulbModalform.controls;
  }
  saveform(svalue: any) {
    if (this.ulbform.invalid) {
      this.saveas = true;
    } else {
      this.saveas = svalue;
    }
  }
  saveasnewform(savalue: any) {
    if (this.ulbform.invalid) {
      this.saveasnew = true;
    } else {
      this.saveas = savalue;
    }
  }

  onFormSubmit() {
    this.isValidFormSubmitted = false;
    if (this.ulbform.invalid) {
      console.log(this.ulbform, 'error');
      this.isValidFormSubmitted = true;
      this.isValidbutton = false;
      this.toast.showError('Sorry!, Fields are mandatory.');
    } else {
      
      this.isValidbutton = true;
      this.ulbform.value.user_id = this.login_id;
      this.ulbform.value.attachments = this.ulbattachments;
      this.ulbform.value.ulb_name=this.ulbname
      this.ulbform.value.pan=this.display;
      console.log(this.ulbform, 'true');
      this.ulbservice
        .updateulb(this.customerId, this.ulbform.value)
        .subscribe((data) => {
          console.log(data);
          this.toast.showSuccess('Congratulation!, ULB has been updated.');
          if (this.saveas == 'save') {
            console.log(this.saveas);
            setTimeout(() => {
              this.Route.navigate(['/ulb-list']);
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

  onModalFormSubmit() {
    this.isValidFormSubmittedModal = false;
    if (this.ulbModalform.invalid) {
      console.log(this.ulbModalform, 'error');
      this.isValidFormSubmittedModal = true;
      this.isValidbuttonModal = false;
    } else {
      console.log(this.ulbModalform, 'true');
      this.isValidbuttonModal = true;
      this.ulbModalform.value.image = this.filedatainput;
      this.ulbModalform.value.type_id = this.uniqueId;
      this.ulbModalform.value.type = 'ULB';
      let formadata = this.ulbModalform.value;
      this.Attach.submitForm(formadata).subscribe((data: any) => {
        this.ulbattachments.push(data);
        console.log(this.ulbattachments);
        this.toast.showSuccess('Attachment added.');
        this.ulbModalform.reset();
        this.closebutton.nativeElement.click();
        this.isValidbuttonModal = false;
      });
    }
  }

  getdistrict(e: any) {
    console.log(e.target.value);
    this.CountryStateCityService.getalldistrictwithstatewise({
      statename: e.target.value,
    }).subscribe((data: any) => {
      console.log(data);
      this.districtdata = data.result;
    });
  }
  getdistrictonload(state: any) {
    console.log(state);
    this.CountryStateCityService.getalldistrictwithstatewise({
      statename: state,
    }).subscribe((data: any) => {
      console.log(data);
      this.districtdata = data.result;
    });
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
        window.location.href="ulb-list"
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
