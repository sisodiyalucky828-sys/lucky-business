import { useEffect, useMemo, useState, useRef } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Droplets,
  Filter,
  Heart,
  HelpCircle,
  ImagePlus,
  IndianRupee,
  Leaf,
  Lock,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  Upload as UploadIcon,
  X,
  Check,
  Share2,
  Bookmark
} from 'lucide-react';
import { checkAdmin, deleteLivestock, fetchLivestock, loginAdmin, uploadLivestock } from './api';


const PHONE = '9926361994';
const API_ORIGIN = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
  : 'http://localhost:9090';

const FALLBACK_COW = 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=85';
const FALLBACK_BUFFALO = 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=85';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const typeOf = (animal) => animal?.type || animal?.category || 'Cow';
const milkOf = (animal) => animal?.milkCapacityLiters || animal?.milk_capacity_liters || 0;

const fallbackImage = (animal) => {
  const t = typeOf(animal);
  return t === 'Buffalo' || t === 'भैंस' ? FALLBACK_BUFFALO : FALLBACK_COW;
};

const imageOf = (animal) => {
  const source = animal?.imageUrls?.[0] || animal?.image_urls?.[0];
  if (!source) return fallbackImage(animal);
  if (/^https?:\/\//i.test(source)) return source;
  return `${API_ORIGIN}/${source.replace(/^\/+/, '')}`;
};

const waOf = (animal) =>
  `https://wa.me/91${PHONE}?text=${encodeURIComponent(
    `Namaste Lucky Business, mujhe ${animal.title} (ID: LB-${animal.id}) ke baare mein jaankari chahiye. Breed: ${animal.breed}, Price: ${money(animal.price)}.`
  )}`;

const translations = {
  en: {
    brandName: 'Lucky Business',
    tagline: 'Verified Livestock Marketplace',
    subTagline: 'Cows & Buffaloes · Direct from Farmers',
    browse: 'Browse Animals',
    sell: 'Sell with Us',
    admin: 'Admin Desk',
    callUs: 'Call: +91 99263 61994',
    mitera: 'Mitera, MP',
    live: 'Live Marketplace',
    demo: 'Demo Marketplace',
    updated: 'Updated just now',
    explore: 'Explore Listings',
    listAnimal: 'List Your Animal',
    verifiedBadge: 'Verified',
    verifiedText: 'Verified Sellers',
    verifiedDesc: 'Direct listings from genuine farmers and local dairy families.',
    honestText: 'Honest Milk & Health Records',
    honestDesc: 'Transparent information on daily milk yield, breed, age & health.',
    directText: 'Direct Contact',
    directDesc: 'Talk directly over WhatsApp or phone without any middlemen fees.',
    all: 'All Animals',
    cows: 'Cows',
    buffaloes: 'Buffaloes',
    search: 'Search animals',
    searchPlaceholder: 'Search by breed, name or location...',
    milkAny: 'Any milk yield',
    anyPrice: 'Any price',
    under50: 'Under ₹50k',
    c50to75: '₹50k - ₹75k',
    c75to100: '₹75k - ₹1 Lakh',
    above100: 'Above ₹1 Lakh',
    filterBreed: 'All Breeds',
    sortNewest: 'Newest First',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    sortMilkHigh: 'Milk: High to Low',
    filterButton: 'Filters',
    resetFilters: 'Reset Filters',
    heroBadge: '100% Verified Indian Livestock Marketplace',
    heroTitle: 'Healthy & Verified Cows & Buffaloes,',
    heroTitleHighlight: 'Direct from Farmers.',
      marketplace: 'Marketplace',
    featuredAnimals: 'Featured Livestock',
    featuredSub: 'Hand-picked healthy animals available right now in Mitera and nearby regions.',
    availableCount: 'animals available',
    noAnimals: 'No animals found matching your filters',
    tryAnother: 'Try adjusting your search keyword or clearing some filters.',
    viewDetails: 'View Details',
    whatsapp: 'WhatsApp',
    callDirect: 'Call Seller',
    imInterested: "I'm Interested",
    breed: 'Breed',
    milkDay: 'Milk / Day',
    age: 'Age',
    askingPrice: 'Asking Price',
    location: 'Location',
    sellerInfo: 'Seller Information',
    healthTitle: 'Health & Quality Check',
    healthVaccinated: 'Vaccination completed and verified',
    healthDewormed: 'Physically active and healthy',
    healthMilkCheck: 'Milk yield verified by local seller',
    howItWorks: 'How It Works',
    howItWorksSub: 'Simple, transparent 3-step process to buy or sell livestock.',
    step1: 'Choose an Animal',
    step1Text: 'Browse high quality photos, verified milk capacity, breed and price details.',
    step2: 'Contact Directly',
    step2Text: 'Connect via WhatsApp or Phone to request recent video and ask details.',
    step3: 'Inspect & Purchase',
    step3Text: 'Visit the farm, inspect the animal personally, and complete the purchase with peace of mind.',
    sellTitle: 'Sell Your Livestock',
    sellTitle2: 'to Genuine Buyers Quickly.',
    sellText: 'Share a few simple details and a photo. Lucky Business connects you directly with serious local buyers.',
    startListing: 'Start Listing Now',
    adminTitle: 'Admin Desk',
    adminWelcome: 'Welcome back,',
    adminText: 'Manage livestock listings, track enquiries, and keep the marketplace fresh.',
    addAnimal: 'Add Animal',
    logout: 'Logout',
    activeListings: 'Active Listings',
    pendingListings: 'Pending Verification',
    soldThisMonth: 'Sold Animals',
    totalSellers: 'Total Sellers',
    allListings: 'All Listings',
    available: 'Active',
    sold: 'Sold',
    loginTitle: 'Admin Login',
    loginText: 'Enter your registered phone number and secret password to unlock the admin desk.',
    login: 'Login to Admin Desk',
    loginPhonePlaceholder: 'Mobile number (e.g. 9926361994)',
    loginPassPlaceholder: 'Admin password',
    addNewListing: 'Add New Animal',
    addAnimalTitle: 'List an Animal for Sale',
    sectionAnimal: '1. Animal Information',
    sectionLocation: '2. Location & Seller Contact',
    sectionPhoto: '3. Animal Photo',
    clearPhoto: 'Upload Animal Photo',
    imageHint: 'Clear photos in natural daylight attract serious buyers (JPG, PNG · max 10MB)',
    removePhoto: 'Remove photo',
    changePhoto: 'Change photo',
    animalName: 'Animal Name / Title',
    animalNamePlaceholder: 'e.g. Sahiwal Lakshmi, Murrah Heera',
    category: 'Category',
    breedField: 'Breed',
    breedPlaceholder: 'e.g. Sahiwal, Gir, Murrah, Tharparkar',
    milkField: 'Milk Yield (Liters / Day)',
    ageField: 'Age (Years)',
    askingField: 'Asking Price (₹)',
    locationField: 'Location / Village',
    locationPlaceholder: 'e.g. Mitera, Madhya Pradesh',
    yourName: 'Seller Name',
    yourNamePlaceholder: 'Your full name',
    yourPhone: 'Contact Phone Number',
    detailsPrivate: 'Your phone number is shared only with verified interested buyers.',
    cancel: 'Cancel',
    saveDraft: 'Save Draft',
    draftSaved: 'Draft saved in browser memory!',
    draftLoaded: 'Loaded saved draft!',
    publish: 'List Animal',
    footerAbout: 'Lucky Business is central India’s trusted agricultural and livestock trading platform. Empowering farmers with transparent pricing, verified milk records, and direct connections.',
    quickLinks: 'Quick Links',
    contactHelp: 'Need Help or Guidance?',
    rights: 'All rights reserved. Dedicated to our farming community.',
    cow: 'Cow',
    buffalo: 'Buffalo',
    language: 'Language',
    toastLive: 'Your listing is now live!',
    toastFail: 'Could not save listing. Please try again.',
    toastDelete: 'Listing removed successfully.',
    toastAdminError: 'Admin authorization required.',
    toastLoginSuccess: 'Admin login successful. Welcome!',
    toastLoginFail: 'Invalid phone number or password.'
  },
  hi: {
    brandName: 'Lucky Business',
    tagline: 'विश्वसनीय पशुधन मार्केटप्लेस',
    subTagline: 'गाय और भैंस · सीधे किसान व पशुपालक से',
    browse: 'पशुधन देखें',
    sell: 'पशु बेचें',
    admin: 'एडमिन डेस्क',
    callUs: 'कॉल: +91 99263 61994',
    mitera: 'मइटेरा, म.प्र.',
    live: 'लाइव मार्केटप्लेस',
    demo: 'डेमो मार्केटप्लेस',
    updated: 'अभी अपडेट हुआ',
    explore: 'पशु सूची देखें',
    listAnimal: 'अपना पशु जोड़ें',
    verifiedBadge: 'सत्यापित',
    verifiedText: 'सत्यापित विक्रेता',
    verifiedDesc: 'स्थानीय किसानों और भरोसेमंद डेरी फार्मों की जांची-परखी लिस्टिंग।',
    honestText: 'ईमानदार दूध व स्वास्थ्य रिकॉर्ड',
    honestDesc: 'दूध की मात्रा, उम्र, ब्यात और नस्ल की पूरी और सच्ची जानकारी।',
    directText: 'सीधा संपर्क',
    directDesc: 'बिना किसी दलाल या कमीशन के सीधे WhatsApp या फ़ोन पर बात करें।',
    all: 'सभी पशु',
    cows: 'गायें (Cows)',
    buffaloes: 'भैंसें (Buffaloes)',
    search: 'पशु खोजें',
    searchPlaceholder: 'नस्ल, नाम या गाँव से खोजें...',
    milkAny: 'कोई भी दूध क्षमता',
    anyPrice: 'कोई भी कीमत',
    under50: '₹50,000 से कम',
    c50to75: '₹50,000 - ₹75,000',
    c75to100: '₹75,000 - ₹1 लाख',
    above100: '₹1 लाख से ऊपर',
    filterBreed: 'सभी नस्लें',
    sortNewest: 'नवीनतम पहले',
    sortPriceLow: 'कीमत: कम से ज्यादा',
    sortPriceHigh: 'कीमत: ज्यादा से कम',
    sortMilkHigh: 'दूध: ज्यादा से कम',
    filterButton: 'फ़िल्टर',
    resetFilters: 'फ़िल्टर हटाएं',
    heroBadge: '100% प्रमाणित भारतीय पशुधन मार्केटप्लेस',
    heroTitle: 'स्वस्थ और उच्च दुधारू गाय-भैंस,',
    heroTitleHighlight: 'सीधे स्थानीय पशुपालकों से।',
    marketplace: 'मार्केटप्लेस',
    featuredAnimals: 'उपलब्ध पशुधन',
    featuredSub: 'मइटेरा और आसपास के क्षेत्रों में अभी बिक्री के लिए उपलब्ध स्वस्थ पशु।',
    availableCount: 'पशुधन उपलब्ध',
    noAnimals: 'इस फ़िल्टर से कोई पशु नहीं मिला',
    tryAnother: 'कृपया अन्य नस्ल, स्थान या कीमत की सीमा चुनकर देखें।',
    viewDetails: 'पूरी जानकारी देखें',
    whatsapp: 'व्हाट्सऐप',
    callDirect: 'सीधा कॉल करें',
    imInterested: 'मुझे इसमें रुचि है',
    breed: 'नस्ल',
    milkDay: 'दूध क्षमता',
    age: 'उम्र',
    askingPrice: 'मांगी गई कीमत',
    location: 'स्थान',
    sellerInfo: 'विक्रेता विवरण',
    healthTitle: 'स्वास्थ्य व शुद्धता प्रमाण',
    healthVaccinated: 'टीकाकरण पूर्ण एवं डॉक्टर द्वारा जांचा गया',
    healthDewormed: 'शारीरिक रूप से सक्रिय एवं पूर्णतः स्वस्थ',
    healthMilkCheck: 'मौजूदा दूध क्षमता की विक्रेता द्वारा पुष्टि',
    howItWorks: 'खरीदना और बेचना कितना आसान है',
    howItWorksSub: 'पशुधन के सही व्यापार के लिए 3 सरल और सुरक्षित कदम।',
    step1: 'पशु चुनें और विवरण देखें',
    step1Text: 'फोटो, नस्ल, दूध रिकॉर्ड और कीमत देखकर अपनी पसंद का पशु चुनें।',
    step2: 'सीधे विक्रेता से बात करें',
    step2Text: 'WhatsApp या कॉल के जरिए ताजा वीडियो मंगाएं और सवाल पूछें।',
    step3: 'फार्म पर जाकर सौदा पक्का करें',
    step3Text: 'स्थान पर जाकर स्वयं पशु की जांच करें और संतुष्ट होकर भुगतान करें।',
    sellTitle: 'अपना पशु बेचें',
    sellTitle2: 'सही खरीदार को, अच्छे दाम पर।',
    sellText: 'सिर्फ एक फोटो और कुछ सामान्य जानकारी भरें। Lucky Business आपके पशु को गंभीर खरीदारों तक पहुंचाएगा।',
    startListing: 'नया पशु लिस्ट करें',
    adminTitle: 'एडमिन डेस्क',
    adminWelcome: 'शुभ प्रभात,',
    adminText: 'अपने मार्केटप्लेस की सभी लिस्टिंग और पूछताछ को एक ही जगह से प्रबंधित करें।',
    addAnimal: 'नया पशु जोड़ें',
    logout: 'लॉगआउट',
    activeListings: 'सक्रिय लिस्टिंग',
    pendingListings: 'लंबित सत्यापन',
    soldThisMonth: 'बिके हुए पशु',
    totalSellers: 'कुल विक्रेता',
    allListings: 'सभी लिस्टिंग',
    available: 'सक्रिय',
    sold: 'बिक गया',
    loginTitle: 'एडमिन लॉगिन',
    loginText: 'एडमिन डेस्क खोलने के लिए अपना अधिकृत मोबाइल नंबर और पासवर्ड दर्ज करें।',
    login: 'लॉगिन करें',
    loginPhonePlaceholder: 'मोबाइल नंबर (जैसे 9926361994)',
    loginPassPlaceholder: 'एडमिन पासवर्ड',
    addNewListing: 'नया पशु जोड़ें',
    addAnimalTitle: 'बिक्री के लिए पशु सूचीबद्ध करें',
    sectionAnimal: '१. पशु की जानकारी',
    sectionLocation: '२. स्थान और विक्रेता का संपर्क',
    sectionPhoto: '३. पशु की साफ फोटो',
    clearPhoto: 'पशु की साफ फोटो अपलोड करें',
    imageHint: 'प्राकृतिक उजाले में ली गई साफ फोटो से जल्दी ग्राहक मिलते हैं (JPG, PNG · अधिकतम 10MB)',
    removePhoto: 'फोटो हटाएं',
    changePhoto: 'फोटो बदलें',
    animalName: 'पशु का नाम / शीर्षक',
    animalNamePlaceholder: 'उदा. साहीवाल लक्ष्मी, मुर्रा हीरा',
    category: 'श्रेणी (Category)',
    breedField: 'नस्ल (Breed)',
    breedPlaceholder: 'उदा. साहीवाल, गिर, मुर्रा, थारपारकर, जाफराबादी',
    milkField: 'दूध क्षमता (लीटर / दिन)',
    ageField: 'उम्र (वर्ष)',
    askingField: 'मांगी गई कीमत (₹)',
    locationField: 'स्थान / गाँव व जिला',
    locationPlaceholder: 'उदा. मइटेरा, मध्य प्रदेश',
    yourName: 'विक्रेता का नाम',
    yourNamePlaceholder: 'आपका पूरा नाम',
    yourPhone: 'संपर्क मोबाइल नंबर',
    detailsPrivate: 'आपका नंबर केवल सत्यापित इच्छुक खरीदारों के साथ साझा किया जाएगा।',
    cancel: 'रद्द करें',
    saveDraft: 'ड्राफ्ट सेव करें',
    draftSaved: 'ड्राफ्ट ब्राउज़र में सुरक्षित हो गया!',
    draftLoaded: 'सुरक्षित ड्राफ्ट लोड हुआ!',
    publish: 'पशु लिस्ट करें',
    footerAbout: 'Lucky Business मध्य प्रदेश का विश्वसनीय पशुधन बाज़ार है। हमारा उद्देश्य किसानों और पशुपालकों को सही मूल्य, पारदर्शी दूध रिकॉर्ड और बिना बिचौलियों का सीधा बाज़ार देना है।',
    quickLinks: 'त्वरित लिंक',
    contactHelp: 'मदद या सलाह चाहिए?',
    rights: 'सर्वाधिकार सुरक्षित। हमारे किसान भाइयों को समर्पित।',
    cow: 'गाय',
    buffalo: 'भैंस',
    language: 'भाषा',
    toastLive: 'आपकी लिस्टिंग सफलतापूर्वक लाइव हो गई है!',
    toastFail: 'लिस्टिंग सेव नहीं हो सकी। कृपया पुनः प्रयास करें।',
    toastDelete: 'लिस्टिंग सफलतापूर्वक हटा दी गई।',
    toastAdminError: 'एडमिन अनुमति आवश्यक है।',
    toastLoginSuccess: 'एडमिन लॉगिन सफल रहा। स्वागत है!',
    toastLoginFail: 'गलत फोन नंबर या पासवर्ड दर्ज किया गया।'
  }
};

const COMMON_BREEDS = [
  'Sahiwal',
  'Gir',
  'Tharparkar',
  'Rathi',
  'Red Sindhi',
  'Kankrej',
  'Murrah',
  'Jaffarabadi',
  'Mehsana',
  'Nili-Ravi',
  'Bhadawari',
  'Desi / Local'
];

export default function App() {
  const [listings, setListings] = useState([]);
  const [tab, setTab] = useState('browse');
  const [selected, setSelected] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const [menu, setMenu] = useState(false);
  const [live, setLive] = useState(false);
  const [adminKey, setAdminKey] = useState(() => window.localStorage.getItem('lucky-business-admin-session') || '');
  const [language, setLanguage] = useState('hi');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    type: 'All',
    breed: 'All',
    milk: 'Any',
    price: 'Any',
    location: '',
    sort: 'newest'
  });

  const copy = translations[language] || translations.hi;

  // Load from backend on mount, fall back gracefully to sampleListings
  useEffect(() => {
    fetchLivestock()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setListings(data);
          setLive(true);
        } else {
          setListings([]);
          setLive(false);
        }
      })
      .catch(() => {
        setListings([]);
        setLive(false);
      });
  }, []);

  // Validate admin key with backend
  useEffect(() => {
    if (!adminKey) return;
    checkAdmin(adminKey).catch(() => {
      window.localStorage.removeItem('lucky-business-admin-session');
      setAdminKey('');
    });
  }, [adminKey]);

  const notify = (text, type = 'success') => {
    setNotice({ text, type });
    window.setTimeout(() => setNotice(null), 4500);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('lucky-business-admin-session');
    setAdminKey('');
    notify(language === 'hi' ? 'सफलतापूर्वक लॉगआउट हो गया।' : 'Logged out successfully.', 'info');
  };

  const handleAdminLogin = (phone, password) => {
    return loginAdmin(phone, password)
      .then(({ adminKey: key }) => {
        window.localStorage.setItem('lucky-business-admin-session', key);
        setAdminKey(key);
        notify(copy.toastLoginSuccess, 'success');
      })
      .catch(() => {
        notify(copy.toastLoginFail, 'error');
      });
  };

  const addListing = async (formData) => {
    try {
      const created = await uploadLivestock(formData);
      setListings((items) => [created, ...items]);
      notify(copy.toastLive, 'success');
      setUploadOpen(false);
      // Remove any saved draft once submitted
      window.localStorage.removeItem('lucky_animal_draft');
    } catch {
      notify(copy.toastFail, 'error');
    }
  };

  const removeListing = async (id) => {
    try {
      await deleteLivestock(id, adminKey);
      setListings((items) => items.filter((animal) => animal.id !== id));
      notify(copy.toastDelete, 'success');
    } catch {
      notify(copy.toastAdminError, 'error');
    }
  };

  // Filtered and sorted listings
  const filtered = useMemo(() => {
    const list = listings.filter((animal) => {
      const q = filters.search.trim().toLowerCase();
      const text = `${animal.title || ''} ${animal.breed || ''} ${animal.location || ''} ${animal.type || ''}`.toLowerCase();
      if (q && !text.includes(q)) return false;

      // Type filter
      if (filters.type !== 'All') {
        const t = (animal.type || animal.category || '').toLowerCase();
        if (filters.type === 'Cow' && t !== 'cow' && t !== 'गाय') return false;
        if (filters.type === 'Buffalo' && t !== 'buffalo' && t !== 'भैंस') return false;
      }

      // Breed filter
      if (filters.breed !== 'All') {
        const b = (animal.breed || '').toLowerCase();
        if (!b.includes(filters.breed.toLowerCase())) return false;
      }

      // Milk yield
      const m = Number(milkOf(animal)) || 0;
      if (filters.milk !== 'Any' && m < Number(filters.milk)) return false;

      // Price filter
      const p = Number(animal.price) || 0;
      if (filters.price === 'under50' && p >= 50000) return false;
      if (filters.price === '50to75' && (p < 50000 || p > 75000)) return false;
      if (filters.price === '75to100' && (p < 75000 || p > 100000)) return false;
      if (filters.price === 'above100' && p <= 100000) return false;

      // Location search
      if (filters.location.trim()) {
        const loc = (animal.location || '').toLowerCase();
        if (!loc.includes(filters.location.trim().toLowerCase())) return false;
      }

      return true;
    });

    // Sorting
    return [...list].sort((a, b) => {
      if (filters.sort === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (filters.sort === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (filters.sort === 'milk-desc') return (milkOf(b) || 0) - (milkOf(a) || 0);
      // default: newest first
      return (b.id || 0) - (a.id || 0);
    });
  }, [listings, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.type !== 'All') count++;
    if (filters.breed !== 'All') count++;
    if (filters.milk !== 'Any') count++;
    if (filters.price !== 'Any') count++;
    if (filters.location) count++;
    return count;
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'All',
      breed: 'All',
      milk: 'Any',
      price: 'Any',
      location: '',
      sort: 'newest'
    });
  };

  return (
    <div className="site-wrapper">
      {/* 1. NAVBAR */}
      <header className="navbar-root">
        <div className="navbar-inner">
          <a
            href="#top"
            className="brand-block"
            onClick={(e) => {
              e.preventDefault();
              setTab('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="brand-icon-wrap">
              <Leaf size={22} className="brand-leaf-icon" />
            </div>
            <div className="brand-text-wrap">
              <span className="brand-title">{copy.brandName}</span>
              <span className="brand-tagline">{copy.tagline}</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <button
              className={`nav-item ${tab === 'browse' ? 'active' : ''}`}
              onClick={() => {
                setTab('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {copy.browse}
            </button>
            <button
              className={`nav-item ${tab === 'sell' ? 'active' : ''}`}
              onClick={() => {
                setTab('sell');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {copy.sell}
            </button>
            {adminKey && (
              <button
                className={`nav-item ${tab === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setTab('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {copy.admin}
                <span className="admin-status-indicator" title="Logged in" />
              </button>
            )}
          </nav>

          {/* Right Header Actions */}
          <div className="header-actions-group">
            {/* Language Switcher */}
            <div className="lang-toggle-pill" role="group" aria-label={copy.language}>
              <button
                type="button"
                className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
                onClick={() => setLanguage('hi')}
              >
                हिंदी
              </button>
              <button
                type="button"
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>

            {/* Direct Phone Call CTA */}
            <a href={`tel:+91${PHONE}`} className="call-header-btn">
              <Phone size={15} />
              <span className="call-label">{copy.callUs}</span>
            </a>

            {/* List Animal Button in Navbar */}
            <button className="primary-pill-btn navbar-upload-btn" onClick={() => setUploadOpen(true)}>
              <Plus size={16} />
              <span>{copy.listAnimal}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMenu(!menu)}
              aria-label="Toggle navigation menu"
            >
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menu && (
          <div className="mobile-drawer-overlay" onClick={() => setMenu(false)}>
            <div className="mobile-drawer-card" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-drawer-header">
                <span className="brand-title">{copy.brandName}</span>
                <button className="icon-close-btn" onClick={() => setMenu(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="mobile-drawer-links">
                <button
                  className={`drawer-link ${tab === 'browse' ? 'active' : ''}`}
                  onClick={() => {
                    setTab('browse');
                    setMenu(false);
                  }}
                >
                  {copy.browse}
                </button>
                <button
                  className={`drawer-link ${tab === 'sell' ? 'active' : ''}`}
                  onClick={() => {
                    setTab('sell');
                    setMenu(false);
                  }}
                >
                  {copy.sell}
                </button>
                {adminKey && (
                  <button
                    className={`drawer-link ${tab === 'admin' ? 'active' : ''}`}
                    onClick={() => {
                      setTab('admin');
                      setMenu(false);
                    }}
                  >
                    {copy.admin}
                  </button>
                )}
              </div>
              <div className="mobile-drawer-footer">
                <button className="primary-pill-btn full-width" onClick={() => { setUploadOpen(true); setMenu(false); }}>
                  <Plus size={16} />
                  <span>{copy.listAnimal}</span>
                </button>
                <a href={`tel:+91${PHONE}`} className="call-drawer-btn">
                  <Phone size={16} />
                  <span>{copy.callUs}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* GLOBAL TOAST NOTICE */}
      {notice && (
        <div className={`toast-notification ${notice.type}`}>
          <div className="toast-content">
            <CheckCircle2 size={18} className="toast-icon" />
            <span>{notice.text}</span>
          </div>
          <button className="toast-close-btn" onClick={() => setNotice(null)}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* 2. MAIN VIEWS */}
      {tab === 'browse' && (
        <BrowseView
          listings={filtered}
          allCount={listings.length}
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          activeFilterCount={activeFilterCount}
          mobileFilterOpen={mobileFilterOpen}
          setMobileFilterOpen={setMobileFilterOpen}
          live={live}
          onSelect={setSelected}
          onUpload={() => setUploadOpen(true)}
          language={language}
          copy={copy}
        />
      )}

      {tab === 'sell' && (
        <SellPageView onUpload={() => setUploadOpen(true)} language={language} copy={copy} />
      )}

      {tab === 'admin' && (
        adminKey ? (
          <AdminDashboardView
            listings={listings}
            onUpload={() => setUploadOpen(true)}
            onDelete={removeListing}
            onLogout={handleLogout}
            language={language}
            copy={copy}
          />
        ) : (
          <AdminLoginView
            onLogin={handleAdminLogin}
            language={language}
            copy={copy}
          />
        )
      )}

      {/* 5. ANIMAL DETAILS MODAL */}
      {selected && (
        <AnimalDetailModal
          animal={selected}
          close={() => setSelected(null)}
          language={language}
          copy={copy}
        />
      )}

      {/* 4. ADD ANIMAL MODAL / FORM */}
      {uploadOpen && (
        <AddAnimalModal
          close={() => setUploadOpen(false)}
          submit={addListing}
          notify={notify}
          language={language}
          copy={copy}
        />
      )}

      {/* FOOTER */}
      <footer className="footer-root">
        <div className="footer-top-container">
          <div className="footer-brand-col">
            <div className="brand-block footer-brand">
              <div className="brand-icon-wrap">
                <Leaf size={20} className="brand-leaf-icon" />
              </div>
              <span className="brand-title">{copy.brandName}</span>
            </div>
            <p className="footer-about-text">{copy.footerAbout}</p>
            <div className="footer-badge-line">
              <span className="footer-meta-pill">
                <MapPin size={13} /> {copy.mitera}
              </span>
              <span className="footer-meta-pill">
                <ShieldCheck size={13} /> {copy.verifiedText}
              </span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">{copy.quickLinks}</h4>
            <ul className="footer-list">
              <li>
                <button onClick={() => { setTab('browse'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  {copy.browse}
                </button>
              </li>
              <li>
                <button onClick={() => { setTab('sell'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  {copy.sell}
                </button>
              </li>
              <li>
                <button onClick={() => { setTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  {copy.admin}
                </button>
              </li>
              <li>
                <button onClick={() => setUploadOpen(true)}>{copy.listAnimal}</button>
              </li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4 className="footer-col-title">{copy.contactHelp}</h4>
            <p className="footer-contact-desc">
              {language === 'hi'
                ? 'किसी भी पशु की जानकारी या मदद के लिए हमारे हेल्पलाइन नंबर पर संपर्क करें।'
                : 'Need assistance regarding an animal listing or inspection? Reach out to our helpline.'}
            </p>
            <div className="footer-action-buttons">
              <a href={`tel:+91${PHONE}`} className="footer-contact-btn phone">
                <Phone size={15} />
                <span>+91 99263 61994</span>
              </a>
              <a
                href={`https://wa.me/91${PHONE}?text=${encodeURIComponent(
                  language === 'hi' ? 'नमस्ते Lucky Business, मुझे पशुधन के बारे में जानकारी चाहिए।' : 'Hello Lucky Business, I need assistance regarding livestock.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="footer-contact-btn whatsapp"
              >
                <MessageCircle size={15} />
                <span>{copy.whatsapp}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© 2026 {copy.brandName}. {copy.rights}</span>
          <span className="footer-location-tag">
            <MapPin size={12} /> Mitera, Madhya Pradesh, India
          </span>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================================
   2. HOME & BROWSE VIEW
   ========================================================================= */
function BrowseView({
  listings,
  allCount,
  filters,
  setFilters,
  resetFilters,
  activeFilterCount,
  mobileFilterOpen,
  setMobileFilterOpen,
  live,
  onSelect,
  onUpload,
  language,
  copy
}) {
  const scrollToListings = () => {
    const el = document.getElementById('listings-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="main-content">
      {/* HERO SECTION */}
      <section className="hero-banner">
        <div className="hero-container">
          <div className="hero-text-block">
            <div className="hero-trust-tag">
              <span className="pulse-indicator" />
              <span>{copy.heroBadge}</span>
            </div>

            <h1 className="hero-headline">
              {copy.heroTitle} <br />
              <span className="hero-highlight">{copy.heroTitleHighlight}</span>
            </h1>

            <p className="hero-subtext">{copy.heroText}</p>

            {/* Quick Hero Search Input */}
            <div className="hero-search-box">
              <Search size={20} className="hero-search-icon" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder={copy.searchPlaceholder}
                className="hero-search-input"
              />
              <button className="primary-pill-btn hero-search-btn" onClick={scrollToListings}>
                <span>{language === 'hi' ? 'खोजें' : 'Search'}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Hero CTAs */}
            <div className="hero-actions-row">
              <button className="primary-pill-btn hero-main-btn" onClick={scrollToListings}>
                {copy.explore}
                <ArrowRight size={17} />
              </button>
              <button className="secondary-pill-btn" onClick={onUpload}>
                <Plus size={17} />
                {copy.listAnimal}
              </button>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="hero-visual-block">
            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=85"
                alt="Healthy dairy cow grazing in green pasture"
                className="hero-main-photo"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_COW;
                }}
              />
              <div className="hero-photo-tag">
                <BadgeCheck size={16} className="green-accent" />
                <div>
                  <strong>{language === 'hi' ? 'प्रमाणित नस्ल व स्वास्थ्य' : 'Verified Breed & Health'}</strong>
                  <small>{copy.mitera}</small>
                </div>
              </div>
              <div className="hero-sold-badge">
                <BadgeCheck size={18} className="green-accent" />
                <span className="stat-label">
                  {language === 'hi' ? '100% प्रमाणित पशुधन' : '100% Verified Listings'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 PILLARS / TRUST INDICATORS */}
      <section className="trust-pillars-section">
        <div className="trust-grid-container">
          <div className="trust-card">
            <div className="trust-card-icon-wrap">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h3 className="trust-card-title">{copy.verifiedText}</h3>
              <p className="trust-card-desc">{copy.verifiedDesc}</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-card-icon-wrap">
              <Droplets size={26} />
            </div>
            <div>
              <h3 className="trust-card-title">{copy.honestText}</h3>
              <p className="trust-card-desc">{copy.honestDesc}</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-card-icon-wrap">
              <Phone size={26} />
            </div>
            <div>
              <h3 className="trust-card-title">{copy.directText}</h3>
              <p className="trust-card-desc">{copy.directDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works-section">
        <div className="section-head-center">
          <span className="section-eyebrow">{copy.howItWorks}</span>
          <h2 className="section-main-heading">{copy.howItWorks}</h2>
          <p className="section-lead-text">{copy.howItWorksSub}</p>
        </div>

        <div className="steps-container">
          <div className="step-box">
            <div className="step-num-badge">01</div>
            <h4 className="step-box-title">{copy.step1}</h4>
            <p className="step-box-desc">{copy.step1Text}</p>
          </div>
          <div className="step-box">
            <div className="step-num-badge">02</div>
            <h4 className="step-box-title">{copy.step2}</h4>
            <p className="step-box-desc">{copy.step2Text}</p>
          </div>
          <div className="step-box">
            <div className="step-num-badge">03</div>
            <h4 className="step-box-title">{copy.step3}</h4>
            <p className="step-box-desc">{copy.step3Text}</p>
          </div>
        </div>
      </section>

      {/* 3. ANIMAL LISTINGS MARKETPLACE */}
      <section className="listings-section" id="listings-section">
        <div className="section-head-split">
          <div>
            <span className="section-eyebrow">{copy.marketplace}</span>
            <h2 className="section-main-heading">{copy.featuredAnimals}</h2>
            <p className="section-lead-text">{copy.featuredSub}</p>
          </div>
          <div className="listings-live-badge">
            <span className="live-dot" />
            <span>{live ? copy.live : copy.demo}</span>
            <small className="sync-text">· {copy.updated}</small>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="category-pills-bar">
          <button
            className={`cat-pill ${filters.type === 'All' ? 'active' : ''}`}
            onClick={() => setFilters({ ...filters, type: 'All' })}
          >
            {copy.all} ({allCount})
          </button>
          <button
            className={`cat-pill ${filters.type === 'Cow' ? 'active' : ''}`}
            onClick={() => setFilters({ ...filters, type: 'Cow' })}
          >
            🐄 {copy.cows}
          </button>
          <button
            className={`cat-pill ${filters.type === 'Buffalo' ? 'active' : ''}`}
            onClick={() => setFilters({ ...filters, type: 'Buffalo' })}
          >
            🐃 {copy.buffaloes}
          </button>

          {/* Mobile Filter Toggle */}
          <button
            className={`mobile-filter-toggle-btn ${activeFilterCount > 0 ? 'has-active' : ''}`}
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <SlidersHorizontal size={16} />
            <span>{copy.filterButton}</span>
            {activeFilterCount > 0 && <span className="active-filter-badge">{activeFilterCount}</span>}
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className={`filter-controls-row ${mobileFilterOpen ? 'mobile-open' : ''}`}>
          {/* Search box inside filter bar */}
          <div className="filter-input-wrap">
            <Search size={16} className="filter-icon" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder={copy.searchPlaceholder}
              className="filter-search-input"
            />
            {filters.search && (
              <button className="filter-clear-btn" onClick={() => setFilters({ ...filters, search: '' })}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Breed Select */}
          <div className="filter-select-wrap">
            <Tag size={15} className="filter-icon" />
            <select
              value={filters.breed}
              onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
              className="filter-dropdown"
            >
              <option value="All">{copy.filterBreed}</option>
              {COMMON_BREEDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <ChevronDown size={14} className="dropdown-arrow" />
          </div>

          {/* Milk Yield Select */}
          <div className="filter-select-wrap">
            <Droplets size={15} className="filter-icon" />
            <select
              value={filters.milk}
              onChange={(e) => setFilters({ ...filters, milk: e.target.value })}
              className="filter-dropdown"
            >
              <option value="Any">{copy.milkAny}</option>
              <option value="8">8+ L / {language === 'hi' ? 'दिन' : 'day'}</option>
              <option value="10">10+ L / {language === 'hi' ? 'दिन' : 'day'}</option>
              <option value="12">12+ L / {language === 'hi' ? 'दिन' : 'day'}</option>
              <option value="15">15+ L / {language === 'hi' ? 'दिन' : 'day'}</option>
            </select>
            <ChevronDown size={14} className="dropdown-arrow" />
          </div>

          {/* Price Range Select */}
          <div className="filter-select-wrap">
            <IndianRupee size={15} className="filter-icon" />
            <select
              value={filters.price}
              onChange={(e) => setFilters({ ...filters, price: e.target.value })}
              className="filter-dropdown"
            >
              <option value="Any">{copy.anyPrice}</option>
              <option value="under50">{copy.under50}</option>
              <option value="50to75">{copy.c50to75}</option>
              <option value="75to100">{copy.c75to100}</option>
              <option value="above100">{copy.above100}</option>
            </select>
            <ChevronDown size={14} className="dropdown-arrow" />
          </div>

          {/* Sort Select */}
          <div className="filter-select-wrap sort-select">
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="filter-dropdown"
            >
              <option value="newest">{copy.sortNewest}</option>
              <option value="price-asc">{copy.sortPriceLow}</option>
              <option value="price-desc">{copy.sortPriceHigh}</option>
              <option value="milk-desc">{copy.sortMilkHigh}</option>
            </select>
            <ChevronDown size={14} className="dropdown-arrow" />
          </div>

          {/* Reset Filters button if any active */}
          {activeFilterCount > 0 && (
            <button className="reset-filters-btn" onClick={resetFilters} title={copy.resetFilters}>
              <RotateCcw size={14} />
              <span>{copy.resetFilters}</span>
            </button>
          )}
        </div>

        {/* Results Count Line */}
        <div className="listings-meta-bar">
          <span className="results-badge">
            <strong>{listings.length}</strong> {copy.availableCount}
          </span>
          {activeFilterCount > 0 && (
            <span className="filters-applied-text">
              ({activeFilterCount} {language === 'hi' ? 'फ़िल्टर लागू' : 'filters applied'})
            </span>
          )}
        </div>

        {/* Animal Cards Grid */}
        <div className="cards-grid">
          {listings.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              select={onSelect}
              language={language}
              copy={copy}
            />
          ))}

          {listings.length === 0 && (
            <div className="empty-listings-box">
              <Search size={36} className="empty-search-icon" />
              <h3>{copy.noAnimals}</h3>
              <p>{copy.tryAnother}</p>
              <button className="secondary-pill-btn" onClick={resetFilters}>
                <RotateCcw size={15} />
                {copy.resetFilters}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* DIRECT INQUIRY BANNER */}
      <section className="inquiry-banner-section">
        <div className="inquiry-banner-card">
          <div className="inquiry-text-block">
            <span className="section-eyebrow white-tag">
              {language === 'hi' ? 'सीधा संपर्क' : 'Direct Helpline'}
            </span>
            <h2 className="inquiry-heading">
              {language === 'hi' ? 'पशु खरीदने या बेचने में मदद चाहिए?' : 'Need guidance buying or selling livestock?'}
            </h2>
            <p className="inquiry-subtext">
              {language === 'hi'
                ? 'Lucky Business की टीम से सीधे WhatsApp या फ़ोन पर बात करें। हम आपको सही नस्ल और उचित दाम दिलाने में पूरी मदद करेंगे।'
                : 'Connect with Lucky Business directly. We assist you in finding genuine cattle, fair pricing and seller verification.'}
            </p>
          </div>
          <div className="inquiry-actions-block">
            <a
              href={`https://wa.me/91${PHONE}?text=${encodeURIComponent(
                language === 'hi' ? 'नमस्ते Lucky Business, मुझे पशुधन की जानकारी चाहिए।' : 'Hello Lucky Business, I would like to inquire about livestock.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-action-btn"
            >
              <MessageCircle size={18} />
              <span>{language === 'hi' ? 'व्हाट्सऐप पर पूछें' : 'Chat on WhatsApp'}</span>
            </a>
            <a href={`tel:+91${PHONE}`} className="call-action-btn">
              <Phone size={17} />
              <span>+91 99263 61994</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================================
   3. ANIMAL CARD COMPONENT
   ========================================================================= */
function AnimalCard({ animal, select, language, copy }) {
  const isBuffalo = typeOf(animal) === 'Buffalo' || typeOf(animal) === 'भैंस';
  const categoryLabel = isBuffalo
    ? (language === 'hi' ? 'भैंस' : 'Buffalo')
    : (language === 'hi' ? 'गाय' : 'Cow');

  return (
    <article className="animal-card">
      <div className="card-media-wrap" onClick={() => select(animal)}>
        <img
          src={imageOf(animal)}
          alt={animal.title}
          className="card-photo"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage(animal);
          }}
        />
        <span className={`card-type-tag ${isBuffalo ? 'buffalo-tag' : 'cow-tag'}`}>
          {isBuffalo ? '🐃 ' : '🐄 '}
          {categoryLabel}
        </span>
        <span className="card-verified-tag">
          <BadgeCheck size={13} />
          {copy.verifiedBadge}
        </span>
      </div>

      <div className="card-body">
        {/* Breed + Specs Row */}
        <div className="card-specs-row">
          <div className="spec-item" title={copy.breed}>
            <Tag size={13} className="spec-icon" />
            <span>{animal.breed}</span>
          </div>
          <div className="spec-item" title={copy.milkDay}>
            <Droplets size={13} className="spec-icon milk" />
            <span>{milkOf(animal)} L/{language === 'hi' ? 'दिन' : 'day'}</span>
          </div>
          <div className="spec-item" title={copy.age}>
            <CalendarDays size={13} className="spec-icon" />
            <span>{animal.age} {language === 'hi' ? 'वर्ष' : 'yrs'}</span>
          </div>
        </div>

        {/* Price Block — prominent */}
        <div className="card-price-block">
          <span className="card-price-main">{money(animal.price)}</span>
          <span className="card-price-label">{language === 'hi' ? 'अनुमानित कीमत' : 'Estimated Price'}</span>
        </div>

        {/* Location Row */}
        <div className="card-location-row">
          <MapPin size={13} className="location-icon" />
          <span className="location-name">{animal.location || copy.mitera}</span>
        </div>

        {/* Action Buttons Row */}
        <div className="card-actions-row">
          <button className="card-detail-btn" onClick={() => select(animal)}>
            {copy.viewDetails} <ArrowRight size={13} />
          </button>
          <a href={`tel:+91${PHONE}`} className="card-call-btn" title={copy.callDirect}>
            <Phone size={15} />
          </a>
        </div>
      </div>
    </article>
  );
}

/* =========================================================================
   4. ADD ANIMAL MODAL / FORM
   ========================================================================= */
function AddAnimalModal({ close, submit, notify, language, copy }) {
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Form values state for draft functionality (Ab saare fields blank/empty rahenge)
  const [formData, setFormData] = useState(() => {
    try {
      const saved = window.localStorage.getItem('lucky_animal_draft');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      type: 'Cow',
      breed: '',
      milkCapacityLiters: '',
      age: '',
      price: '',
      location: '',
      sellerName: '',
      sellerPhone: '',
      description: ''
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    try {
      window.localStorage.setItem('lucky_animal_draft', JSON.stringify(formData));
      notify(copy.draftSaved, 'success');
    } catch {
      notify('Unable to save draft', 'error');
    }
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        notify('File exceeds 10MB limit', 'error');
        return;
      }
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formElement = e.currentTarget;
    const data = new FormData(formElement);
    try {
      await submit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-screen" onMouseDown={close}>
      <div className="add-animal-modal-card" onMouseDown={(e) => e.stopPropagation()}>
        {/* Modal Sticky Header */}
        <div className="modal-header-bar">
          <div>
            <span className="modal-eyebrow">{copy.addNewListing}</span>
            <h2 className="modal-title">{copy.addAnimalTitle}</h2>
          </div>
          <button className="modal-close-icon-btn" onClick={close} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Form Body */}
        <form onSubmit={handleSubmitForm} className="add-animal-form">
          <div className="modal-scroll-body">
            {/* SECTION 1: ANIMAL INFORMATION */}
            <div className="form-section-box">
              <h4 className="form-section-heading">
                <Tag size={16} />
                <span>{copy.sectionAnimal}</span>
              </h4>

              <div className="form-two-col-grid">
                <div className="field-group">
                  <label className="field-label">
                    {copy.category} <span className="req-star">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Cow">🐄 {copy.cow} (Cow)</option>
                    <option value="Buffalo">🐃 {copy.buffalo} (Buffalo)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">
                    {copy.breedField} <span className="req-star">*</span>
                  </label>
                  <input
                    name="breed"
                    type="text"
                    required
                    value={formData.breed}
                    onChange={handleChange}
                    placeholder={copy.breedPlaceholder}
                    className="form-input"
                    list="breeds-list"
                  />
                  <datalist id="breeds-list">
                    {COMMON_BREEDS.map((b) => (
                      <option key={b} value={b} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="form-two-col-grid">
                <div className="field-group">
                  <label className="field-label">
                    {copy.milkField} <span className="req-star">*</span>
                  </label>
                  <input
                    name="milkCapacityLiters"
                    type="number"
                    step="0.5"
                    min="1"
                    max="45"
                    required
                    value={formData.milkCapacityLiters}
                    onChange={handleChange}
                    placeholder="10"
                    className="form-input"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">
                    {copy.ageField} <span className="req-star">*</span>
                  </label>
                  <input
                    name="age"
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="4"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">
                  {copy.askingField} <span className="req-star">*</span>
                </label>
                <div className="input-currency-wrap">
                  <span className="currency-prefix">₹</span>
                  <input
                    name="price"
                    type="number"
                    min="5000"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="75000"
                    className="form-input with-prefix"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: LOCATION & SELLER CONTACT */}
            <div className="form-section-box">
              <h4 className="form-section-heading">
                <MapPin size={16} />
                <span>{copy.sectionLocation}</span>
              </h4>

              <div className="field-group">
                <label className="field-label">
                  {copy.locationField} <span className="req-star">*</span>
                </label>
                <input
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={copy.locationPlaceholder}
                  className="form-input"
                />
              </div>

              <div className="form-two-col-grid">
                <div className="field-group">
                  <label className="field-label">
                    {copy.yourName} <span className="req-star">*</span>
                  </label>
                  <input
                    name="sellerName"
                    type="text"
                    required
                    value={formData.sellerName}
                    onChange={handleChange}
                    placeholder={copy.yourNamePlaceholder}
                    className="form-input"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">
                    {copy.yourPhone} <span className="req-star">*</span>
                  </label>
                  <input
                    name="sellerPhone"
                    type="tel"
                    required
                    value={formData.sellerPhone}
                    onChange={handleChange}
                    placeholder="9926361994"
                    className="form-input"
                  />
                </div>
              </div>

              <p className="privacy-note">
                <ShieldCheck size={14} className="green-accent" />
                <span>{copy.detailsPrivate}</span>
              </p>
            </div>

            {/* SECTION 2.5: DESCRIPTION */}
            <div className="field-group" style={{marginTop: '0'}}>
              <label className="field-label">
                {language === 'hi' ? 'पशु की विशेषताएं / विवरण' : 'Animal Features / Description'}
                <span style={{fontSize:'0.75rem', fontWeight:400, color:'var(--text-muted)', marginLeft:'6px'}}>
                  ({language === 'hi' ? 'वैकल्पिक' : 'Optional'})
                </span>
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder={language === 'hi'
                  ? 'उदा. दो ब्यांत, शांत स्वभाव, गर्भवती नहीं, खूंटे से बंधती है, दाना-पानी ठीक से खाती है...'
                  : 'e.g. 2nd lactation, gentle temperament, not pregnant, eats well, vaccinated...'}
                className="form-input"
                style={{resize:'vertical', minHeight:'80px'}}
              />
            </div>

            {/* SECTION 3: PHOTO UPLOAD */}
            <div className="form-section-box">
              <h4 className="form-section-heading">
                <ImagePlus size={16} />
                <span>{copy.sectionPhoto}</span>
              </h4>

              <label className={`photo-upload-dropzone ${preview ? 'has-preview' : ''}`}>
                {preview ? (
                  <div className="upload-preview-container">
                    <img src={preview} alt="Animal preview" className="uploaded-preview-img" />
                    <div className="upload-preview-overlay">
                      <span className="btn-chip">{copy.changePhoto}</span>
                      <button
                        type="button"
                        className="btn-chip danger"
                        onClick={handleRemovePhoto}
                      >
                        <Trash2 size={14} /> {copy.removePhoto}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="upload-empty-placeholder">
                    <div className="upload-icon-circle">
                      <UploadIcon size={24} />
                    </div>
                    <strong className="upload-prompt">{copy.clearPhoto}</strong>
                    <span className="upload-subprompt">{copy.imageHint}</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden-file-input"
                />
              </label>
            </div>
          </div>

          {/* STICKY BOTTOM ACTIONS BAR */}
          <div className="modal-sticky-actions-bar">
            <button type="button" className="btn-cancel" onClick={close}>
              {copy.cancel}
            </button>
            <div className="right-action-buttons">
              <button type="button" className="btn-draft" onClick={handleSaveDraft}>
                {copy.saveDraft}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-pill-btn submit-btn"
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <UploadIcon size={16} />
                    <span>{copy.publish}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   5. ANIMAL DETAILS MODAL
   ========================================================================= */
function AnimalDetailModal({ animal, close, language, copy }) {
  const isBuffalo = typeOf(animal) === 'Buffalo' || typeOf(animal) === 'भैंस';
  const categoryLabel = isBuffalo
    ? (language === 'hi' ? 'भैंस (Buffalo)' : 'Buffalo')
    : (language === 'hi' ? 'गाय (Cow)' : 'Cow');

  return (
    <div className="modal-backdrop-screen" onMouseDown={close}>
      <div className="detail-modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <button className="detail-modal-close-btn" onClick={close} aria-label="Close details">
          <X size={20} />
        </button>

        <div className="detail-modal-layout">
          {/* Left Media Column */}
          <div className="detail-media-pane">
            <img
              src={imageOf(animal)}
              alt={animal.title}
              className="detail-main-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImage(animal);
              }}
            />
            <div className="detail-image-badges">
              <span className={`detail-cat-badge ${isBuffalo ? 'buffalo' : 'cow'}`}>
                {isBuffalo ? '🐃 ' : '🐄 '}{categoryLabel}
              </span>
              <span className="detail-verified-badge">
                <BadgeCheck size={14} />
                {copy.verifiedBadge}
              </span>
            </div>
          </div>

          {/* Right Info Column */}
          <div className="detail-info-pane">
            <div className="detail-header-group">
              <span className="detail-id-tag">ID: LB-{animal.id}</span>
              <h2 className="detail-title">{animal.title}</h2>
              <div className="detail-price-line">
                <span className="detail-price-value">{money(animal.price)}</span>
                <span className="detail-location-pill">
                  <MapPin size={13} /> {animal.location || copy.mitera}
                </span>
              </div>
            </div>

            {/* 4 Specs Key Matrix */}
            <div className="detail-specs-matrix">
              <div className="matrix-cell">
                <Tag size={16} className="matrix-icon" />
                <div className="matrix-text">
                  <small>{copy.breed}</small>
                  <strong>{animal.breed}</strong>
                </div>
              </div>

              <div className="matrix-cell">
                <Droplets size={16} className="matrix-icon milk" />
                <div className="matrix-text">
                  <small>{copy.milkDay}</small>
                  <strong>{milkOf(animal)} L/{language === 'hi' ? 'दिन' : 'day'}</strong>
                </div>
              </div>

              <div className="matrix-cell">
                <CalendarDays size={16} className="matrix-icon" />
                <div className="matrix-text">
                  <small>{copy.age}</small>
                  <strong>{animal.age} {language === 'hi' ? 'वर्ष' : 'years'}</strong>
                </div>
              </div>

              <div className="matrix-cell">
                <IndianRupee size={16} className="matrix-icon" />
                <div className="matrix-text">
                  <small>{copy.askingPrice}</small>
                  <strong>{money(animal.price)}</strong>
                </div>
              </div>
            </div>

            {/* Description / Features */}
            {animal.description && (
              <div className="detail-health-box">
                <h4 className="health-box-heading">
                  <Sparkles size={16} className="green-accent" />
                  <span>{language === 'hi' ? 'पशु की विशेषताएं' : 'Animal Features'}</span>
                </h4>
                <p style={{fontSize:'0.9rem', color:'var(--text-body)', lineHeight:'1.6', margin:0}}>
                  {animal.description}
                </p>
              </div>
            )}

            {/* Seller Info Card */}
            <div className="detail-seller-box">
              <div className="seller-avatar-initials">
                {(animal.sellerName || 'LB').slice(0, 2).toUpperCase()}
              </div>
              <div className="seller-details-text">
                <strong>{animal.sellerName || 'Lucky Business Partner'}</strong>
                <small>{copy.mitera} · {copy.verifiedText}</small>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="detail-actions-group">
              <a
                href={waOf(animal)}
                target="_blank"
                rel="noreferrer"
                className="detail-action-btn wa"
              >
                <MessageCircle size={18} />
                <span>{language === 'hi' ? 'व्हाट्सऐप पर बात करें' : 'Chat on WhatsApp'}</span>
              </a>

              <a href={`tel:+91${PHONE}`} className="detail-action-btn call">
                <Phone size={17} />
                <span>{copy.callDirect}</span>
              </a>

              <a
                href={`https://wa.me/91${PHONE}?text=${encodeURIComponent(
                  `Namaste Lucky Business, mujhe ${animal.title} (ID: LB-${animal.id}) me ruchi hai. Kripya video aur details bhejein.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="detail-action-btn interested"
              >
                <Heart size={16} />
                <span>{copy.imInterested}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. SELL PAGE VIEW
   ========================================================================= */
function SellPageView({ onUpload, language, copy }) {
  return (
    <main className="sell-page-container">
      <section className="sell-hero-block">
        <span className="section-eyebrow">{copy.sell}</span>
        <h1 className="sell-hero-heading">
          {copy.sellTitle} <br />
          <span className="green-accent">{copy.sellTitle2}</span>
        </h1>
        <p className="sell-hero-lead">{copy.sellText}</p>
        <button className="primary-pill-btn sell-cta-btn" onClick={onUpload}>
          <UploadIcon size={18} />
          <span>{copy.startListing}</span>
        </button>
      </section>

      <section className="sell-steps-block">
        <div className="section-head-center">
          <span className="section-eyebrow">{copy.howItWorks}</span>
          <h2 className="section-main-heading">{copy.howItWorks}</h2>
        </div>

        <div className="steps-container">
          <div className="step-box">
            <div className="step-num-badge">01</div>
            <h4 className="step-box-title">{copy.step1}</h4>
            <p className="step-box-desc">{copy.step1Text}</p>
          </div>
          <div className="step-box">
            <div className="step-num-badge">02</div>
            <h4 className="step-box-title">{copy.step2}</h4>
            <p className="step-box-desc">{copy.step2Text}</p>
          </div>
          <div className="step-box">
            <div className="step-num-badge">03</div>
            <h4 className="step-box-title">{copy.step3}</h4>
            <p className="step-box-desc">{copy.step3Text}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================================
   7. ADMIN DASHBOARD & LOGIN VIEWS
   ========================================================================= */
function AdminDashboardView({ listings, onUpload, onDelete, onLogout, language, copy }) {
  const [adminSearch, setAdminSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const activeCount = listings.filter((a) => a.status !== 'SOLD').length;
  const soldCount = listings.filter((a) => a.status === 'SOLD').length;
  const pendingCount = 0; // all verified currently
  const totalSellers = new Set(listings.map((a) => a.sellerName || 'Lucky Business')).size;

  const filteredAdminListings = useMemo(() => {
    return listings.filter((item) => {
      const q = adminSearch.toLowerCase();
      const matchSearch =
        !q ||
        (item.title || '').toLowerCase().includes(q) ||
        (item.breed || '').toLowerCase().includes(q) ||
        String(item.id).includes(q);
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'AVAILABLE' && item.status !== 'SOLD') ||
        (statusFilter === 'SOLD' && item.status === 'SOLD');
      return matchSearch && matchStatus;
    });
  }, [listings, adminSearch, statusFilter]);

  return (
    <main className="admin-container">
      {/* Admin Header */}
      <div className="admin-top-bar">
        <div>
          <span className="section-eyebrow">{copy.adminTitle}</span>
          <h1 className="admin-title">
            {copy.adminWelcome} <span className="green-accent">Papa.</span>
          </h1>
          <p className="admin-subtitle">{copy.adminText}</p>
        </div>

        <div className="admin-top-actions">
          <button className="primary-pill-btn" onClick={onUpload}>
            <Plus size={16} />
            <span>{copy.addAnimal}</span>
          </button>
          <button className="btn-logout" onClick={onLogout}>
            <LogOut size={16} />
            <span>{copy.logout}</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="admin-metrics-grid">
        <div className="metric-card">
          <span className="metric-label">{copy.activeListings}</span>
          <strong className="metric-number">{activeCount}</strong>
          <span className="metric-trend green">↑ 100% {language === 'hi' ? 'सत्यापित' : 'Verified'}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">{copy.pendingListings}</span>
          <strong className="metric-number">{pendingCount}</strong>
          <span className="metric-trend neutral">{language === 'hi' ? 'सब अपडेटेड है' : 'All clear'}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">{copy.soldThisMonth}</span>
          <strong className="metric-number">{soldCount}</strong>
          <span className="metric-trend green">✓ {language === 'hi' ? 'सफल सौदे' : 'Completed Deals'}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">{copy.totalSellers}</span>
          <strong className="metric-number">{totalSellers}</strong>
          <span className="metric-trend">{copy.mitera}</span>
        </div>
      </div>

      {/* Admin Listings Table Card */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div>
            <h3 className="admin-table-title">{copy.allListings}</h3>
            <span className="admin-table-count">({filteredAdminListings.length} {language === 'hi' ? 'पशु' : 'animals'})</span>
          </div>

          <div className="admin-filter-bar">
            {/* Search inside admin */}
            <div className="admin-search-input-wrap">
              <Search size={15} />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder={copy.searchPlaceholder}
                className="admin-search-box"
              />
            </div>

            {/* Status tab filters */}
            <div className="admin-status-tabs">
              <button
                className={`status-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ALL')}
              >
                {copy.all}
              </button>
              <button
                className={`status-tab ${statusFilter === 'AVAILABLE' ? 'active' : ''}`}
                onClick={() => setStatusFilter('AVAILABLE')}
              >
                {copy.available}
              </button>
              <button
                className={`status-tab ${statusFilter === 'SOLD' ? 'active' : ''}`}
                onClick={() => setStatusFilter('SOLD')}
              >
                {copy.sold}
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{language === 'hi' ? 'फोटो' : 'Photo'}</th>
                <th>{language === 'hi' ? 'पशु व नस्ल' : 'Animal & Breed'}</th>
                <th>{language === 'hi' ? 'दूध क्षमता' : 'Milk Yield'}</th>
                <th>{language === 'hi' ? 'कीमत' : 'Price'}</th>
                <th>{language === 'hi' ? 'विक्रेता व स्थान' : 'Seller & Location'}</th>
                <th>{language === 'hi' ? 'स्थिति' : 'Status'}</th>
                <th className="text-right">{language === 'hi' ? 'हटाएं' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdminListings.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={imageOf(item)}
                      alt={item.title}
                      className="admin-thumb-img"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImage(item);
                      }}
                    />
                  </td>
                  <td>
                    <strong className="table-animal-title">{item.title}</strong>
                    <div className="table-animal-sub">
                      <span>LB-{item.id}</span> · <span>{typeOf(item)}</span> · <span>{item.breed}</span>
                    </div>
                  </td>
                  <td>
                    <span className="table-metric">{milkOf(item)} L/{language === 'hi' ? 'दिन' : 'day'}</span>
                  </td>
                  <td>
                    <strong className="table-price">{money(item.price)}</strong>
                  </td>
                  <td>
                    <div>{item.sellerName || 'Lucky Business'}</div>
                    <small className="table-loc">{item.location || copy.mitera}</small>
                  </td>
                  <td>
                    <span className={`status-badge-chip ${item.status === 'SOLD' ? 'sold' : 'active'}`}>
                      {item.status === 'SOLD' ? copy.sold : copy.available}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      className="table-delete-btn"
                      onClick={() => {
                        if (window.confirm(language === 'hi' ? 'क्या आप इस लिस्टिंग को हटाना चाहते हैं?' : 'Remove this listing?')) {
                          onDelete(item.id);
                        }
                      }}
                      title={language === 'hi' ? 'हटाएं' : 'Delete listing'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAdminListings.length === 0 && (
                <tr>
                  <td colSpan={7} className="table-empty-cell">
                    {copy.noAnimals}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function AdminLoginView({ onLogin, language, copy }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(phone, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="login-card-header">
          <div className="login-icon-circle">
            <Lock size={24} className="green-accent" />
          </div>
          <h2 className="login-card-title">{copy.loginTitle}</h2>
          <p className="login-card-subtitle">{copy.loginText}</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="field-group">
            <label className="field-label">
              {language === 'hi' ? 'अधिकृत मोबाइल नंबर' : 'Registered Mobile Number'}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={copy.loginPhonePlaceholder}
              className="form-input"
              autoComplete="username"
            />
          </div>

          <div className="field-group">
            <label className="field-label">
              {language === 'hi' ? 'पासवर्ड' : 'Password'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={copy.loginPassPlaceholder}
              className="form-input"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} className="primary-pill-btn full-width login-submit-btn">
            {loading ? (
              <span>{language === 'hi' ? 'जांच हो रही है...' : 'Authenticating...'}</span>
            ) : (
              <>
                <Lock size={16} />
                <span>{copy.login}</span>
              </>
            )}
          </button>
        </form>

        <div className="login-card-foot">
          <ShieldCheck size={15} className="green-accent" />
          <span>Lucky Business Security System</span>
        </div>
      </div>
    </main>
  );
}
