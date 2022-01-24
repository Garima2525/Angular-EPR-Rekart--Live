import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import {DisposalExecutionService} from 'src/app/service/disposal-execution.service'
@Component({
  selector: 'app-disposal-execution-list',
  templateUrl: './disposal-execution-list.component.html',
  styleUrls: ['./disposal-execution-list.component.css']
})
export class DisposalExecutionListComponent implements OnInit {

  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  constructor(
    private router:Router,private disposalexecution:DisposalExecutionService,
    private users:AuthService,
    private   userservice :UserService) { }

  public gridData: any;
  public gridView: any;

  public mySelection: string[] = [];
  user:any
  userPermission:any
  public ngOnInit(): void {
    this.users.userLoggedIn().subscribe((user:any)=>{
      console.log(user)
      this.user=user.result
      this.userservice.getrolebyid(user.result.role).subscribe((data:any)=>{
        console.log(data.result[0],'Roledata')
        this.userPermission=data.result[0]
      })
    })
    this.getalldisposalexecution()
  }
  getalldisposalexecution(){
    this.disposalexecution.getalldisposalexecution().subscribe((data:any)=>{
      this.gridData=data.result
      this.gridView = data.result;
      console.log(data)
    })
  }

  handleEdit(id:any){
    console.log("edit clicked "+id)
    this.router.navigateByUrl('/edit-contact',{state:{id}})
  }

 
  

  public onFilter(e: any): void {
    let inputValue=e.target.value
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "material_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "state",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "city",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "created_at",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "ulb_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "emcollection_center_nameail",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "disposal_company_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "transporter_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "mobile_no",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "vehicle_no",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "driver_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "collection_material_weight",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "disposal_material_weight",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "disposal_date_time",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "collection_date_time",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "disposal_date_time",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "disposal_material_weight",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

}
