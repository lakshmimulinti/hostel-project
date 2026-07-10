import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HostelService } from '../../services/hostel.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {

  bookingData: any = null;

  // Payment State
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'arrival' = 'upi';
  upiMethod: 'phonepe' | 'gpay' | 'paytm' | 'upi_id' = 'phonepe';
  upiIdInput = '';
  cardDetails = {
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  };
  isPaymentProcessing = false;
  paymentSuccess = false;

  constructor(
    private router: Router,
    private hostelService: HostelService,
    private toastr: ToastrService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.bookingData = navigation.extras.state['bookingData'];
    }
  }

  ngOnInit(): void {
    if (!this.bookingData) {
      this.toastr.warning('No active booking details found. Redirecting...');
      this.router.navigate(['/listings']);
    }
  }

  setPaymentMethod(method: 'upi' | 'card' | 'netbanking' | 'arrival') {
    this.paymentMethod = method;
  }

  setUpiMethod(method: 'phonepe' | 'gpay' | 'paytm' | 'upi_id') {
    this.upiMethod = method;
  }

  cancelPayment() {
    this.router.navigate(['/listings']);
  }

  processPayment() {
    if (this.paymentMethod === 'upi' && this.upiMethod === 'upi_id' && !this.upiIdInput.trim()) {
      this.toastr.warning('Please enter your UPI ID');
      return;
    }
    if (this.paymentMethod === 'card') {
      if (!this.cardDetails.number || !this.cardDetails.expiry || !this.cardDetails.cvv || !this.cardDetails.name) {
        this.toastr.warning('Please fill all Card Details');
        return;
      }
    }

    this.isPaymentProcessing = true;

    // Simulate payment transaction loader (2 seconds delay)
    setTimeout(() => {
      this.paymentSuccess = true;
      
      const payload = {
        hostelId: this.bookingData.hostelId,
        fullName: this.bookingData.fullName,
        email: this.bookingData.email,
        mobileNo: this.bookingData.mobileNo,
        checkInDate: this.bookingData.checkInDate,
        roomType: this.bookingData.roomType
      };

      this.hostelService.bookHostel(payload).subscribe({
        next: (res: any) => {
          this.isPaymentProcessing = false;
          this.toastr.success('Payment Received & Hostel Booked Successfully!');
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (err: any) => {
          this.isPaymentProcessing = false;
          this.paymentSuccess = false;
          this.toastr.error(err.error?.message || 'Booking failed during registration.');
        }
      });
    }, 2000);
  }
}
