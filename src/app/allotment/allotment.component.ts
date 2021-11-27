import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncrDecrService } from '../service/encr-decr-service.service';
import { AllotmentService } from '../service/allotment.service';
import { TosterService } from '../service/toster.service';

@Component({
  selector: 'app-allotment',
  templateUrl: './allotment.component.html',
  styleUrls: ['./allotment.component.css'],
})
export class AllotmentComponent implements OnInit {
  numbers = ["Yes","No"]
  disId: any;
  podata: any;
  materialPO: any;
  allPO: any;
  allotmentstate: any = false;
  disposalallotment: any = [];
  textreadonly: any = [];
  disposalqtyarr: any = [];
  sumqtyval: any = 0;
  collectionQty: any;
  achievedQty: any;
  allotmentStatus: any;
  bucket: any = [];
  disposalIdArr: any = [];
  materialwisetotalqty: any = 0;
  poMaterialId: any;
  mainDisExcArr: any = [];
  AchievedQtyArr: any = [];
  totalmaterialqty: any;
  totalmaterialqtyachieved: any;
  totalbalances: any;
  activeAllotment:any=true;
  setQty: any=[];
  constructor(
    private _Activatedroute: ActivatedRoute,
    private EncrDecr: EncrDecrService,
    private Allotserver: AllotmentService,
    private Toaster: TosterService
  ) {}

  ngOnInit(): void {
    this.disId = this._Activatedroute.snapshot.paramMap.get('id');
    this.podata = localStorage.getItem('allotment');
    this.podata = JSON.parse(this.podata);
    console.log(this.podata, this.disId);
    if (this.disId == this.podata.POid) {
      console.log('yes');
      let reqdata = {
        _id: this.podata.POid,
        material: this.podata.materialAllot,
      };
      this.Allotserver.getPodataforallotment(reqdata).subscribe(
        (podata: any) => {
          console.log(podata);
          this.materialPO = podata.materialdata;
          this.allPO = podata.podata[0];
          this.materialPO.map((iten: any) => {
            this.materialwisetotalqty += iten.achieved_qty;
          });
          this.allPO.record.map((iten: any) => {
            if(iten.material[0]===this.podata.materialAllot){
              this.totalmaterialqty = iten.qty;
              this.totalmaterialqtyachieved = iten.achieved?iten.achieved:0;
              this.totalbalances=parseInt(this.totalmaterialqty)-parseInt(this.totalmaterialqtyachieved);
            }
            
          });
        }
      );
    } else {
      window.history.back();
    }
  }

  getallotmentstatewise(
    pordermaterialid: any,
    pomaterial: any,
    state: any,
    collection_Qty: any,
    achieved_qties: any
  ) {
    let ddata = { state: state, material_name: pomaterial };
    this.allotmentstate = state;
    this.Allotserver.getDisposal(ddata).subscribe((disposeddata: any) => {
      console.log(disposeddata.podata);
      this.disposalallotment = disposeddata.podata;
      if (this.disposalallotment.length != 0) {
        this.disposalallotment.map((item: any, i: any) => {
          this.textreadonly[i] = false;
          this.disposalqtyarr[i] = item.disposad_qty;
          this.bucket[i] = 'partial';
          this.disposalIdArr[i] = item._id;
          this.AchievedQtyArr[i] = item.disposad_qty;
          this.setQty[i] = 0;
        });
        
        this.collectionQty = collection_Qty;
        this.achievedQty = achieved_qties;
        this.poMaterialId = pordermaterialid;
      } else {
        this.sumqtyval = 0;
      }

      console.log(this.textreadonly);
    });
  }

  checkdisposedvalue(event: any, qty: any, i: any, allqty: any) {
    let dval = parseInt(event.target.value);
    let balqty=parseInt(qty)-parseInt(allqty)
    if (dval <= balqty) {
      console.log(dval,balqty,'in range')
      event.target.value = dval;
      // this.disposalqtyarr[i] = dval;
      this.setQty[i] = dval;
    } else {
      console.log(dval,balqty,'out of range')
      event.target.value = 0;
      // this.disposalqtyarr[i] = 0;
      this.setQty[i] = 0;
    }
    this.sumqty();
    this.activeAllotment=false;
  }
  getbucket(e: any, i: any, qqty: any) {
    console.log(e.target.value, i);

    if (e.target.value == 'full') {
      this.disposalqtyarr[i] = qqty;
      this.textreadonly[i] = true;
    } else {
      this.disposalqtyarr[i] = 0;
      this.textreadonly[i] = false;
    }
    this.bucket[i] = e.target.value;
    this.sumqty();
  }

  sumqty() {
    let sval = 0;
    this.setQty.map((item: any) => {
      sval += parseInt(item);
    });
    this.sumqtyval = sval;
  }

  allotment() {
    this.sumqty();
    let totalalloted = parseInt(this.achievedQty) + parseInt(this.sumqtyval);
    console.log(this.achievedQty,this.sumqtyval,this.collectionQty,this.materialwisetotalqty , totalalloted);
    
    if (this.sumqtyval == 0) {
      this.allotmentStatus = false;
      console.log(this.allotmentStatus, 'sum of value is 0');
      this.Toaster.showError('Total value is Null');
    } else if (this.collectionQty < totalalloted) {
      this.allotmentStatus = false;
      console.log(
        this.allotmentStatus,
        this.collectionQty,
        totalalloted,
        'sum of value'
      );
      this.Toaster.showError('Invalid Quantity');
    } else {
      this.allotmentStatus = true;
      this.disposalIdArr.map((item: any, i: any) => {
        this.mainDisExcArr.push({
          _id: item,
          disposed_status: this.bucket[i],
          disposad_qty:
            parseInt(this.disposalqtyarr[i]) + parseInt(this.setQty[i]),
        });
      });
      let podata = {
        _id: this.disId,
        achieved: totalalloted,
        material: this.podata.materialAllot,
      };
      let pomaterialdata = {
        _id: this.poMaterialId,
        state: this.allotmentstate,
        achieved_Qty: totalalloted,
        material: this.podata.materialAllot,
      };
      console.log([
        podata,
        pomaterialdata,
        this.mainDisExcArr,
        this.AchievedQtyArr,
      ],"success");
      this.Allotserver.AllotmentPO([
        podata,
        pomaterialdata,
        this.mainDisExcArr,
      ]).subscribe((result: any) => {
        this.Toaster.showSuccess('Allotment Saved.');
        // setTimeout(() => {
        //   window.location.reload();
        // }, 5000);
      });
    }
  }
}
