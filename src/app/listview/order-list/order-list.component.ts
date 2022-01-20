import { Component, ElementRef, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoService } from 'src/app/service/po.service';
import { EncrDecrService } from 'src/app/service/encr-decr-service.service';
import { CustomerService } from 'src/app/service/customer.service';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  @ViewChild('myModal')
  myModal!: { nativeElement: { className: string } };
  constructor(
    private router: Router,
    private order: PoService,
    private EncrDecr: EncrDecrService,
    private Cust:CustomerService,
    private users:AuthService,
    private   userservice :UserService
  ) {}

  podata: any;
  Customers:any;
  public mySelection: string[] = [];
  searchText:any;
  searchTextor:any;
  user:any
  userPermission:any
  public ngOnInit(): void {

    this.users.userLoggedIn().subscribe((user:any)=>{
      console.log(user)
      this.user=user.result
      this.userservice.getrolebyid(user.result.role).subscribe((data:any)=>{
        console.log(data.result[0],'---------->Roledata')
        this.userPermission=data.result[0]
      })
    })



    this.getallpo();
    localStorage.setItem('allotment', '');
  }
  getallpo() {
    this.order.getallpo().subscribe((data: any) => {
      console.log(data.result);
      this.podata = data.result;
    });
    this.Cust.getcustomer().subscribe((data: any) => {
      // console.log(data)
      this.Customers = data.result;
    });
  }

  handleEdit(id: any) {
    console.log('edit clicked ' + id);
    this.router.navigateByUrl('/edit-contact', { state: { id } });
  }
 
  getAllotment(POid: any, materialAllot: any, weight: any) {
    console.log(POid, materialAllot, weight);
    let allot = { POid: POid, materialAllot: materialAllot, weight: weight };
    // var encrypted = this.EncrDecr.set(allot);
    // console.log(encrypted)
    localStorage.setItem('allotment', JSON.stringify(allot));
    this.router.navigate(['./order-allotment', POid]);
  }
  convertintonumber(num: any) {
    return parseFloat(num);
  }
}

