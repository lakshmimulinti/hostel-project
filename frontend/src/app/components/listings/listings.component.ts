import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HostelService } from '../../services/hostel.service';
import { ToastrService } from 'ngx-toastr';

interface Amenity {
  icon: string;
}

interface RoomDetail {
  type: string;
  price: number;
  available: number;
  total: number;
}

interface Property {
  id: number;
  name: string;
  logoImage?: string;   // for brand cards like Zolo
  photoImage?: string;  // for actual property photos
  badge?: string;       // e.g. 'Girls', 'EXCLUSIVE'
  verified?: boolean;
  address?: string;
  distanceKm?: number;
  priceDaily?: number;
  priceMonthly?: number;
  foundCount?: number;  // for aggregator cards like "Found 26 properties"
  amenities?: Amenity[];
  moreCount?: number;
  rating?: number;
  totalBeds?: number;
  roomDetails?: RoomDetail[];
}

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {
  isLoading = false;



  selectedCity = 'Hyderabad';
  selectedStayType = 'All Stay Types';
  searchQuery = '';
  sortBy = 'Distance';
  showBanner = true;

  showCityMenu = false;
  showStayTypeMenu = false;

  cities: string[] = ['Hyderabad', 'Bengaluru', 'Chennai', 'Pune', 'Delhi NCR', 'Mumbai'];
  stayTypes: string[] = ['All Stay Types', 'Hostels / PG', 'Service Apartments', 'Rooms', 'Mess / Food'];
  sortOptions: string[] = ['Distance', 'Price: Low to High', 'Price: High to Low', 'Rating'];

  quickFilters = ['Verified Properties', 'AC', 'NON-AC', 'Price', 'Free Amenities'];

  // Real-time dynamic filtering states
  verifiedFilterActive = false;
  acFilterActive = false;
  nonAcFilterActive = false;
  selectedPriceRange: 'all' | 'under5k' | '5k-10k' | 'over10k' = 'all';

  totalCount = 0;
  properties: Property[] = [];       // Filtered & sorted array shown to user
  allProperties: Property[] = [];    // Raw backend array loaded on city select
  selectedHostel: Property | null = null;

  // FAQ Accordion State
  showFaqs = false;
  faqs = [
    { 
      q: 'What is the security deposit for booking a hostel?', 
      a: 'The security deposit generally ranges from 1 to 2 months rent depending on the hostel rules. It is fully refundable upon checkout after completing the notice period.',
      open: false 
    },
    { 
      q: 'Are meals (breakfast, lunch, dinner) included in the price?', 
      a: 'Yes, most of our hostels and PGs include 3-time meals in the monthly rent. You can verify this by checking the food amenity icon (utensils) on the hostel card.',
      open: false 
    },
    { 
      q: 'What is the minimum stay duration and notice period?', 
      a: 'The minimum stay duration is generally 1 month. You need to submit a written or portal notice 30 days before checkout to ensure a complete security deposit refund.',
      open: false 
    },
    { 
      q: 'Can family and friends visit or stay overnight?', 
      a: 'Day visitors are allowed in the common lobby area. Overnight stays for family/friends require prior permission from the hostel warden and may incur nominal guest charges.',
      open: false 
    }
  ];

  toggleFaqSection() {
    this.router.navigate(['/faqs'], { queryParams: { city: this.selectedCity } });
  }

  // Booking Form State
  bookingForm = {
    fullName: '',
    email: '',
    mobileNo: '',
    checkInDate: '',
    roomType: 'Single Share'
  };
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hostelService: HostelService,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Close dropdowns if the click target is not inside a .pill-dropdown wrapper
    if (!target.closest('.pill-dropdown')) {
      this.showCityMenu = false;
      this.showStayTypeMenu = false;
    }
  }

  ngOnInit(): void {
    // Populate user profile info from localStorage if available
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.bookingForm.fullName = user.fullName || '';
        this.bookingForm.email = user.email || '';
        this.bookingForm.mobileNo = user.mobileNo || '';
      } catch (e) {
        console.error('Error reading user data:', e);
      }
    }

    this.route.queryParams.subscribe(params => {
      if (params['city']) {
        this.selectedCity = params['city'];
      }
      if (params['query']) {
        this.searchQuery = params['query'];
      }
      if (params['stayType']) {
        const rawStay = params['stayType'];
        if (rawStay === 'hostels') {
          this.selectedStayType = 'Hostels / PG';
        } else if (rawStay === 'apartments') {
          this.selectedStayType = 'Service Apartments';
        } else if (rawStay.toLowerCase() === 'rooms') {
          this.selectedStayType = 'Rooms';
        } else if (rawStay === 'mess') {
          this.selectedStayType = 'Mess / Food';
        } else {
          this.selectedStayType = rawStay;
        }
      }
      
      this.loadHostels(this.selectedCity);
    });
  }

  loadHostels(city: string) {
    this.isLoading = true;
    this.hostelService.getHostels(city).subscribe({
      next: (res: any) => {
        this.allProperties = (res.hostels || []).map((h: any) => ({
          id: h.id,
          name: h.name,
          badge: h.badge,
          verified: h.verified,
          address: h.address,
          distanceKm: h.distanceKm,
          priceDaily: h.priceDaily,
          priceMonthly: h.priceMonthly,
          photoImage: h.photoImage,
          amenities: (h.amenities || []).map((iconStr: string) => ({ icon: iconStr })),
          moreCount: Math.max(0, (h.amenities || []).length - 3),
          rating: h.rating || 4.2,
          totalBeds: h.totalBeds || 45,
          roomDetails: h.roomDetails || []
        }));
        
        this.applyFiltersAndSort();
        // Slight delay to showcase bottom loading transition beautifully
        setTimeout(() => {
          this.isLoading = false;
        }, 600);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.toastr.error('Failed to load hostels. Please try again.');
      }
    });
  }

  applyFiltersAndSort() {
    let temp = [...this.allProperties];

    // 1. Search Query Filter
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.address && p.address.toLowerCase().includes(q))
      );
    }

    // 2. Stay Type Filter
    if (this.selectedStayType !== 'All Stay Types') {
      if (this.selectedStayType === 'Hostels / PG') {
        temp = temp.filter(p => p.badge === 'Boys' || p.badge === 'Girls' || p.badge === 'Co-Living');
      } else {
        const typeQ = this.selectedStayType.toLowerCase();
        temp = temp.filter(p => p.badge?.toLowerCase().includes(typeQ));
      }
    }

    // 3. Quick Filters
    if (this.verifiedFilterActive) {
      temp = temp.filter(p => p.verified === true);
    }
    if (this.acFilterActive) {
      temp = temp.filter(p => 
        p.amenities?.some(a => a.icon === 'fa-snowflake' || a.icon === 'fa-wind') ||
        p.name.toLowerCase().includes('ac') ||
        p.address?.toLowerCase().includes('ac')
      );
    }
    if (this.nonAcFilterActive) {
      temp = temp.filter(p => 
        !p.amenities?.some(a => a.icon === 'fa-snowflake' || a.icon === 'fa-wind') &&
        !p.name.toLowerCase().includes('ac')
      );
    }
    if (this.selectedPriceRange !== 'all') {
      if (this.selectedPriceRange === 'under5k') {
        temp = temp.filter(p => (p.priceMonthly || 0) < 5000);
      } else if (this.selectedPriceRange === '5k-10k') {
        temp = temp.filter(p => (p.priceMonthly || 0) >= 5000 && (p.priceMonthly || 0) <= 10000);
      } else if (this.selectedPriceRange === 'over10k') {
        temp = temp.filter(p => (p.priceMonthly || 0) > 10000);
      }
    }

    // 4. Sorting Logic
    if (this.sortBy === 'Distance') {
      temp.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else if (this.sortBy === 'Price: Low to High') {
      temp.sort((a, b) => (a.priceMonthly || 0) - (b.priceMonthly || 0));
    } else if (this.sortBy === 'Price: High to Low') {
      temp.sort((a, b) => (b.priceMonthly || 0) - (a.priceMonthly || 0));
    } else if (this.sortBy === 'Rating') {
      temp.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    this.properties = temp;
    this.totalCount = this.properties.length;

    // Maintain select hostel context if possible, or select the first card
    if (this.selectedHostel && this.properties.some(p => p.id === this.selectedHostel?.id)) {
      // Keep it selected
      this.selectedHostel = this.properties.find(p => p.id === this.selectedHostel?.id) || null;
    } else {
      this.selectedHostel = this.properties.length > 0 ? this.properties[0] : null;
    }

    // Auto-update sharing selection in form matching roomDetails
    if (this.selectedHostel && this.selectedHostel.roomDetails && this.selectedHostel.roomDetails.length > 0) {
      // Pick first available or first in array
      const initialRoom = this.selectedHostel.roomDetails.find(r => r.available > 0) || this.selectedHostel.roomDetails[0];
      this.bookingForm.roomType = initialRoom.type;
    }
  }

  toggleCityMenu(event: Event) {
    event.stopPropagation();
    this.showCityMenu = !this.showCityMenu;
    this.showStayTypeMenu = false;
  }

  toggleStayTypeMenu(event: Event) {
    event.stopPropagation();
    this.showStayTypeMenu = !this.showStayTypeMenu;
    this.showCityMenu = false;
  }

  selectCity(city: string) {
    this.selectedCity = city;
    this.showCityMenu = false;
    
    // Reset filters upon changing city to avoid city-specific queries causing empty results
    this.searchQuery = '';
    this.verifiedFilterActive = false;
    this.acFilterActive = false;
    this.nonAcFilterActive = false;
    this.selectedPriceRange = 'all';
    this.selectedStayType = 'All Stay Types';

    // Sync URL query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { city: this.selectedCity, query: null, stayType: null },
      queryParamsHandling: 'merge'
    });

    this.loadHostels(city);
  }

  selectStayType(type: string) {
    this.selectedStayType = type;
    this.showStayTypeMenu = false;
    this.applyFiltersAndSort();
  }

  toggleQuickFilter(filter: string) {
    if (filter === 'Verified Properties') {
      this.verifiedFilterActive = !this.verifiedFilterActive;
    } else if (filter === 'AC') {
      this.acFilterActive = !this.acFilterActive;
      if (this.acFilterActive) {
        this.nonAcFilterActive = false;
      }
    } else if (filter === 'NON-AC') {
      this.nonAcFilterActive = !this.nonAcFilterActive;
      if (this.nonAcFilterActive) {
        this.acFilterActive = false;
      }
    } else if (filter === 'Price') {
      // Cycles pricing ranges
      if (this.selectedPriceRange === 'all') {
        this.selectedPriceRange = 'under5k';
      } else if (this.selectedPriceRange === 'under5k') {
        this.selectedPriceRange = '5k-10k';
      } else if (this.selectedPriceRange === '5k-10k') {
        this.selectedPriceRange = 'over10k';
      } else {
        this.selectedPriceRange = 'all';
      }
    }
    this.applyFiltersAndSort();
  }

  onSearch() {
    this.applyFiltersAndSort();
  }

  closeBanner() {
    this.showBanner = false;
  }

  selectHostel(property: Property) {
    this.selectedHostel = property;
    if (property.roomDetails && property.roomDetails.length > 0) {
      const initialRoom = property.roomDetails.find(r => r.available > 0) || property.roomDetails[0];
      this.bookingForm.roomType = initialRoom.type;
    }

    // Scroll smoothly to form on mobile view if selected
    const formEl = document.getElementById('booking-form-section');
    if (formEl && window.innerWidth < 992) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  selectRoomType(type: string) {
    this.bookingForm.roomType = type;
  }

  getCurrentSelectedRoomPrice(): number {
    if (!this.selectedHostel || !this.selectedHostel.roomDetails) return 0;
    const rDetail = this.selectedHostel.roomDetails.find(r => r.type === this.bookingForm.roomType);
    return rDetail ? rDetail.price : (this.selectedHostel.priceMonthly || 0);
  }

  submitBooking() {
    if (!this.selectedHostel) {
      this.toastr.warning('Please select a hostel first from the left side.');
      return;
    }

    if (!this.bookingForm.fullName.trim() || 
        !this.bookingForm.email.trim() || 
        !this.bookingForm.mobileNo.trim() || 
        !this.bookingForm.checkInDate || 
        !this.bookingForm.roomType) {
      this.toastr.warning('Please fill in all booking details.');
      return;
    }

    const bookingData = {
      hostelId: this.selectedHostel.id,
      hostelName: this.selectedHostel.name,
      hostelAddress: this.selectedHostel.address,
      fullName: this.bookingForm.fullName,
      email: this.bookingForm.email,
      mobileNo: this.bookingForm.mobileNo,
      checkInDate: this.bookingForm.checkInDate,
      roomType: this.bookingForm.roomType,
      price: this.getCurrentSelectedRoomPrice()
    };

    // Navigate to secure payment component page with booking session payload
    this.router.navigate(['/payment'], { state: { bookingData } });
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}