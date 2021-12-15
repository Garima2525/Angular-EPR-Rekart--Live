import { Component, OnInit,ViewChild } from '@angular/core';
import { PoService } from '../service/po.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryStateCityService } from '../service/country-state-city.service';
import { StateCityService } from '../service/state-city.service';
import { TosterService } from '../service/toster.service';
import { AuthService } from '../service/auth.service';
import { AttachmentService } from '../service/attachment.service';
import { CustomerService } from '../service/customer.service';
import { FormsModule }   from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-order-po',
  templateUrl: './edit-order-po.component.html',
  styleUrls: ['./edit-order-po.component.css']
})
export class EditOrderPoComponent implements OnInit {
  material_name:any='string';
  po_is_edit: any;

  constructor(
    private poservice:PoService,
    private router:Router,
    private CountryStateCityService: CountryStateCityService,
    private tp: FormBuilder,
    private toast: TosterService,
    private Auth: AuthService,
    private Attach: AttachmentService,
    private _Activatedroute: ActivatedRoute,
    private Cust: CustomerService,
  ) { }

  uniqid: any;
  POform!: FormGroup;
  login_id: any;
  statedata: any;
  districtdata: any;
  saveas: any;
  saveasnew: any;
  material:any;
  isValidFormSubmitted: any;
  isValidbutton: any;
  ccattachments: any = [];
  POformModal!: FormGroup;
  filedatainput: any;
  isValidbuttonModal: any;
  isValidFormSubmittedModal: any;
  remark:any;

  @ViewChild('closebutton')
  closebutton: any;
  pId:any;
  po_id:any;
  materialInfo: any = [];
  Customers: any = [];
  selectedItem: any = [];
  dropdownSettings: any = {};
  closeDropdownSelection = false;
  disabled = false;
  customerdata: any;
  customer_id: any='';
  materialerror: any = [{ material_name :false,state:false,qty:false,targetdate:false,price:false}];
  materialstatus: any = false
  selectedItemtt : any = [];
  ngOnInit(): void {
    this.pId=  this._Activatedroute.snapshot.paramMap.get('id');
    this.Auth.userLoggedIn().subscribe((logindata: any) => {
      console.log(logindata);
      this.login_id = logindata.result._id;
    });
    this.Cust.getcustomer().subscribe((data: any) => {
      console.log(data.result)
      this.Customers = data.result;
    });
   

    this.dropdownSettings = {
      idField: '_id',
      textField: 'organization_name',
      singleSelection: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };
    this.CountryStateCityService.getallstates().subscribe((data: any) => {
      
      this.statedata = data.result;
      
    });

    this.poservice.getpobyid(this.pId).subscribe((data: any) => {
      console.log(data.result[0]);
      this.forminit(data.result[0]);
      this.po_id = data.result[0].PO_id;
      this.po_is_edit = data.result[0].is_edit;
      this.ccattachments =data.result[0].attachments == null? this.ccattachments : data.result[0].attachments;
     this.materialInfo = data.result[0].materials;
      console.log(this.materialInfo);
    this.remark=data.result[0].remark;
    console.log(this.remark);
      console.log(this.materialerror);
      this.selectedItemtt=data.result[0].customer_data
      console.log(this.selectedItemtt);
      this.onItemSelect(data.result[0].customer_data[0])
    });
    

    this.modalforminit();

  }


onItemSelect(item: any) {
    console.log('onItemSelect', item);
    this.customer_id = item._id;
    this.POform.value.customer_id = item._id;
    this.Cust.getcustomerbyid(item._id).subscribe((cdata: any) => {
      console.log(cdata);
      this.customerdata = cdata.result[0];
    });
  }

onchange(e: any, i: any, name: any) {
    if (e.target.value > 0) {
      this.materialInfo[i][name] = e.target.value;
      this.materialInfo[i].sub_total =
        parseInt(this.materialInfo[i].collection_Qty) *
        parseInt(this.materialInfo[i].net_unit_price);
    } else {
      this.materialInfo[i][name] = 0;
      this.materialInfo[i].sub_total =
        parseInt(this.materialInfo[i].collection_Qty) *
        parseInt(this.materialInfo[i].net_unit_price);
    }
    this.materialInfo.map((item: any, i: any) => {
      if (item.material_name == ''|| item.material_name == null )
       this.materialerror[i]['material_name'] =true
    //  else this.materialerror[i]['material_name'] = false;

     if ( item.state == '' || item.state == null )
       this.materialerror[i]['state'] = true;
     else this.materialerror[i]['state'] = false;

      if (item.collection_Qty == 0)
        this.materialerror[i]['qty'] = true;
      else this.materialerror[i]['qty'] = false;

      if (item.target_date == '' || item.target_date == null)
        this.materialerror[i]['targetdate'] = true;
      else this.materialerror[i]['targetdate'] = false;

      if (item.net_unit_price == 0)
        this.materialerror[i]['price'] = true;
      else this.materialerror[i]['price'] = false;
    })
}
  onchangetext(e: any, i: any, name: any) {
    this.materialInfo[i][name] = e.target.value;
   this.materialInfo.map((item: any, i: any) => {
     if (item.material_name == ''|| item.material_name == null )
       this.materialerror[i]['material_name'] =true
     else this.materialerror[i]['material_name'] = false;

     if ( item.state == '' || item.state == null )
       this.materialerror[i]['state'] = true;
     else this.materialerror[i]['state'] = false;

      if (item.collection_Qty == 0)
        this.materialerror[i]['qty'] = true;
      else this.materialerror[i]['qty'] = false;

      if (item.target_date == '' || item.target_date == null)
        this.materialerror[i]['targetdate'] = true;
      else this.materialerror[i]['targetdate'] = false;

      if (item.net_unit_price == 0)
        this.materialerror[i]['price'] = true;
      else this.materialerror[i]['price'] = false;


   });
   console.log(this.materialerror);

  }

  toggleCloseDropdownSelection() {
    this.closeDropdownSelection = !this.closeDropdownSelection;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, {
      closeDropDownOnSelection: this.closeDropdownSelection,
    });
  }

  get f() {
    return this.POform.controls;
  }

  get fm() {
    return this.POformModal.controls;
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
  modalforminit() {
    this.POformModal = this.tp.group({
      type_id: this.uniqid,
      type: 'po',
      document_type: ['', Validators.required],
      document_no: ['', Validators.required],
      image: ['', Validators.required],
      validity: ['', Validators.required],
    });
  }
  onModalFormSubmit() {
    this.isValidFormSubmittedModal = false;
    if (this.POformModal.invalid) {
      console.log(this.POformModal, 'error');
      this.isValidFormSubmittedModal = true;
      this.isValidbuttonModal = false;
    } else {
      console.log(this.POformModal, 'true');
      this.isValidbuttonModal = true;
      this.POformModal.value.image = this.filedatainput;
      this.POformModal.value.type_id = this.uniqid;
      this.POformModal.value.type = 'CC';
      let formadata = this.POformModal.value;
      this.Attach.submitForm(formadata).subscribe((data: any) => {
        this.ccattachments.push(data);
        console.log(this.ccattachments);
        this.toast.showSuccess('Attachment added.');
        this.POformModal.reset();
        this.closebutton.nativeElement.click();
        this.isValidbuttonModal = false;
      });
    }
  }

forminit(podata:any) {
    this.POform = this.tp.group({ 
      PO_id: [podata.PO_id, Validators.required],
      customer_id:podata.customer_id,
      materials:podata.materials,
      remark:podata.remark,
      attachments: '',
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
  getdistrictonload(state: any) {
    console.log(state);
    this.CountryStateCityService.getalldistrictwithstatewise({
      statename: state,
    }).subscribe((data: any) => {
      console.log(data);
      this.districtdata = data.result;
    });
  }
  saveform(svalue: any) {
    if (this.POform.invalid) {
      this.saveas = true;
    } else {
      this.saveas = svalue;
    }
  }
  saveasnewform(savalue: any) {
    if (this.POform.invalid) {
      this.saveasnew = true;
    } else {
      this.saveas = savalue;
    }
  }
  addinfo(e:any) {
    e.preventDefault();
    this.materialInfo.push({
      material_name: '',
      state: null,
      collection_Qty: 0,
      target_date: null,
      net_unit_price: 0,
      sub_total: 0,
    });
    this.materialerror.push({
      material_name: false,
      state: false,
      qty: false,
      targetdate: false,
      price: false,
    });
    console.log(this.materialInfo);
  }
  deleteinfo(e: any, index: any) {
    e.preventDefault();
    this.materialInfo.splice(index, 1);
    this.materialerror.splice(index, 1);
  }

  valueInsert(e: any, name: any, index: any) {
    this.materialInfo[index][name] = e.target.value;
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
        window.location.href="order-list"
      } else if (result.isDismissed) {
        console.log('Clicked No, File is safe!');
      }
    });
  }
  onFormSubmit() {
    this.isValidFormSubmitted = false;
    this.materialInfo.map((item: any, i: any) => {
      if (item.material_name == ''|| item.material_name == null )
       this.materialerror[i]['material_name'] =true
    //  else this.materialerror[i]['material_name'] = false;

     if ( item.state == '' || item.state == null )
       this.materialerror[i]['state'] = true;
    //  else this.materialerror[i]['state'] = false;

      if (item.collection_Qty == 0)
        this.materialerror[i]['qty'] = true;
      // else this.materialerror[i]['qty'] = false;

      if (item.target_date == '' || item.target_date == null)
        this.materialerror[i]['targetdate'] = true;
      // else this.materialerror[i]['targetdate'] = false;

      if (item.net_unit_price == 0)
        this.materialerror[i]['price'] = true;
      // else this.materialerror[i]['price'] = false;
    })
    console.log(this.materialerror,"errormaterial");
    let count=0
    this.materialerror.map((item:any)=>{
      if(item.material_name==true || item.state==true || item.qty==true || item.price==true){
        count++;
      }
    })
    console.log(count)
    if (this.POform.invalid) {
      console.log(this.POform, 'error');
      this.isValidFormSubmitted = true;
      this.isValidbutton = false;
      this.toast.showError('Sorry!, Fields are mandatory.');
    } else {
      console.log(this.POform, 'true');
      this.isValidbutton = true;
      this.POform.value.user_id = this.login_id;
      this.POform.value.attachments = this.ccattachments;
      this.POform.value.customer_id = this.customer_id;
      this.POform.value.materials = this.materialInfo;
      this.POform.value.remark = this.remark;
      if(this.customer_id!='' && this.POform.value.customer_id!='' && count==0){
        console.log(this.POform.value);
        this.poservice.updatepobyid(this.pId,this.POform.value).subscribe((data) => {
          console.log(data);
          this.toast.showSuccess('Congratulation!, PO has been updated.');
          if (this.saveas == 'save') {
            console.log(this.saveas);
            setTimeout(() => {
              this.router.navigate(['/order-list']);
            }, 5000);
          } else {
            console.log(this.saveas);
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          }
        });
      }
      else{
        this.isValidFormSubmitted = true;
        this.isValidbutton = false;
        this.toast.showError('Organisation is required.');
      }


    }
  }
  deleteAttachment(i:any){
    console.log(i)
    this.ccattachments.splice(i, 1);
    console.log(this.ccattachments);
  }
}
