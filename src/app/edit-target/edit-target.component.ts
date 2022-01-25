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

  state:any
  uniqid:any
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
  TId:any;
  targetInfoerror:any
  ulbattachments: any = [];
  dataRecord: any=[];
  fromData:any;
  toData:any;
  targetState:any;
  arr:any=[
    {"neworder":0,"oldorder":0,"newcollectedqty":0,"newdisposedqty":0,"oldcollectedqty":0,"olddisposedqty":0},
    {"neworder":0,"oldorder":0,"newcollectedqty":0,"newdisposedqty":0,"oldcollectedqty":0,"olddisposedqty":0},
    {"neworder":0,"oldorder":0,"newcollectedqty":0,"newdisposedqty":0,"oldcollectedqty":0,"olddisposedqty":0},
    {"neworder":0,"oldorder":0,"newcollectedqty":0,"newdisposedqty":0,"oldcollectedqty":0,"olddisposedqty":0},
  ];
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
    this.TId=  this._Activatedroute.snapshot.paramMap.get('id');
  
    
    this.Auth.userLoggedIn().subscribe((logindata: any) => {
      console.log(logindata);
      this.login_id = logindata.result._id;
    });
    this.CountryStateCityService.getallstates().subscribe((data: any) => {
      console.log(data.result);
      this.statedata = data.result;
    });
    this.target.gettargetbyid(this.TId).subscribe((data: any) => {
      console.log(data.result[0],'------------>TargetData');
      this.onformInit(data.result[0])
      this.state = data.result[0].state;
      console.log(this.state);
      this.targetInfo = data.result[0].target_info;
      console.log(this.targetInfo,'sds' );
      this.goalattachments =data.result[0].attachments == null? this.goalattachments : data.result[0].attachments;

    });
    this.modalforminit();

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
    this.targetInfoerror.push({
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
      attachments:'',
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
 

  get fm() {
    return this.goalModalform.controls;
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
      this.targetForm.value.attachments = this.goalattachments;
      console.log(this.targetForm, 'true');
      this.target.targetupdatebyid(this.TId,this.targetForm.value).subscribe((data) => {
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
  deleteAttachment(i:any){
    console.log(i)
    this.goalattachments.splice(i, 1);
    console.log(this.goalattachments);
  }

  getRecords(w:any,Fields:any){
    
    switch (Fields) {
      case 'state':
        this.targetState=w.target.value;
        break;
    
      case 'from':
        this.fromData=w.target.value;
        break;
      
      case 'to':
        this.toData=w.target.value;
        break;  
    }
    
    if(this.targetState!=undefined && this.fromData!=undefined && this.toData!=undefined){
      this.target.getRecordBox({state:this.targetState,from:this.fromData,to:this.toData}).subscribe((getdata:any)=>{
        console.log(getdata);
        this.getMLPMaterial(getdata.data)
      })
    }
    else{
      console.log('false');
      
    }
  }


  getMLPMaterial(getdata:any){
    this.arr=[
      {"neworder":0,"oldorder":0,"newcollectedqty":0,"newdisposedqty":0,"oldcollectedqty":0,"olddisposedqty":0},
      {"neworder":0,"oldorder":0,"newcollectedqty":0,"newdisposedqty":0,"oldcollectedqty":0,"olddisposedqty":0},
      {"neworder":0,"oldorder":0,"newcollectedqty":0,"newdisposedqty":0,"oldcollectedqty":0,"olddisposedqty":0},
      {"neworder":0,"oldorder":0,"newcollectedqty":0,"newdisposedqty":0,"oldcollectedqty":0,"olddisposedqty":0},
    ];
    getdata[0].map((item:any)=>{
      if(item._id=='MLP'){
        this.arr[0].neworder=item.totalAmount
      }
      if(item._id=='Non MLP'){
        this.arr[1].neworder=item.totalAmount
      }
      if(item._id=='Rigid'){
        this.arr[2].neworder=item.totalAmount
      }
      if(item._id=='Flexible'){
        this.arr[3].neworder=item.totalAmount
      }
    })
    getdata[1].map((item:any)=>{
      if(item._id=='MLP'){
        this.arr[0].oldorder=item.totalAmount
      }
      if(item._id=='Non MLP'){
        this.arr[1].oldorder=item.totalAmount
      }
      if(item._id=='Rigid'){
        this.arr[2].oldorder=item.totalAmount
      }
      if(item._id=='Flexible'){
        this.arr[3].oldorder=item.totalAmount
      }
    })
    getdata[2].map((item:any)=>{
      if(item._id=='MLP'){
        this.arr[0].newcollectedqty=item.totalAmount_disposal_material_weight
        this.arr[0].newdisposedqty=item.totalAmount_disposad_qty
      }
      if(item._id=='Non MLP'){
        this.arr[1].newcollectedqty=item.totalAmount_disposal_material_weight
        this.arr[1].newdisposedqty=item.totalAmount_disposad_qty
      }
      if(item._id=='Rigid'){
        this.arr[2].newcollectedqty=item.totalAmount_disposal_material_weight
        this.arr[2].newdisposedqty=item.totalAmount_disposad_qty
      }
      if(item._id=='Flexible'){
        this.arr[3].newcollectedqty=item.totalAmount_disposal_material_weight
        this.arr[3].newdisposedqty=item.totalAmount_disposad_qty
      }
    })
    getdata[3].map((item:any)=>{
      if(item._id=='MLP'){
        this.arr[0].oldcollectedqty=item.totalAmount_disposal_material_weight
        this.arr[0].olddisposedqty=item.totalAmount_disposad_qty
      }
      if(item._id=='Non MLP'){
        this.arr[1].oldcollectedqty=item.totalAmount_disposal_material_weight
        this.arr[1].olddisposedqty=item.totalAmount_disposad_qty
      }
      if(item._id=='Rigid'){
        this.arr[2].oldcollectedqty=item.totalAmount_disposal_material_weight
        this.arr[2].olddisposedqty=item.totalAmount_disposad_qty
      }
      if(item._id=='Flexible'){
        this.arr[3].oldcollectedqty=item.totalAmount_disposal_material_weight
        this.arr[3].olddisposedqty=item.totalAmount_disposad_qty
      }
    })
    
  }

 
 
  fileupload(e: any) {
    console.log(e.target.files[0].type,'ikolkjlkjl');
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
      this.goalModalform.value.type_id = this.uniqid;
      this.goalModalform.value.type = 'CC';
      let formadata = this.goalModalform.value;
      this.Attach.submitForm(formadata).subscribe((data: any) => {
        this.goalattachments.push(data);
        console.log(this.goalattachments);
        this.toast.showSuccess('Attachment added.');
        this.goalModalform.reset();
        this.closebutton.nativeElement.click();
        this.isValidbuttonModal = false;
      });
    }
  }
  modalforminit() {
    this.goalModalform = this.fb.group({
      type_id: this.uniqid,
      type: 'po',
      document_type: ['', Validators.required],
      document_no: ['', Validators.required],
      image: ['', Validators.required],
      validity: ['', Validators.required],
      
    });
  }


  onchangetext(e: any, i: any, name: any) {
    this.targetInfo[i][name] = e.target.value;
   this.targetInfo.map((item: any, i: any) => {
     if (item.material_name == ''|| item.material_name == null )
       this.targetInfoerror[i]['material_name'] =true
     else this.targetInfoerror[i]['material_name'] = false;

     if ( item.state == '' || item.state == null )
       this.targetInfoerror[i]['state'] = true;
     else this.targetInfoerror[i]['state'] = false;

      if (item.collection_Qty == 0)
        this.targetInfoerror[i]['qty'] = true;
      else this.targetInfoerror[i]['qty'] = false;

      if (item.target_date == '' || item.target_date == null)
        this.targetInfoerror[i]['targetdate'] = true;
      else this.targetInfoerror[i]['targetdate'] = false;

      if (item.net_unit_price == 0)
        this.targetInfoerror[i]['price'] = true;
      else this.targetInfoerror[i]['price'] = false;


   });
   console.log(this.targetInfoerror);

  }
}
