import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  Filter,
  Heart,
  ImagePlus,
  IndianRupee,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  Upload as UploadIcon,
  X,
  Droplets,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { checkAdmin, deleteLivestock, fetchLivestock, loginAdmin, uploadLivestock } from './api';
import { sampleListings } from './data';

const PHONE = '9926361994';
const API_ORIGIN = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
  : 'http://localhost:9090';

const FALLBACK_COW = 'https://images.unsplash.com/photo-1527153857715-3908f6e3b7fd?auto=format&fit=crop&w=1200&q=85';
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
    browse: 'Browse animals',
    sell: 'Sell with us',
    admin: 'Admin desk',
    callUs: 'Call us',
    mitera: 'Mitera, MP',
    live: 'Live marketplace',
    demo: 'Demo marketplace',
    updated: 'Updated just now',
    explore: 'Explore listings',
    listAnimal: 'List your animal',
    verified: 'Verified sellers',
    honest: 'Honest details',
    direct: 'Direct contact',
    all: 'All animals',
    search: 'Search animals',
    searchPlaceholder: 'Search by breed, location, or name...',
    milkAny: 'Any milk yield',
    anyPrice: 'Any price',
    under70: 'Under ₹70k',
    c70to1: '₹70k - ₹1L',
    above1: 'Above ₹1L',
    findAnimal: 'Find an animal',
    feelsRight: 'that feels right.',
    heroText:
      'Healthy cows and buffaloes, shared by families and farms we know. Browse with confidence, ask directly, and bring the right one home.',
    marketplace: 'The marketplace',
    lookingForHome: 'Animals looking',
    newHome: 'for a new home',
    noAnimals: 'No animals found',
    tryAnother: 'Try another keyword or filter to discover more.',
    availableCount: 'animals available',
    newestFirst: 'Newest first',
    viewDetails: 'View details',
    whatsapp: 'WhatsApp',
    callDirect: 'Call direct',
    breed: 'Breed',
    milkDay: 'Milk / day',
    age: 'Age',
    askingPrice: 'Asking price',
    detailText:
      'A healthy, well-cared-for animal shared by a local seller. Contact Lucky Business directly for current availability, videos, and an in-person visit.',
    sellTitle: 'Put your animal',
    sellTitle2: 'in good hands.',
    sellText:
      'Share a few details and our team will help your listing reach serious and verified buyers across the region.',
    startListing: 'Start a listing',
    step1: 'Tell us about it',
    step1Text: 'Breed, milk yield, age, and your asking price.',
    step2: 'Share a clear photo',
    step2Text: 'Good light helps buyers see the animal properly.',
    step3: 'We connect you',
    step3Text: 'Interested buyers reach you through Lucky Business.',
    adminTitle: 'Admin desk',
    adminWelcome: 'Good morning,',
    adminText: 'Manage your marketplace from one calm place.',
    addAnimal: 'Add animal',
    activeListings: 'Active listings',
    totalEnquiries: 'Total enquiries',
    soldThisMonth: 'Sold this month',
    allListings: 'All listings',
    available: 'Available',
    loginTitle: 'Admin login',
    loginText: 'Enter your phone number and password to manage listings.',
    login: 'Login',
    loginPlaceholder: 'Enter admin key',
    addNewListing: 'New listing',
    addAnimalTitle: 'Add an animal',
    clearPhoto: 'Add a clear photo',
    imageHint: 'JPG or PNG · Maximum 10MB',
    animalName: 'Animal name',
    category: 'Category',
    breedField: 'Breed',
    milkField: 'Milk yield (liters/day)',
    ageField: 'Age (years)',
    askingField: 'Asking price (₹)',
    locationField: 'Location',
    yourName: 'Your name',
    yourPhone: 'Your phone',
    detailsPrivate: 'Your details stay private',
    publish: 'Publish listing',
    goodAnimals: 'Good animals. Good people. Good business.',
    headerBrand: 'Lucky Business',
    description: 'Trusted local livestock marketplace',
    cow: 'Cow',
    buffalo: 'Buffalo',
    language: 'Language',
    talkReal: 'Talk to a real person,',
    talkReal2: 'not a form.',
    contactHelp: 'Tell us what you are looking for, and we will help you find the right match.',
    sendWhatsApp: 'Send WhatsApp message',
  },
  hi: {
    browse: 'जानवर देखें',
    sell: 'बेचें',
    admin: 'एडमिन डेस्क',
    callUs: 'कॉल करें',
    mitera: 'मितेरा, म.प्र.',
    live: 'लाइव मार्केटप्लेस',
    demo: 'डेमो मार्केटप्लेस',
    updated: 'अभी अपडेट हुआ',
    explore: 'लिस्ट देखें',
    listAnimal: 'जानवर सूचीबद्ध करें',
    verified: 'सत्यापित विक्रेता',
    honest: 'ईमानदार जानकारी',
    direct: 'सीधा संपर्क',
    all: 'सभी जानवर',
    search: 'जानवर खोजें',
    searchPlaceholder: 'प्रजाति, स्थान या नाम से खोजें...',
    milkAny: 'दूध: कोई भी',
    anyPrice: 'कीमत: कोई भी',
    under70: '₹70k से कम',
    c70to1: '₹70k - ₹1L',
    above1: '₹1L से ऊपर',
    findAnimal: 'एक जानवर खोजें',
    feelsRight: 'जो आपके लिए सही हो।',
    heroText:
      'स्वस्थ गायें और भैंसें, जिन्हें स्थानीय परिवार और डेयरी किसान अच्छी तरह जानते हैं। भरोसे से देखें, सीधे पूछें और सही जानवर घर लाएं।',
    marketplace: 'मार्केटप्लेस',
    lookingForHome: 'पशुधन',
    newHome: 'नए घर की तलाश में',
    noAnimals: 'कोई जानवर नहीं मिला',
    tryAnother: 'अधिक जानवर देखने के लिए अलग शब्द या फ़िल्टर चुनें।',
    availableCount: 'जानवर उपलब्ध',
    newestFirst: 'नवीनतम पहले',
    viewDetails: 'विवरण देखें',
    whatsapp: 'व्हाट्सऐप',
    callDirect: 'सीधा कॉल',
    breed: 'प्रजाति',
    milkDay: 'दूध / दिन',
    age: 'उम्र',
    askingPrice: 'कीमत',
    detailText:
      'एक स्वस्थ और अच्छे से देखभाल किया गया जानवर। ताज़ा उपलब्धता, वीडियो और मौके पर देखने के लिए Lucky Business से सीधे संपर्क करें।',
    sellTitle: 'अपना जानवर',
    sellTitle2: 'अच्छे हाथों में दें।',
    sellText:
      'कुछ विवरण साझा करें और हमारी टीम आपके जानवर को गंभीर और सत्यापित खरीदारों तक पहुँचाएगी।',
    startListing: 'लिस्ट शुरू करें',
    step1: 'हमें बताएं',
    step1Text: 'प्रजाति, दूध की मात्रा, उम्र और आपकी उचित कीमत।',
    step2: 'साफ फोटो साझा करें',
    step2Text: 'अच्छा प्रकाश खरीदार को जानवर को सही रूप से दिखाता है।',
    step3: 'हम जोड़ते हैं',
    step3Text: 'रुचि रखने वाले खरीदार Lucky Business के माध्यम से आपसे संपर्क करेंगे।',
    adminTitle: 'एडमिन डेस्क',
    adminWelcome: 'शुभ प्रभात,',
    adminText: 'अपने पूरे मार्केटप्लेस को एक व्यवस्थित जगह से संभालें।',
    addAnimal: 'जानवर जोड़ें',
    activeListings: 'सक्रिय लिस्टिंग',
    totalEnquiries: 'कुल पूछताछ',
    soldThisMonth: 'इस महीने बिके',
    allListings: 'सभी लिस्टिंग',
    available: 'उपलब्ध',
    loginTitle: 'एडमिन लॉगिन',
    loginText: 'लिस्टिंग प्रबंधित करने के लिए अपना फोन नंबर और पासवर्ड दर्ज करें।',
    login: 'लॉगिन करें',
    loginPlaceholder: 'एडमिन कुंजी दर्ज करें',
    addNewListing: 'नई लिस्टिंग',
    addAnimalTitle: 'जानवर जोड़ें',
    clearPhoto: 'साफ फोटो अपलोड करें',
    imageHint: 'JPG या PNG · अधिकतम 10MB',
    animalName: 'जानवर का नाम',
    category: 'श्रेणी',
    breedField: 'प्रजाति',
    milkField: 'दूध की मात्रा (लीटर/दिन)',
    ageField: 'उम्र (वर्ष)',
    askingField: 'कीमत (₹)',
    locationField: 'स्थान',
    yourName: 'आपका नाम',
    yourPhone: 'आपका फोन',
    detailsPrivate: 'आपकी जानकारी सुरक्षित रहेगी',
    publish: 'लिस्टिंग प्रकाशित करें',
    goodAnimals: 'अच्छे जानवर · अच्छे लोग · सच्चा कारोबार',
    headerBrand: 'Lucky Business',
    description: 'स्थानीय पशुधन मार्केटप्लेस',
    cow: 'गाय',
    buffalo: 'भैंस',
    language: 'भाषा',
    talkReal: 'सीधे हमसे बात करें,',
    talkReal2: 'बिना किसी परेशानी के।',
    contactHelp: 'आपको कैसी गाय या भैंस चाहिए, हमें बताइए और हम सही पशु चुनने में पूरी मदद करेंगे।',
    sendWhatsApp: 'व्हाट्सऐप पर बात करें',
  },
};

const filterDefaults = {
  en: { search: '', type: 'All animals', milk: 'Any milk yield', price: 'Any price' },
  hi: { search: '', type: 'All animals', milk: 'Any milk yield', price: 'Any price' },
};

const typeLabel = (animal, lang) => {
  const kind = typeOf(animal);
  if (lang === 'hi') {
    return kind === 'Cow' || kind === 'cow' ? 'गाय' : kind === 'Buffalo' || kind === 'buffalo' ? 'भैंस' : kind;
  }
  return kind;
};

export default function App() {
  const [listings, setListings] = useState(sampleListings);
  const [tab, setTab] = useState('browse');
  const [selected, setSelected] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [menu, setMenu] = useState(false);
  const [live, setLive] = useState(false);
  const [adminKey, setAdminKey] = useState(
    () => window.localStorage.getItem('lucky-business-admin-session') || ''
  );
  const [language, setLanguage] = useState('hi');
  const [filters, setFilters] = useState(filterDefaults.hi);

  useEffect(() => {
    setFilters(filterDefaults[language]);
  }, [language]);

  useEffect(() => {
    fetchLivestock()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setListings(data);
        } else {
          setListings(sampleListings);
        }
        setLive(true);
      })
      .catch(() => {
        setListings(sampleListings);
        setLive(false);
      });
  }, []);

  useEffect(() => {
    if (!adminKey) return;
    checkAdmin(adminKey).catch(() => {
      window.localStorage.removeItem('lucky-business-admin-session');
      setAdminKey('');
    });
  }, [adminKey]);

  const copy = translations[language];

  const filtered = useMemo(() => {
    return listings.filter((animal) => {
      const searchValue = filters.search.trim().toLowerCase();
      const text = `${animal.title} ${animal.breed} ${animal.location || ''}`.toLowerCase();
      const matchesSearch = !searchValue || text.includes(searchValue);
      const matchesType = filters.type === 'All animals' || typeOf(animal) === filters.type;
      const matchesMilk =
        filters.milk === 'Any milk yield' || (milkOf(animal) || 0) >= Number(filters.milk);
      const matchesPrice =
        filters.price === 'Any price' ||
        (filters.price === 'Under ₹70k' && animal.price < 70000) ||
        (filters.price === '₹70k - ₹1L' && animal.price >= 70000 && animal.price <= 100000) ||
        (filters.price === 'Above ₹1L' && animal.price > 100000);

      return matchesSearch && matchesType && matchesMilk && matchesPrice;
    });
  }, [listings, filters]);

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 4500);
  };

  const addListing = async (formData) => {
    try {
      const created = await uploadLivestock(formData);
      setListings((items) => [created, ...items]);
      notify(language === 'hi' ? 'आपकी लिस्टिंग सफलतापूर्वक लाइव हो गई है।' : 'Your listing is now live.');
    } catch {
      notify(language === 'hi' ? 'लिस्टिंग सेव नहीं हुई।' : 'Listing save failed.');
    }
    setUploadOpen(false);
  };

  const remove = async (id) => {
    try {
      await deleteLivestock(id, adminKey);
      setListings((items) => items.filter((animal) => animal.id !== id));
      notify(language === 'hi' ? 'लिस्टिंग हटा दी गई।' : 'Listing removed.');
    } catch {
      notify(language === 'hi' ? 'एडमिन अनुमति आवश्यक है।' : 'Admin permission required.');
    }
  };

  return (
    <div className="app-shell">
      {/* Top Navigation */}
      <header className="topbar">
        <a className="brand" href="#top" onClick={() => setTab('browse')}>
          <span className="brand-mark">
            <Leaf size={22} />
          </span>
          <div className="brand-text">
            <strong>Lucky</strong>
            <em>Business</em>
          </div>
        </a>

        <nav className={menu ? 'main-nav open' : 'main-nav'}>
          <button
            className={tab === 'browse' ? 'nav-link active' : 'nav-link'}
            onClick={() => {
              setTab('browse');
              setMenu(false);
            }}
          >
            {copy.browse}
          </button>
          <button
            className={tab === 'sell' ? 'nav-link active' : 'nav-link'}
            onClick={() => {
              setTab('sell');
              setMenu(false);
            }}
          >
            {copy.sell}
          </button>
          <button
            className={tab === 'admin' ? 'nav-link active' : 'nav-link'}
            onClick={() => {
              setTab('admin');
              setMenu(false);
            }}
          >
            {copy.admin}
          </button>
        </nav>

        <div className="header-actions">
          <div className="lang-switch" aria-label={copy.language}>
            <div className="language-toggle">
              <button
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'language-option active' : 'language-option'}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={language === 'hi' ? 'language-option active' : 'language-option'}
              >
                हिंदी
              </button>
            </div>
          </div>

          <a className="header-call" href={`tel:+91${PHONE}`}>
            <span className="call-pulse-dot" />
            <Phone size={15} />
            <span>+91 {PHONE}</span>
          </a>

          <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle menu">
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Floating Notification */}
      {notice && (
        <div className="notice">
          <BadgeCheck size={20} />
          <span>{notice}</span>
          <button onClick={() => setNotice('')}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Content Tabs */}
      {tab === 'browse' && (
        <Browse
          listings={filtered}
          filters={filters}
          setFilters={setFilters}
          live={live}
          onSelect={setSelected}
          onUpload={() => setUploadOpen(true)}
          language={language}
          copy={copy}
        />
      )}

      {tab === 'sell' && (
        <SimpleSell onUpload={() => setUploadOpen(true)} language={language} copy={copy} />
      )}

      {tab === 'admin' &&
        (adminKey ? (
          <Admin
            listings={listings}
            onUpload={() => setUploadOpen(true)}
            onDelete={remove}
            language={language}
            copy={copy}
          />
        ) : (
          <AdminLogin
            language={language}
            copy={copy}
            onLogin={(phone, password) =>
              loginAdmin(phone, password)
                .then(({ adminKey: key }) => {
                  window.localStorage.setItem('lucky-business-admin-session', key);
                  setAdminKey(key);
                  notify(language === 'hi' ? 'एडमिन लॉगिन सफल रहा।' : 'Admin login successful.');
                })
                .catch(() =>
                  notify(language === 'hi' ? 'गलत फोन नंबर या पासवर्ड।' : 'Wrong phone number or password.')
                )
            }
          />
        ))}

      {/* Footer */}
      <footer>
        <div className="footer-brand">
          <span className="brand-mark">
            <Leaf size={16} />
          </span>
          <strong>{copy.headerBrand}</strong>
        </div>
        <span>{copy.goodAnimals}</span>
        <span>© 2026 Lucky Business · All rights reserved</span>
      </footer>

      {/* Modals */}
      {selected && (
        <Detail animal={selected} close={() => setSelected(null)} language={language} copy={copy} />
      )}
      {uploadOpen && (
        <Upload
          close={() => setUploadOpen(false)}
          submit={addListing}
          language={language}
          copy={copy}
        />
      )}
    </div>
  );
}

function Browse({ listings, filters, setFilters, live, onSelect, onUpload, language, copy }) {
  return (
    <main id="top">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="pulse-dot" />
            <span>{language === 'hi' ? 'प्रमाणित व विश्वसनीय पशुधन मार्केटप्लेस' : 'Verified Livestock Marketplace'}</span>
          </div>

          <h1>
            {copy.findAnimal}
            <br />
            <span>{copy.feelsRight}</span>
          </h1>

          <p>{copy.heroText}</p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => document.getElementById('marketplace').scrollIntoView({ behavior: 'smooth' })}
            >
              {copy.explore} <ArrowRight size={17} />
            </button>
            <button className="text-button" onClick={onUpload}>
              <Plus size={17} /> {copy.listAnimal}
            </button>
          </div>

          <div className="trust-row">
            <span>
              <ShieldCheck size={18} /> {copy.verified}
            </span>
            <span>
              <Heart size={18} /> {copy.honest}
            </span>
            <span>
              <MessageCircle size={18} /> {copy.direct}
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1534334527498-87d7a5b8e90f?auto=format&fit=crop&w=1200&q=85"
              alt="Healthy Cow in Farm"
            />
            <div className="hero-image-note">
              <span className="mini-avatar">LB</span>
              <div>
                <strong>{language === 'hi' ? 'सीधा संपर्क, सच्चा विश्वास' : 'Local, personal, reliable'}</strong>
                <small>{language === 'hi' ? 'अच्छे परिवारों को सही पशुधन से जोड़ना' : 'Helping families find better livestock'}</small>
              </div>
              <Sparkles size={18} />
            </div>
          </div>
          <div className="floating-stat">
            <strong>250+</strong>
            <span>
              {language === 'hi' ? (
                <>सफल पशुधन<br />संतुष्ट ग्राहक</>
              ) : (
                <>Animals sold<br />with trust</>
              )}
            </span>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="marketplace-section" id="marketplace">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{copy.marketplace}</span>
            <h2>
              {copy.lookingForHome} <br />
              <i>{copy.newHome}</i>
            </h2>
          </div>
          <div className="heading-side">
            <span className="online-dot" />
            <span>{live ? copy.live : copy.demo}</span>
            <small>{copy.updated}</small>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <div className="search-field">
            <Search size={18} />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder={copy.searchPlaceholder}
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <Select
            icon={<Filter size={16} />}
            value={filters.type}
            set={(value) => setFilters({ ...filters, type: value })}
            options={['All animals', 'Cow', 'Buffalo']}
            labels={{
              'All animals': copy.all,
              Cow: copy.cow,
              Buffalo: copy.buffalo,
            }}
          />

          <Select
            icon={<SlidersHorizontal size={16} />}
            value={filters.milk}
            set={(value) => setFilters({ ...filters, milk: value })}
            options={['Any milk yield', '10', '12']}
            labels={{
              'Any milk yield': copy.milkAny,
              '10': language === 'hi' ? '10+ ली./दिन' : '10+ L / day',
              '12': language === 'hi' ? '12+ ली./दिन' : '12+ L / day',
            }}
          />

          <Select
            icon={<IndianRupee size={16} />}
            value={filters.price}
            set={(value) => setFilters({ ...filters, price: value })}
            options={['Any price', 'Under ₹70k', '₹70k - ₹1L', 'Above ₹1L']}
            labels={{
              'Any price': copy.anyPrice,
              'Under ₹70k': copy.under70,
              '₹70k - ₹1L': copy.c70to1,
              'Above ₹1L': copy.above1,
            }}
          />
        </div>

        <div className="results-line">
          <span>
            <strong>{listings.length}</strong> {copy.availableCount}
          </span>
          <span className="sort-button">
            {copy.newestFirst} <ChevronDown size={15} />
          </span>
        </div>

        <div className="listing-grid">
          {listings.map((animal) => (
            <Card
              key={animal.id}
              animal={animal}
              select={onSelect}
              language={language}
              copy={copy}
            />
          ))}

          {!listings.length && (
            <div className="empty-state">
              <Search size={32} />
              <h3>{copy.noAnimals}</h3>
              <p>{copy.tryAnother}</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-band">
        <div>
          <span className="section-kicker">{language === 'hi' ? 'सीधा संपर्क' : 'Ask Directly'}</span>
          <h2>
            {copy.talkReal}
            <br />
            <i>{copy.talkReal2}</i>
          </h2>
          <p>{copy.contactHelp}</p>
        </div>
        <div className="contact-actions">
          <a
            href={`https://wa.me/91${PHONE}?text=${encodeURIComponent(
              'Namaste Lucky Business, mujhe pashudhan khareedne ke baare mein jaankari chahiye.'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="whatsapp-button"
          >
            <MessageCircle size={20} />
            <span>{copy.sendWhatsApp}</span>
            <ArrowRight size={17} />
          </a>
          <a href={`tel:+91${PHONE}`} className="call-button">
            <Phone size={18} />
            <span>+91 {PHONE}</span>
          </a>
        </div>
      </section>
    </main>
  );
}

function Select({ icon, value, set, options, labels = {} }) {
  return (
    <div className="filter-select">
      {icon}
      <select value={value} onChange={(e) => set(e.target.value)}>
        {options.map((option) => (
          <option value={option} key={option}>
            {labels[option] || option}
          </option>
        ))}
      </select>
      <ChevronDown size={15} />
    </div>
  );
}

function Card({ animal, select, language, copy }) {
  return (
    <article className="listing-card">
      <button className="card-image" onClick={() => select(animal)} aria-label={animal.title}>
        <img
          src={imageOf(animal)}
          alt={animal.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage(animal);
          }}
        />
        <span className="type-badge">{typeLabel(animal, language)}</span>
        <span className="verified-badge">
          <CheckCircle2 size={13} /> {language === 'hi' ? 'सत्यापित' : 'Verified'}
        </span>
      </button>

      <div className="card-content">
        <div className="card-title-row">
          <div>
            <span className="card-id">LB-{animal.id}</span>
            <h3>{animal.title}</h3>
          </div>
          <span className="price">{money(animal.price)}</span>
        </div>

        <div className="meta-row">
          <span title={animal.breed}>
            <Tag size={13} /> {animal.breed}
          </span>
          <span title={`${milkOf(animal)} L/day`}>
            <Droplets size={13} /> {milkOf(animal)} {language === 'hi' ? 'ली/दिन' : 'L/day'}
          </span>
          <span title={`${animal.age} years`}>
            <CalendarDays size={13} /> {animal.age} {language === 'hi' ? 'वर्ष' : 'yrs'}
          </span>
        </div>

        <div className="location-row">
          <MapPin size={14} />
          <span>{animal.location || copy.mitera}</span>
          <button className="quick-view" onClick={() => select(animal)}>
            {copy.viewDetails} <ArrowRight size={13} />
          </button>
        </div>

        <div className="card-actions">
          <a className="small-whatsapp" href={waOf(animal)} target="_blank" rel="noreferrer">
            <MessageCircle size={16} />
            <span>{copy.whatsapp}</span>
          </a>
          <a className="small-call" href={`tel:+91${PHONE}`} title={copy.callUs}>
            <Phone size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}

function Detail({ animal, close, language, copy }) {
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="detail-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={close} aria-label="Close modal">
          <X size={19} />
        </button>

        <img
          src={imageOf(animal)}
          alt={animal.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage(animal);
          }}
        />

        <div className="detail-body">
          <span className="section-kicker">
            LB-{animal.id} · {typeLabel(animal, language)}
          </span>
          <h2>{animal.title}</h2>
          <p className="detail-location">
            <MapPin size={15} /> {animal.location || copy.mitera}
          </p>

          <div className="detail-stats">
            <span>
              <strong>{animal.breed}</strong>
              <small>{copy.breed}</small>
            </span>
            <span>
              <strong>{milkOf(animal)} L</strong>
              <small>{copy.milkDay}</small>
            </span>
            <span>
              <strong>
                {animal.age} {language === 'hi' ? 'वर्ष' : 'yrs'}
              </strong>
              <small>{copy.age}</small>
            </span>
            <span>
              <strong>{money(animal.price)}</strong>
              <small>{copy.askingPrice}</small>
            </span>
          </div>

          <p className="detail-copy">{copy.detailText}</p>

          <div className="detail-actions">
            <a
              href={waOf(animal)}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-button"
            >
              <MessageCircle size={18} />
              <span>
                {copy.whatsapp} {language === 'hi' ? 'पर तुरंत पूछें' : 'Enquiry'}
              </span>
            </a>
            <a href={`tel:+91${PHONE}`} className="call-button">
              <Phone size={17} />
              <span>
                {language === 'hi' ? 'सीधा फोन करें' : 'Call directly'} (+91 {PHONE})
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleSell({ onUpload, language, copy }) {
  return (
    <main className="simple-page">
      <div className="simple-hero">
        <span className="section-kicker">{language === 'hi' ? 'हमसे बेचें' : 'Sell with us'}</span>
        <h1>
          {copy.sellTitle}
          <br />
          <i>{copy.sellTitle2}</i>
        </h1>
        <p>{copy.sellText}</p>
        <button className="primary-button" onClick={onUpload}>
          <UploadIcon size={17} /> {copy.startListing}
        </button>
      </div>

      <div className="steps">
        <div>
          <span>01</span>
          <h3>{copy.step1}</h3>
          <p>{copy.step1Text}</p>
        </div>
        <div>
          <span>02</span>
          <h3>{copy.step2}</h3>
          <p>{copy.step2Text}</p>
        </div>
        <div>
          <span>03</span>
          <h3>{copy.step3}</h3>
          <p>{copy.step3Text}</p>
        </div>
      </div>
    </main>
  );
}

function Admin({ listings, onUpload, onDelete, language, copy }) {
  const activeListings = listings.filter((animal) => animal.status !== 'SOLD').length;
  const soldListings = listings.filter((animal) => animal.status === 'SOLD').length;
  const totalEnquiries = Math.max(0, listings.length * 3);

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <span className="section-kicker">{copy.adminTitle}</span>
          <h1>
            {copy.adminWelcome} <i>Lucky Business.</i>
          </h1>
          <p>{copy.adminText}</p>
        </div>
        <button className="primary-button" onClick={onUpload}>
          <Plus size={17} /> {copy.addAnimal}
        </button>
      </div>

      <div className="admin-stats">
        <div>
          <span>{copy.activeListings}</span>
          <strong>{activeListings}</strong>
          <small>
            <span className="green-text">
              ↑ {Math.min(99, Math.max(0, activeListings * 4))}%
            </span>{' '}
            {language === 'hi' ? 'इस महीने' : 'this month'}
          </small>
        </div>
        <div>
          <span>{copy.totalEnquiries}</span>
          <strong>{totalEnquiries}</strong>
          <small>
            <span className="green-text">↑ {Math.min(99, Math.max(0, totalEnquiries))}%</span>{' '}
            {language === 'hi' ? 'इस महीने' : 'this month'}
          </small>
        </div>
        <div>
          <span>{copy.soldThisMonth}</span>
          <strong>{String(soldListings).padStart(2, '0')}</strong>
          <small>{language === 'hi' ? 'सफलतापूर्वक बिके' : 'Completed'}</small>
        </div>
      </div>

      <div className="admin-list">
        <div className="admin-list-heading">
          <h2>{copy.allListings}</h2>
          <span>{language === 'hi' ? 'अभी सिंक हुआ' : 'Last synced just now'}</span>
        </div>
        {listings.map((animal) => (
          <div className="admin-row" key={animal.id}>
            <img
              src={imageOf(animal)}
              alt=""
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImage(animal);
              }}
            />
            <div>
              <strong>{animal.title}</strong>
              <span>
                LB-{animal.id} · {typeLabel(animal, language)} · {animal.breed}
              </span>
            </div>
            <span className="admin-price">{money(animal.price)}</span>
            <span className="status-pill">
              {animal.status === 'SOLD'
                ? language === 'hi'
                  ? 'बिक गया'
                  : 'Sold'
                : copy.available}
            </span>
            <button
              className="delete-button"
              onClick={() => {
                if (window.confirm(language === 'hi' ? 'क्या आप इस लिस्टिंग को हटाना चाहते हैं?' : 'Remove this listing?')) {
                  onDelete(animal.id);
                }
              }}
              title={language === 'hi' ? 'लिस्टिंग हटाएं' : 'Remove listing'}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

function AdminLogin({ onLogin, language, copy }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const submit = (event) => {
    event.preventDefault();
    onLogin(phone, password);
  };

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <span className="section-kicker">{copy.adminTitle}</span>
          <h1>{copy.loginTitle}</h1>
          <p>{copy.loginText}</p>
        </div>
      </div>
      <form className="login-panel" onSubmit={submit}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={language === 'hi' ? 'मोबाइल नंबर (उदा. 9926361994)' : 'Mobile number'}
          autoComplete="username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={language === 'hi' ? 'पासवर्ड (उदा. lucky8839)' : 'Password'}
          autoComplete="current-password"
          required
        />
        <button className="primary-button" type="submit">
          {copy.login}
        </button>
      </form>
    </main>
  );
}

function Upload({ close, submit, language, copy }) {
  const [preview, setPreview] = useState(null);

  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="upload-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <div>
            <span className="section-kicker">{copy.addNewListing}</span>
            <h2>{copy.addAnimalTitle}</h2>
          </div>
          <button className="close-button" onClick={close} aria-label="Close">
            <X size={19} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(new FormData(e.currentTarget));
          }}
        >
          <label className="upload-zone">
            {preview ? (
              <img src={preview} alt="Preview" />
            ) : (
              <>
                <span className="upload-icon">
                  <ImagePlus size={24} />
                </span>
                <strong>{copy.clearPhoto}</strong>
                <small>{copy.imageHint}</small>
              </>
            )}
            <input
              name="image"
              type="file"
              accept="image/*"
              required
              onChange={(e) =>
                e.target.files[0] && setPreview(URL.createObjectURL(e.target.files[0]))
              }
            />
          </label>

          <div className="form-grid">
            <Field
              name="title"
              label={copy.animalName}
              placeholder={language === 'hi' ? 'उदा. सहीवाल लक्ष्मी' : 'e.g. Sahiwal Lakshmi'}
              required
            />
            <label>
              {copy.category}
              <select name="type">
                <option value="Cow">{copy.cow}</option>
                <option value="Buffalo">{copy.buffalo}</option>
              </select>
            </label>
            <Field
              name="breed"
              label={copy.breedField}
              placeholder={language === 'hi' ? 'उदा. सहीवाल / मुर्राह' : 'e.g. Sahiwal'}
              required
            />
            <Field
              name="milkCapacityLiters"
              label={copy.milkField}
              type="number"
              step="0.5"
              placeholder="12"
              required
            />
            <Field
              name="age"
              label={copy.ageField}
              type="number"
              placeholder="4"
              required
            />
            <Field
              name="price"
              label={copy.askingField}
              type="number"
              placeholder="75000"
              required
            />
            <Field
              name="location"
              label={copy.locationField}
              placeholder={language === 'hi' ? 'मितेरा, मध्य प्रदेश' : 'Mitera, Madhya Pradesh'}
              required
            />
            <Field
              name="sellerName"
              label={copy.yourName}
              placeholder={language === 'hi' ? 'पूरा नाम' : 'Full name'}
              required
            />
            <Field
              name="sellerPhone"
              label={copy.yourPhone}
              placeholder="+91 9926361994"
              required
            />
          </div>

          <div className="form-foot">
            <span>
              <ShieldCheck size={16} /> {copy.detailsPrivate}
            </span>
            <button className="primary-button" type="submit">
              {copy.publish} <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ name, label, ...props }) {
  return (
    <label>
      {label}
      <input name={name} {...props} />
    </label>
  );
}
