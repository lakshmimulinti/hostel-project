import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface FaqItem {
  q: string;
  a: string;
  category: string;
  open?: boolean;
}

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss']
})
export class FaqPageComponent implements OnInit {

  selectedCity = 'All';
  searchQuery = '';

  cities = ['All', 'Hyderabad', 'Bengaluru', 'Chennai', 'Pune', 'Delhi NCR', 'Mumbai', 'General'];

  allFaqs: FaqItem[] = [
    // General FAQs
    {
      q: 'What is the security deposit for booking a hostel?',
      a: 'The security deposit generally ranges from 1 to 2 months rent depending on the hostel rules. It is fully refundable upon checkout after completing the notice period.',
      category: 'General',
      open: false
    },
    {
      q: 'Are meals (breakfast, lunch, dinner) included in the price?',
      a: 'Yes, most of our hostels and PGs include 3-time meals in the monthly rent. You can verify this by checking the food amenity icon (utensils) on the hostel card.',
      category: 'General',
      open: false
    },
    {
      q: 'What is the minimum stay duration and notice period?',
      a: 'The minimum stay duration is generally 1 month. You need to submit a written or portal notice 30 days before checkout to ensure a complete security deposit refund.',
      category: 'General',
      open: false
    },
    {
      q: 'Can family and friends visit or stay overnight?',
      a: 'Day visitors are allowed in the common lobby area. Overnight stays for family/friends require prior permission from the hostel warden and may incur nominal guest charges.',
      category: 'General',
      open: false
    },
    // Hyderabad FAQs
    {
      q: 'Is power backup available in Gachibowli PGs?',
      a: 'Yes, because DLF Cyber City area has power cuts occasionally, 90% of our seeded Hyderabad hostels (like Stanza Montreal) provide 24/7 power backup for AC and plug sockets.',
      category: 'Hyderabad',
      open: false
    },
    {
      q: 'What local transport is near HITEC City Madhapur hostels?',
      a: 'HITEC city metro station is within 1-2 kms of Madhapur PGs. Shared autos and buses are easily accessible right outside HITEC City Road.',
      category: 'Hyderabad',
      open: false
    },
    // Bengaluru FAQs
    {
      q: 'Do Koramangala PGs have water shortage issues?',
      a: 'Our registered Koramangala partner hostels (like Zolo Stay Sapphire) have dedicated water tanker subscriptions and 24/7 groundwater supply to avoid shortages.',
      category: 'Bengaluru',
      open: false
    },
    {
      q: 'Is Electronic City PG near Wipro Gate secure?',
      a: 'Yes, Electronic City PGs (like Stanza Hamburg) feature 24/7 security warden presence, CCTV cameras, and biometric fingerprint entry locks for optimal safety.',
      category: 'Bengaluru',
      open: false
    },
    // Chennai FAQs
    {
      q: 'Is AC mandatory in Adyar / OMR Chennai hostels due to heat?',
      a: 'It is highly recommended! We offer both AC and NON-AC rooms. AC rooms are slightly more expensive but provide comfortable living during the humid summer months.',
      category: 'Chennai',
      open: false
    },
    // Pune FAQs
    {
      q: 'Are Wakad PGs suitable for IT professionals?',
      a: 'Absolutely. Wakad PGs are located close to Hinjawadi IT Park. They offer high-speed Wi-Fi, writing desks, and quiet environments for work-from-home.',
      category: 'Pune',
      open: false
    },
    // Delhi NCR FAQs
    {
      q: 'Are Noida Sector 62 hostels close to metro stations?',
      a: 'Yes, Noida Sector 62 hostels are situated within 1 km of the Sector 62 Metro Station (Blue Line), making transit extremely convenient.',
      category: 'Delhi NCR',
      open: false
    },
    // Mumbai FAQs
    {
      q: 'Is a laundry facility available in Powai girls hostels?',
      a: 'Yes, Powai Girls Premium Residency offers automatic washing machines and dedicated drying areas on the terrace at no extra cost.',
      category: 'Mumbai',
      open: false
    }
  ];

  filteredFaqs: FaqItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['city']) {
        this.selectedCity = params['city'];
      }
      this.filterFaqs();
    });
  }

  setCity(city: string) {
    this.selectedCity = city;
    this.filterFaqs();
  }

  toggleFaq(index: number) {
    this.filteredFaqs[index].open = !this.filteredFaqs[index].open;
  }

  goBack() {
    this.router.navigate(['/listings']);
  }

  filterFaqs() {
    let temp = [...this.allFaqs];

    if (this.selectedCity !== 'All') {
      temp = temp.filter(faq => faq.category === this.selectedCity || faq.category === 'General');
    }

    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(faq => faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q));
    }

    this.filteredFaqs = temp.map(faq => ({ ...faq, open: false }));
    if (this.filteredFaqs.length > 0) {
      this.filteredFaqs[0].open = true;
    }
  }
}
