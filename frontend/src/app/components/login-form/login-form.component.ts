import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  loginForm!: FormGroup;
  signupForm!: FormGroup;
  activeTab: 'login' | 'signup' = 'login';
  loginBgGradient = 'linear-gradient(135deg,#f4f7fa,#e9eff5)';

  // Password / OTP Mode toggling
  usePasswordMode = true;
  isOtpSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.usePasswordMode ? [Validators.required, Validators.minLength(4)] : []],
      otp: ['']
    });

    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', this.usePasswordMode ? [Validators.required, Validators.minLength(4)] : []],
      otp: ['']
    });
  }

  setActiveTab(tab: 'login' | 'signup') {
    this.activeTab = tab;
    this.isOtpSent = false;
    this.loginForm.reset();
    this.signupForm.reset();
    this.initForms();
  }

  toggleAuthMode() {
    this.usePasswordMode = !this.usePasswordMode;
    this.isOtpSent = false;
    this.loginForm.reset();
    this.signupForm.reset();
    this.initForms();
    this.toastr.info(this.usePasswordMode ? 'Switched to Password Authentication' : 'Switched to Email OTP Authentication');
  }

  // 1. PASSWORD AUTH SUBMISSION
  submitPasswordAuth(type: 'login' | 'signup') {
    const form = type === 'login' ? this.loginForm : this.signupForm;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const { email, password, fullName, mobileNo } = form.value;

    if (type === 'login') {
      this.authService.loginWithPassword({ email, password }).subscribe({
        next: (res) => {
          this.toastr.success("Login Successful!");
          this.authService.saveToken(res.token);
          this.authService.saveUser(res.user);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error("Login error response:", err);
          let msg = "Login failed";
          if (err.error) {
            if (typeof err.error === 'string') {
              msg = err.error;
            } else if (err.error.message) {
              msg = err.error.message;
            }
          } else if (err.message) {
            msg = err.message;
          }
          
          if (msg.includes("Please Sign Up first") || msg.toLowerCase().includes("user not found")) {
            this.toastr.warning(msg, "Registration Needed");
          } else {
            this.toastr.error(msg);
          }
        }
      });
    } else {
      this.authService.signupWithPassword({ email, fullName, mobileNo, password }).subscribe({
        next: (res) => {
          this.toastr.success("Sign Up & Login Successful!");
          this.authService.saveToken(res.token);
          this.authService.saveUser(res.user);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => this.toastr.error(err.error?.message || "Sign up failed")
      });
    }
  }

  // 2. REQUEST OTP BUTTON
  requestOtp(type: 'login' | 'signup') {
    const form = type === 'login' ? this.loginForm : this.signupForm;
    const email = form.get('email')?.value;
    const fullName = type === 'signup' ? form.get('fullName')?.value : null;
    const mobileNo = type === 'signup' ? form.get('mobileNo')?.value : null;

    if (
      form.get('email')?.invalid ||
      (type === 'signup' && (form.get('fullName')?.invalid || form.get('mobileNo')?.invalid))
    ) {
      form.get('email')?.markAsTouched();
      form.get('fullName')?.markAsTouched();
      form.get('mobileNo')?.markAsTouched();
      return;
    }

    const payload = type === 'signup' ? { email, fullName, mobileNo } : { email };

    this.authService.sendOtp(payload).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.isOtpSent = true;
        form.get('otp')?.setValidators([Validators.required, Validators.minLength(6)]);
        form.get('otp')?.updateValueAndValidity();
      },
      error: (err) => {
        console.error("OTP send error:", err);
        let msg = "Failed to send OTP";
        if (err.error) {
          if (typeof err.error === 'string') {
            msg = err.error;
          } else if (err.error.message) {
            msg = err.error.message;
          }
        } else if (err.message) {
          msg = err.message;
        }

        if (msg.includes("Please Sign Up first") || msg.toLowerCase().includes("user not found")) {
          this.toastr.warning(msg, "Registration Needed");
        } else {
          this.toastr.error(msg);
        }
      }
    });
  }

  // 3. VERIFY & SUBMIT OTP BUTTON
  verifyAndSubmit(type: 'login' | 'signup') {
    const form = type === 'login' ? this.loginForm : this.signupForm;
    if (form.invalid) return;

    const { email, otp } = form.value;

    this.authService.verifyOtp({ email, otp }).subscribe({
      next: (res) => {
        this.toastr.success("Login Successful via OTP!");
        this.authService.saveToken(res.token);
        this.authService.saveUser(res.user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => this.toastr.error(err.error?.message || "Invalid OTP")
    });
  }
}