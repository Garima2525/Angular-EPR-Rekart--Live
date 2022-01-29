import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
// import { TargetService } from 'src/app/service/target.service';
import { TargetService } from 'src/app/service/target.service';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { TosterService } from 'src/app/service/toster.service';
import Swal from 'sweetalert2';
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
    private   userservice :UserService,
    private toseter:TosterService
    ) { }
  public gridData: any;
  public gridView: any;
  public mySelection: string[] = [];
  user:any;
  target_name:any
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
  delete(id:any):void{
    // if (confirm('Are you sure to delete this record ? ')) {
    //   this.target.deletetarget(id).subscribe((data: any) => {
    //     console.log(data,'lll');
        
    //     this.Toaster.showSuccess(
    //       'Deleted'
          
    //     );
    //     window.location.reload();
              
    //         });
    //       }
    Swal.fire({
    
      text: 'Are you sure you want to deleted?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.target.deletetarget(id).subscribe((data: any) => {
          console.log(data,'lll');
          
          this.Toaster.showSuccess(
            'Deleted'
            
          );
          window.location.reload();
                
              });
    
        console.log('Clicked Yes, File deleted!');
        window.location.href="goal-list"
      } else if (result.isDismissed) {
        console.log('Clicked No, File is safe!');
      }
    }); 
 }
     
 
}

