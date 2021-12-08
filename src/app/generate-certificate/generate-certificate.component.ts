import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';


import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";


@Component({
  selector: 'app-generate-certificate',
  templateUrl: './generate-certificate.component.html',
  styleUrls: ['./generate-certificate.component.css']
})
export class GenerateCertificateComponent implements OnInit {

  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  constructor(private router:Router) { }

  public gridData: any;
  public gridView: any;

  public mySelection: string[] = [];

  public ngOnInit(): void {
  
  }
 
  

 

  public onFilter(e: any): void {
    let inputValue=e.target.value
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "ulb_id",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "ulb_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "mobile_no",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "email",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "first_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "ulb_state",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "ulb_city",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }


}

