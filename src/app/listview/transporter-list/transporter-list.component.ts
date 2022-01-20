import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';


import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
import { TranporterserviceService } from 'src/app/service/tranporterservice.service';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-transporter-list',
  templateUrl: './transporter-list.component.html',
  styleUrls: ['./transporter-list.component.css']
})
export class TransporterListComponent implements OnInit {

  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  constructor(private router:Router,private tranporter :TranporterserviceService,
    private users:AuthService,
    private   userservice :UserService ) { }

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
    this.getalltransporter()
  }
  getalltransporter(){
    this.tranporter.getalltransporter().subscribe((data:any)=>{
      this.gridData=data.result
      this.gridView = data.result;
      console.log(data)
    })
  }

  handleEdit(id:any){
    console.log("edit clicked "+id)
    this.router.navigateByUrl('/edit-tranporter', { state: { id } });
  }

  // handleDelete(id:any){

  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.contact.deleteContact(id).subscribe((data:any)=>{
  //         if(data.status===200)
  //           Swal.fire(data.message, '', 'success')
  //         else if(data.status===500)
  //           Swal.fire(data.message, '', 'error')
  //           this.getAccounts()
  //       })

  //     }
  //   })
  // }


    // Swal.fire({
    //   title: 'Are You Sure?',
    //   // showDenyButton: true,
    //   showCancelButton: true,
    //   confirmButtonText: 'Delete',
    //   // denyButtonText: `Don't save`,
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {

    //   } else if (result.isDenied) {
    //     Swal.fire('Changes are not saved', '', 'info')
    //   }
    // })


  public onFilter(e: any): void {
    let inputValue=e.target.value
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "transporter_id",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "transporter_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "gstin",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "pan",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "state",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "first_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "mobile",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "email",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "city",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

}
