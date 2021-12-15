import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryStateCityService } from '../service/country-state-city.service';
import { StateCityService } from '../service/state-city.service';
import { TosterService } from '../service/toster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { DisposalserviceService } from '../service/disposalservice.service'
import { AttachmentService } from '../service/attachment.service';
import {DisposalExecutionService} from '../service/disposal-execution.service'
import Swal from 'sweetalert2';
import { UlbserviceService } from '../service/ulbservice.service';
import { CollectioncenterserviceService } from '../service/collectioncenterservice.service';
import { TranporterserviceService } from '../service/tranporterservice.service';
@Component({
  selector: 'app-edit-disposal-execution',
  templateUrl: './edit-disposal-execution.component.html',
  styleUrls: ['./edit-disposal-execution.component.css']
})
export class EditDisposalExecutionComponent implements OnInit {
  uniqid: any;
  disposalexecutionform!: FormGroup;
   login_id: any;
   statedata: any;
   districtdata: any;
   saveas: any;
   saveasnew: any;
   material_name:any;
   isValidFormSubmitted: any;
   isValidbutton: any;
   ccattachments: any = [];
   disposalexecutionformModal!: FormGroup;
   filedatainput: any;
   isValidbuttonModal: any;
   isValidFormSubmittedModal: any;
   @ViewChild('closebutton')
   closebutton: any;
   disexecutionId: any;
   disposalname: any;
   disposalid: any;
   ULBdata: any;
   DISdata:any;
   transporterdata:any;

   collectiondata:any

    constructor(
      private disposalexecution: DisposalExecutionService,
      private CountryStateCityService: CountryStateCityService,
      private cd: FormBuilder,
      private toast: TosterService,
      private Auth: AuthService,
      private Route: Router,
      private Attach: AttachmentService,
      private _Activatedroute: ActivatedRoute,
      private ULB:UlbserviceService,
      private CC:CollectioncenterserviceService,
      private DisposalS: DisposalserviceService,
      private transporter:TranporterserviceService
  ) { }
 ammountInfo:any=[{
    amount:null,
    expenditure_type:null,
    receipt_no:null

  }]
  ngOnInit(): void {
    this.disexecutionId =  this._Activatedroute.snapshot.paramMap.get('id');
    this.Auth.userLoggedIn().subscribe((logindata: any) => {
      console.log(logindata);
      this.login_id = logindata.result._id;
    });
    this.CountryStateCityService.getallstates().subscribe((data: any) => {
      console.log(data.result);
      this.statedata = data.result;
    });
    this.ULB.getallulb().subscribe((ULBdatas: any) => {
      // console.log(ULBdatas);
      this.ULBdata = ULBdatas.result;
    });
    this.CC.getallcollection().subscribe((CCdata:any)=>{
      // console.log(CCdata);
      this.collectiondata=CCdata.result;
    })
    this.DisposalS.getalldisposal().subscribe((Disdatas: any) => {
      // console.log(Disdatas);
      this.DISdata = Disdatas.result;
    });
    this.transporter.getalltransporter().subscribe((data: any) => {
      console.log(data.result);

      this.transporterdata = data.result;
    });

    this.disposalexecution.getdisposalexecutionbyid(this.disexecutionId).subscribe((data: any) => {
      console.log(data.result[0]);
      this.forminit(data.result[0]);
    
      this.getdistrictonload(data.result[0].state);
      this.material_name = data.result[0].material_name;
      console.log(this.material_name)
       this.disposalid = data.result[0].disposal_id;
      
       this.disposalname = data.result[0].disposal_company_name;
       this.ammountInfo = data.result[0].payment;
       console.log(this.ammountInfo);
      this.ccattachments =
        data.result[0].attachments == null
          ? this.ccattachments
          : data.result[0].attachments;
      console.log(this.ccattachments);
    });
    this.modalforminit();
  }
  addinfo(e:any){
    e.preventDefault()
    this.ammountInfo.push({
      amount:0,
      expenditure_type:null,
      receipt_no:null
  
    })
    console.log( this.ammountInfo)
  }

  deleteinfo(e:any,index:any){
    e.preventDefault()
    this.ammountInfo.splice(index,1)
  
  }
  valueInsert(e:any,name:any,index:any){
    this.ammountInfo[index][name]=e.target.value
    
    }
  get f() {
    return this.disposalexecutionform.controls;
  }

  get fm() {
    return this.disposalexecutionformModal.controls;
  }
  fileupload(e: any) {
    console.log(e.target.files[0].type);
    if (
      e.target.files[0].type == 'application/pdf' ||
      e.target.files[0].type == 'image/png' ||
      e.target.files[0].type == 'image/jpeg' ||
      e.target.files[0].type == 'image/jpg'
    ) {
      this.Attach.UploadFile(e.target.files, this.uniqid).subscribe(
        (imagedata: any) => {
          console.log(imagedata);
          this.filedatainput = imagedata.url;
          this.isValidbuttonModal = false;
        }
      );
    } else {
      this.filedatainput = null;
      this.toast.showError('Invalid File.');
      this.isValidbuttonModal = true;
    }
  }
  forminit(disposalexecutiondata :any) {
    this.disposalexecutionform = this.cd.group({
    
      material_name:[disposalexecutiondata.material_name, [Validators.required]],
      state: [disposalexecutiondata.state,[ Validators.required]],
      city: [disposalexecutiondata.city,[ Validators.required]],
      ulb:[disposalexecutiondata.ulb,[ Validators.required]],
      collection_center:[disposalexecutiondata.collection_center,[Validators.required]],
      disposal_facility_pwpf:[disposalexecutiondata.disposal_facility_pwpf,[ Validators.required]],
      transporter_name:[disposalexecutiondata.transporter_name,[ Validators.required]],
      mobile_no:[disposalexecutiondata.mobile_no,[Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
      vehicle_no:[disposalexecutiondata.vehicle_no,[Validators.required]],
      driver_name:[disposalexecutiondata.driver_name,[ Validators.required]],
      driver_mobile_no:[disposalexecutiondata.driver_mobile_no,[Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
      bill_t_no:[disposalexecutiondata.bill_t_no,[Validators.required]],
      e_way_bill:[disposalexecutiondata.e_way_bill,[ Validators.required]],
      invoice_no:[disposalexecutiondata.invoice_no,[Validators.required]],
      payment:disposalexecutiondata.payment,
      collection_date_time:[disposalexecutiondata.collection_date_time,[Validators.required]],
      collection_material_weight:[disposalexecutiondata.collection_material_weight,[Validators.required]],
      collection_remark:disposalexecutiondata.collection_remark,
      disposal_date_time:[disposalexecutiondata.disposal_date_time,[Validators.required]],
      disposal_material_weight:[disposalexecutiondata.disposal_material_weight,[Validators.required]],
      disposal_remark:disposalexecutiondata.disposal_remark,
      attachments:'',
    });
   
    
  
  }
  modalforminit() {
    this.disposalexecutionformModal = this.cd.group({
      type_id: this.uniqid,
      type: 'disposalexecution',
      document_type: ['', Validators.required],
      document_no: ['', Validators.required],
      image: ['', Validators.required],
      
    });
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
  saveform(svalue: any) {
    if (this.disposalexecutionform.invalid) {
      this.saveas = true;
    } else {
      this.saveas = svalue;
    }
  }
  onFormSubmit() {
    this.isValidFormSubmitted = false;
    if (this.disposalexecutionform.invalid) {
      console.log(this.disposalexecutionform, 'error');
      this.isValidFormSubmitted = true;
      this.isValidbutton = false;
      this.toast.showError('Sorry!, Fields are mandatory.');
    } else {
      console.log(this.disposalexecutionform, 'true');
      this.isValidbutton = true;
      this.disposalexecutionform.value.user_id = this.login_id;
      this.disposalexecutionform.value.attachments = this.ccattachments;
      this.disposalexecutionform.value.payment = this.ammountInfo;
      this.disposalexecution.updateForm(this.disposalexecutionform.value,this.disexecutionId).subscribe((data:any) => {
        console.log(data);
        this.toast.showSuccess(
          'Congratulation!, Disposal execution has been Updated.'
        );
        if (this.saveas == 'save') {
          console.log(this.saveas);
          setTimeout(() => {
            this.Route.navigate(['/disposal-execution-list']);
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
    if (this.disposalexecutionformModal.invalid) {
      console.log(this.disposalexecutionformModal, 'error');
      this.isValidFormSubmittedModal = true;
      this.isValidbuttonModal = false;
    } else {
      console.log(this.disposalexecutionformModal, 'true');
      this.isValidbuttonModal = true;
      this.disposalexecutionformModal.value.image = this.filedatainput;
      this.disposalexecutionformModal.value.type_id = this.uniqid;
      this.disposalexecutionformModal.value.type = 'CC';
      let formadata = this.disposalexecutionformModal.value;
      this.Attach.submitForm(formadata).subscribe((data: any) => {
        this.ccattachments.push(data);
        console.log(this.ccattachments);
        this.toast.showSuccess('Attachment added.');
        this.disposalexecutionformModal.reset();
        this.closebutton.nativeElement.click();
        this.isValidbuttonModal = false;
      });
    }
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
        window.location.href="disposal-execution-list"
      } else if (result.isDismissed) {
        console.log('Clicked No, File is safe!');
      }
    });
  }
  deleteAttachment(i:any){
    console.log(i)
    this.ccattachments.splice(i, 1);
    console.log(this.ccattachments);
  }
}
