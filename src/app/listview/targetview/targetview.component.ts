import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';

import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TargetService } from 'src/app/service/target.service';
@Component({
  selector: 'app-targetview',
  templateUrl: './targetview.component.html',
  styleUrls: ['./targetview.component.css']
})
export class TargetviewComponent implements OnInit {

  targetId:any;
  targetdata:any;
  
  constructor(private fb: FormBuilder, private targetService:TargetService,
    private router:Router,
    private Route: Router,
   
    private _Activatedroute: ActivatedRoute,
   
    ) {}
    public gridData: any;
  public gridView: any;
  addroleform!: FormGroup;
  isValidFormSubmitted:any;

dataItem:any;
dataname:any;
dataduration:any;
  ngOnInit(): void {
   this.targetId = this._Activatedroute.snapshot.paramMap.get('id');
   this.targetService.gettargetbyid(this.targetId).subscribe((data:any)=>{
      console.log(data);
      this.dataItem=data.result[0].target_info;
      this.dataname=data.result[0].target_name;
      this.dataduration=data.result[0].target_duration;
    });
    // this.gettargetbyid();
  }
    
  // gettargetbyid(){
  //   this.targetService.getalltarget().subscribe((data:any)=>{
  //     // this.gridData=data.result
  //     // this.gridView = data.result;
  //     console.log(data)
  //   })
  // }
  
  
 
}
