import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
// import { TargetService } from 'src/app/service/target.service';
import { TargetService } from 'src/app/service/target.service';
@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.css']
})
export class GoalListComponent implements OnInit {

  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  constructor(private router:Router,private target:TargetService) { }
  public gridData: any;
  public gridView: any;
  public mySelection: string[] = [];
  ngOnInit(): void {
    this.getalltarget()
  }
  getalltarget(){
    this.target.getalltarget().subscribe((data:any)=>{
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
            field: "target_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "target_duration",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "created_at",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "state",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

}
