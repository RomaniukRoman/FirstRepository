import { Component, OnInit } from '@angular/core';
import { PaymentDetailService } from 'src/app/shared/payment-detail.service';
import { PaymentDetail } from 'src/app/shared/payment-detail.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-detail-list',
  templateUrl: './payment-detail-list.component.html',
  styles: []
})
export class PaymentDetailListComponent implements OnInit {

  constructor( readonly paymentDetailService: PaymentDetailService,
               private toasterService: ToastrService) { }

  ngOnInit() {
    this.paymentDetailService.refreshPaymentDetailsList();
  }

  populateForm(pd: PaymentDetail) {
    this.paymentDetailService.formData = Object.assign({}, pd);
  }

  onDelete(id: number) {
    if (confirm('A you sure to delete this record ?')) {
      this.paymentDetailService.deletePaymentDetail(id)
        .subscribe(() => {
          this.paymentDetailService.refreshPaymentDetailsList();
          this.toasterService.warning('Deleted successfully', 'Peyment Detail Register');
        });
    }
  }
}
