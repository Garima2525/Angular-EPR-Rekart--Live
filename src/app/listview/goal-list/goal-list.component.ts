import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
// import { TargetService } from 'src/app/service/target.service';
import { TargetService } from 'src/app/service/target.service';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.css']
})
export class GoalListComponent implements OnInit {
  [x: string]: any;

  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  constructor(
    private router:Router,private target:TargetService,
    private users:AuthService,
    private   userservice :UserService
    ) { }
  public gridData: any;
  public gridView: any;
  public mySelection: string[] = [];
  user:any
  userPermission:any
  ngOnInit(): void {
    this.users.userLoggedIn().subscribe((user:any)=>{
      console.log(user)
      this.user=user.result
      this.userservice.getrolebyid(user.result.role).subscribe((data:any)=>{
        console.log(data.result[0],'---------->roledta')
        this.userPermission=data.result[0]
      })
    })
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
delete(id:any){
console.log(id,'fdgfd');

// this.collection.splice(data)
this.target.deletetarget(id).subscribe((data)=>{
  console.log('true')
})
}
}
