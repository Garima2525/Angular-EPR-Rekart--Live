import { Component, OnInit , ViewChild } from '@angular/core';
import { DisposalserviceService } from '../service/disposalservice.service'

import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { CountryStateCityService } from '../service/country-state-city.service';
import { StateCityService } from '../service/state-city.service';
import { TosterService } from '../service/toster.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { AttachmentService } from '../service/attachment.service';
import {DisposalExecutionService} from '../service/disposal-execution.service';
import { UlbserviceService } from '../service/ulbservice.service';
import { CollectioncenterserviceService } from '../service/collectioncenterservice.service';
import Swal from 'sweetalert2';
import { TranporterserviceService } from '../service/tranporterservice.service';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-disposal-execution',
  templateUrl: './disposal-execution.component.html',
  styleUrls: ['./disposal-execution.component.css']
})
export class DisposalExecutionComponent implements OnInit {
  
  disabled = false;
  uniqid: any;
  disposalexecutionform!: FormGroup;
  login_id: any;
  statedata: any;
  currentUser:any
  users:any
  districtdata: any;
  saveas: any;
  saveasnew: any;
  transporter_id: any='';
  todayDate:any;
  isValidFormSubmitted: any;
  isValidbutton: any;
  OwnerId:any
  Owner:any
  dropdownSettings: any = {};
  selectedUser:any
  ownerDropdownSettings={}
  ccattachments: any = [];
  disposalexecutionformModal!: FormGroup;
  filedatainput: any;
  isValidbuttonModal: any;
  isValidFormSubmittedModal: any;
  @ViewChild('closebutton')
  closebutton: any;
ammountInfo:any=[{
    amount:null,
    expenditure_type:null,
    receipt_no:null

  }]
  collectiondata: any;
  ULBdata: any;
  DISdata: any;
  transporterdata:any
  constructor(
    private disposalexecution: DisposalExecutionService,
    private CountryStateCityService: CountryStateCityService,
    private cd: FormBuilder,
    private toast: TosterService,
    private Auth: AuthService,
    private Route: Router,
    private Attach: AttachmentService,
    private DisposalS: DisposalserviceService,
    private ULB:UlbserviceService,
    private CC:CollectioncenterserviceService,
    private transporter:TranporterserviceService,
    private user:UserService
  ) {
   
   }

  ngOnInit(): void {
    this.todayDate = new Date();
    this.Auth.userLoggedIn().subscribe((logindata:any)=>{
      console.log(logindata);
      // this.login_id=logindata.result._id

      this.currentUser=logindata.result.username
      console.log(this.currentUser,'user');
      
      this.login_id=logindata.result._id
      this.selectedUser=[logindata.result]
    })
    this.CountryStateCityService.getallstates().subscribe((data: any) => {
      // console.log(data.result);
      this.statedata = data.result;
    });
    this.CC.getallcollection().subscribe((CCdata:any)=>{
      // console.log(CCdata);
      this.collectiondata=CCdata.result;
    })
    this.ULB.getallulb().subscribe((ULBdatas: any) => {
      // console.log(ULBdatas);
      this.ULBdata = ULBdatas.result;
    });
    this.DisposalS.getalldisposal().subscribe((Disdatas: any) => {
      // console.log(Disdatas);
      this.DISdata = Disdatas.result;
    });

    this.transporter.getalltransporter().subscribe((data: any) => {
      console.log(data.result);

      this.transporterdata = data.result;
    });
    this.ownerDropdownSettings={
      singleSelection: true,
      idField: '_id',
      textField: 'username',
      noDataAvailablePlaceholderText:'No User Found!',
      closeDropDownOnSelection:true,
      allowSearchFilter: false
    }
    this.dropdownSettings = {
      idField: '_id',
      textField: 'transporter_name',
      singleSelection: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };
    this.forminit();
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
deleteinfo(e:any,index:any){
  e.preventDefault()
  this.ammountInfo.splice(index,1)

}
valueInsert(e:any,name:any,index:any){
this.ammountInfo[index][name]=e.target.value

}
forminit() {
  this.disposalexecutionform = this.cd.group({
    material_name:['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    ulb:['', Validators.required],
    collection_center:['', Validators.required],
    disposal_facility_pwpf:['', Validators.required],
    // transporter_id:['', Validators.required],
    transporter_name:['', Validators.required],
    mobile_no:['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
    vehicle_no:['', Validators.required],
    driver_name:['', Validators.required],
    driver_mobile_no:['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
    bill_t_no:['', Validators.required],
    e_way_bill:['', Validators.required],
    invoice_no:['', Validators.required],
    payment:'',
    collection_date_time:['', Validators.required],
    collection_material_weight:['', Validators.required],
    collection_remark:'',
    disposal_date_time:['', Validators.required],
    disposal_material_weight:['', Validators.required],
    disposal_remark:'',
    attachments:'',
    created_by:[this.currentUser, Validators.required],
  });
}
modalforminit() {
  this.disposalexecutionformModal = this.cd.group({
    type_id: this.uniqid,
    type: 'disposal',
    document_type: ['', Validators.required],
    document_no: ['', Validators.required],
    image: ['', Validators.required],
    // validity: ['', Validators.required],
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
saveasnewform(savalue: any) {
  if (this.disposalexecutionform.invalid) {
    this.saveasnew = true;
  } else {
    this.saveas = savalue;
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
    this.disposalexecutionform.value.created_by=this.currentUser;
    
    this.disposalexecutionform.value.transporter_id = this.transporter_id;
    this.disposalexecution.submitForm(this.disposalexecutionform.value).subscribe((data) => {
      console.log(data);
      this.toast.showSuccess(
        'Congratulation!, Collection & Disposal Execution has been created.'
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
handleFilter(value:any) {
  this.transporterdata = this.transporterdata.filter((s:any) => s.text.toLowerCase().indexOf(value.toLowerCase()) !== -1);
}
deleteAttachment(i:any){
  console.log(i)
  this.ccattachments.splice(i, 1);
  console.log(this.ccattachments);
}
handleOwnerChange(e:any){
  console.log(e)
  this.Owner=e.username
  this.OwnerId=e._id

}
onItemSelect(item: any) {
  console.log('onItemSelect', item);
  this.transporter_id = item._id;
  this.disposalexecutionform.value.customer_id = item._id;
  this.transporter.getTransporterById(item._id).subscribe((cdata: any) => {
    console.log(cdata);
    this.transporterdata = cdata.result[0];
  });
}
}
