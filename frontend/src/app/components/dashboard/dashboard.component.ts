import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface FilterTab {
  key: string;
  label: string;
}

interface HeroSlide {
  title: string;
  highlight: string;
  subtitle: string;
  image: string;
  overlayColor: string;
}
interface LifeTab {
  key: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  image: string;
}
interface Amenity {
  icon: string;
  label: string;
}

interface PresenceStat {
  icon: string;
  value: string;
  label: string;
}

interface Testimonial {
  name: string;
  role: string;
  rating: number;
  quote: string;
  image: string;
  initial: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  userName = 'User';
  selectedCity = 'Select City';
  showCityMenu = false;
  showProfileMenu = false;
  currentSlide = 0;
  activeLifeTab = 'community';
currentTestimonialSlide = 0;
isTestimonialPaused = false;
private testimonialTimer: any;
  private slideTimer: any;

  showHelpMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router,
     private elementRef: ElementRef
  ) {}

  cities: string[] = ['Hyderabad', 'Bengaluru', 'Chennai', 'Pune', 'Delhi NCR', 'Mumbai'];

  filterTabs: FilterTab[] = [
    { key: 'hostels', label: 'Hostels / PG' },
    { key: 'apartments', label: 'Service Apartments' },
    { key: 'rooms', label: 'Rooms' },
    { key: 'mess', label: 'Mess / Food' }
  ];

  activeFilter = 'hostels';
  searchQuery = '';


  // ---- HERO SLIDER ----
 heroSlides: HeroSlide[] = [
  {
    title: 'HostelHub,',
    highlight: "It's a Community",
    subtitle: 'Find your family away from home — comfortable rooms, verified hosts, and a community that feels like family.',
    image: 'https://www.alameenhostels.com/_next/image?url=%2Fimages%2Fh1.png&w=3840&q=75',
    overlayColor: 'rgba(15, 30, 60, 0.55)'
  },
  {
    title: 'Modern Stays,',
    highlight: 'Built for City Life',
    subtitle: 'Sleek, secure apartment-style hostels in the heart of the city — designed for comfort and convenience.',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/057/564/594/small/stunning-minimalist-urban-apartment-building-facade-night-view-transparent-background-professional-png.png',
    overlayColor: 'rgba(20, 40, 70, 0.6)'
  },
  {
    title: 'Book in Minutes,',
    highlight: 'Move in Same Day',
    subtitle: 'Instant booking with flexible stay durations, verified listings, and zero brokerage.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqK5K_xPZ6AnEqUJ_nlct1OseBiyvwu5nb9hrjcIr5pPZGHWvygAhlkh5f&s=10',
    overlayColor: 'rgba(10, 25, 50, 0.6)'
  }
];
lifeTabs: LifeTab[] = [
  {
    key: 'community',
    label: 'Community',
    icon: 'fa-users',
    title: 'Community',
    description: 'Live with people from different cities and backgrounds. Make friends who feel like family, share meals, and grow together.',
    image: 'https://www.graduateprogram.org/wp-content/uploads/2024/01/Jan-25-What-Is-a-Professional-Learning-Community-resize.jpg'
  },
  {
    key: 'comfort',
    label: 'Comfortable Living',
    icon: 'fa-bed',
    title: 'Comfortable Living',
    description: 'Clean rooms, reliable Wi-Fi, housekeeping, and all the essentials — so you can focus on what matters most.',
    image: 'https://www.shutterstock.com/image-photo/beautiful-asian-woman-relaxing-comfortable-260nw-2739881921.jpg'
  },
  {
    key: 'events',
    label: 'Events',
    icon: 'fa-birthday-cake',
    title: 'Events',
    description: "We celebrate birthdays, festivals and weekends. Regular parties and get togethers to make sure we don't miss out the fun.",
    image: 'https://www.sotc.in/blog/wp-content/uploads/2026/03/holi-indian-colour-festival-concept-1.webp'
  }
];

testimonials: Testimonial[] = [
  {
    name: 'Sachin Gupta',
    role: 'Verified Tenant',
    rating: 5,
    quote: "Been using PgDekho for 2 years now — first for myself, then helped 3 of my colleagues find PGs too. The owner contact feature is direct and transparent. Genuinely the best platform out there.",
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80',
    initial: 'S'
  },
  {
    name: 'Priya Sharma',
    role: 'Verified Tenant',
    rating: 5,
    quote: "As a girl moving to a new city alone, safety was my top priority. Found a ladies-only PG with all the details I needed upfront — location, food, rules — without any pressure from agents. Felt so much more in control.",
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
    initial: 'P'
  },
  {
    name: 'Rahul Tiwari',
    role: 'Verified Tenant',
    rating: 5,
    quote: "Student budget, big expectations — PgDekho delivered. Found a clean single room near my college under ₹7k. The photos were honest and the owner was genuinely helpful. Would 100% recommend to every fresher.",
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&q=80',
    initial: 'R'
  },
  {
    name: 'Ananya Reddy',
    role: 'Verified Tenant',
    rating: 5,
    quote: "Relocated for a new job and needed a place within a week. PgDekho's filters made it so easy to shortlist verified PGs near my office. Zero brokerage was the cherry on top.",
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    initial: 'A'
  },
  {
    name: 'Karthik Iyer',
    role: 'Verified Tenant',
    rating: 5,
    quote: "The mess/food filter saved me — I could see actual menus before booking. Small detail but it made a huge difference for my daily routine.",
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    initial: 'K'
  },
  {
    name: 'Meera Nair',
    role: 'Verified Tenant',
    rating: 5,
    quote: "Switched PGs twice using PgDekho and both times the listing photos matched reality exactly. That honesty is rare and it's why I keep coming back.",
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    initial: 'M'
  }
];


amenities: Amenity[] = [
  { icon: 'fa-wifi', label: 'High Speed Internet' },
  { icon: 'fa-coffee', label: 'Breakfast' },
  { icon: 'fa-user-shield', label: '24x7 Security' },
  { icon: 'fa-spray-can', label: 'Regular Cleaning' },
  { icon: 'fa-plug', label: '24x7 Power Backup' },
  { icon: 'fa-motorcycle', label: '2-Wheeler Parking' },
  { icon: 'fa-couch', label: 'Fully Furnished' },
  { icon: 'fa-bed', label: 'Spotless Linen' }
];

presenceStats: PresenceStat[] = [
  { icon: 'fa-building', value: '23,194', label: 'Properties' },
  { icon: 'fa-bed', value: '7,79,790', label: 'Beds' },
  { icon: 'fa-city', value: '352', label: 'Cities' },
  { icon: 'fa-users', value: '5,05,447', label: 'Users' },
  { icon: 'fa-calendar-alt', value: '10,66,118', label: 'Total Stay Days' }
];
  

  ngOnInit(): void {
    const user = this.authService.getUser?.();
    if (user?.fullName) {
      this.userName = user.fullName;
    }
    this.startAutoSlide();
    this.testimonialTimer = setInterval(() => this.nextTestimonialSlide(), 5000);
  }

  ngOnDestroy(): void {
    if (this.slideTimer) clearInterval(this.slideTimer);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.city-dropdown')) {
      this.showCityMenu = false;
    }
    if (!target.closest('.help-dropdown')) {
      this.showHelpMenu = false;
    }
    if (!target.closest('.profile-dropdown')) {
      this.showProfileMenu = false;
    }
  }
  startAutoSlide() {
    this.slideTimer = setInterval(() => this.nextSlide(), 4000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
  // ---- END HERO SLIDER ----

toggleCityMenu(event: Event) {
  event.stopPropagation();
  this.showCityMenu = !this.showCityMenu;
  this.showProfileMenu = false;
  this.showHelpMenu = false;
}

toggleProfileMenu(event: Event) {
  event.stopPropagation();
  this.showProfileMenu = !this.showProfileMenu;
  this.showCityMenu = false;
  this.showHelpMenu = false;
}

toggleHelpMenu(event: Event) {
  event.stopPropagation();
  this.showHelpMenu = !this.showHelpMenu;
  this.showCityMenu = false;
  this.showProfileMenu = false;
}

  selectCity(city: string) {
    this.selectedCity = city;
    this.showCityMenu = false;
    this.onSearch();
  }

  setActiveFilter(key: string) {
    this.activeFilter = key;
  }

 onSearch() {
  if (!this.searchQuery.trim() && this.selectedCity === 'Select City') return;
  this.router.navigate(['/listings'], {
    queryParams: {
      city: this.selectedCity,
      query: this.searchQuery,
      stayType: this.activeFilter
    }
  });
}

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  openFAQ() {
    this.router.navigate(['/faqs']);
  }

  goToBookings() {
    this.router.navigate(['/my-bookings']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  setLifeTab(key: string) {
  this.activeLifeTab = key;
}

get currentLifeTab(): LifeTab {
  return this.lifeTabs.find(t => t.key === this.activeLifeTab) || this.lifeTabs[0];
}

getStarted() {
  console.log('Get started clicked');
  // navigate wherever you want, e.g. this.router.navigate(['/listings']);
}



nextTestimonialSlide() {
  this.currentTestimonialSlide = (this.currentTestimonialSlide + 1) % this.testimonialSlideCount;
}



get visibleTestimonials(): Testimonial[] {
  const cards = [];
  for (let i = 0; i < 3; i++) {
    cards.push(this.testimonials[(this.currentTestimonialSlide + i) % this.testimonials.length]);
  }
  return cards;
}

get testimonialSlideCount(): number {
  return this.testimonials.length;
}

startTestimonialAutoSlide() {
  this.testimonialTimer = setInterval(() => {
    if (!this.isTestimonialPaused) {
      this.nextTestimonialSlide();
    }
  }, 2000);
}



goToTestimonialSlide(index: number) {
  this.currentTestimonialSlide = index;
}

pauseTestimonialSlide() {
  this.isTestimonialPaused = true;
}

resumeTestimonialSlide() {
  this.isTestimonialPaused = false;
}

getStars(count: number): number[] {
  return Array(count).fill(0);
}

callSupport() {
  window.location.href = 'tel:+911234567890';
}

emailSupport() {
  window.location.href = 'mailto:support@hostelhub.com';
}

}