import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Instagram,
  Heart,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Settings,
  Share2,
  Check,
  Sparkles,
  Info,
  Star
} from 'lucide-react';
import { 
  sizes, 
  styles, 
  fruits, 
  complementos, 
  doces, 
  mousses, 
  cremes, 
  cremesEspeciais, 
  MenuItem 
} from './data';
// @ts-ignore
import acaiCupBase from './assets/images/acai_cup_base_1782362243503.jpg';
// @ts-ignore
import jamileBanner from './assets/images/jamile_banner_1782362697327.jpg';
import { initAuth, googleSignIn, getAccessToken, logout } from './auth';
import { User } from 'firebase/auth';
import { saveStoreConfig, getStoreConfig } from './db';

interface Cup {
  id: string;
  size: MenuItem | null;
  style: MenuItem | null;
  extras: MenuItem[];
  total: number;
}

type ViewState = 'menu' | 'cart' | 'checkout' | 'featured' | 'store';

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface ItemGroup {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface GroupedExtra {
  item: MenuItem;
  quantity: number;
}

export const getGroupedExtras = (extras: MenuItem[]): GroupedExtra[] => {
  const map = new Map<string, GroupedExtra>();
  extras.forEach(item => {
    const existing = map.get(item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      map.set(item.id, { item, quantity: 1 });
    }
  });
  return Array.from(map.values());
};

// Interactive Custom Açaí Cup Visual Component
function AcaiCupVisual({ 
  size, 
  style, 
  extras,
  height = '140px',
  brandName = 'Jamile'
}: { 
  size: MenuItem | null; 
  style: MenuItem | null; 
  extras: MenuItem[];
  height?: string;
  brandName?: string;
}) {
  // Determine scale/height of cup fill
  let fillHeight = '65%';
  if (size?.id === 's300') fillHeight = '55%';
  if (size?.id === 's500') fillHeight = '70%';
  if (size?.id === 's700') fillHeight = '85%';

  const isCasadinho = style?.id === 'casa';

  // Check which toppings are active
  const hasBanana = extras.some(e => e.id === 'f_ban');
  const hasMorango = extras.some(e => e.id === 'f_mor');
  const hasUva = extras.some(e => e.id === 'f_uva');
  const hasGranola = extras.some(e => e.id === 'c_gra') || extras.some(e => e.id === 'c_suc');
  const hasNutella = extras.some(e => e.id === 'cr_nut') || extras.some(e => e.id === 'ce_ave');
  const hasMilkPowder = extras.some(e => e.id === 'c_lei') || extras.some(e => e.id === 'cr_lei');
  const hasChoc = extras.some(e => e.id.startsWith('d_'));

  return (
    <div className="relative flex items-center justify-center select-none" style={{ height }}>
      {/* Dynamic 3D CSS Cup illustration */}
      <div className="relative w-28 h-full flex flex-col justify-end items-center">
        {/* Rim / Cup Top Lid */}
        <div className="absolute top-[10%] w-[104%] h-[12px] bg-white/30 rounded-full border border-white/50 z-20 backdrop-blur-[1px]"></div>
        
        {/* Cup Body */}
        <div className="relative w-[90%] h-[80%] bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-b-[24px] overflow-hidden backdrop-blur-[2px] shadow-lg shadow-black/40 flex flex-col justify-end">
          {/* Açaí Filling */}
          <div 
            className="w-full bg-gradient-to-b from-[#2e0941] via-[#1b0227] to-[#110119] transition-all duration-500 relative flex flex-col justify-end"
            style={{ height: fillHeight }}
          >
            {/* Casadinho - greek yogurt layers inside */}
            {isCasadinho && (
              <div className="absolute inset-0 flex flex-col justify-around pointer-events-none">
                <div className="w-full h-4 bg-gradient-to-b from-yellow-50/90 to-yellow-100/70 border-y border-yellow-200/20 opacity-90 blur-[1px]"></div>
                <div className="w-full h-4 bg-gradient-to-b from-yellow-50/90 to-yellow-100/70 border-y border-yellow-200/20 opacity-90 blur-[1px]"></div>
              </div>
            )}

            {/* Nutella/Creme drips inside the cup */}
            {hasNutella && (
              <div className="absolute top-0 inset-x-0 h-10 flex justify-around pointer-events-none opacity-80">
                <div className="w-2.5 h-7 bg-[#231206] rounded-full blur-[1px]"></div>
                <div className="w-1.5 h-5 bg-[#231206] rounded-full blur-[1px]"></div>
                <div className="w-3 h-8 bg-[#231206] rounded-full blur-[1px]"></div>
              </div>
            )}
          </div>

          {/* Highlight/Reflections on the Cup Glass */}
          <div className="absolute inset-y-0 left-3 w-2.5 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-3 w-1 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
          
          {/* Logo brand label inside cup */}
          <div className="absolute top-[40%] inset-x-0 flex flex-col items-center justify-center pointer-events-none scale-75 opacity-85">
            <span className="font-cursive text-white font-bold text-xs leading-none">{brandName}</span>
            <span className="font-sans text-pink-500 font-extrabold text-[9px] tracking-widest leading-none mt-0.5">AÇAÍ</span>
          </div>
        </div>

        {/* Cup Shadow */}
        <div className="absolute bottom-0 w-20 h-2 bg-black/60 rounded-full blur-sm pointer-events-none"></div>

        {/* Floating Toppings Layer (on the top of the cup) */}
        <div className="absolute top-[3%] w-[90%] h-[20px] z-30 pointer-events-none flex items-center justify-center">
          {/* Banana slices */}
          {hasBanana && (
            <div className="absolute inset-0 flex items-center justify-around px-2">
              <div className="w-5 h-5 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full border border-yellow-300 shadow flex items-center justify-center transform rotate-12">
                <div className="w-1.5 h-1.5 rounded-full border border-yellow-400/30 border-dashed"></div>
              </div>
              <div className="w-4 h-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full border border-yellow-300 shadow flex items-center justify-center transform -rotate-12 -translate-y-1">
                <div className="w-1 h-1 rounded-full border border-yellow-400/30 border-dashed"></div>
              </div>
            </div>
          )}

          {/* Strawberries */}
          {hasMorango && (
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              <div className="w-4 h-5 bg-red-600 rounded-b-full rounded-t-sm border border-red-500 transform -rotate-12 shadow flex flex-col items-center justify-end">
                <div className="w-1 h-1 bg-green-500 rounded-full -mt-1"></div>
              </div>
              <div className="w-3.5 h-4 bg-red-600 rounded-b-full rounded-t-sm border border-red-500 transform rotate-12 translate-x-2 -translate-y-1 shadow flex flex-col items-center justify-end">
                <div className="w-0.5 h-0.5 bg-green-500 rounded-full -mt-1"></div>
              </div>
            </div>
          )}

          {/* Grapes */}
          {hasUva && (
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              <div className="w-3 h-3 bg-indigo-700 rounded-full border border-indigo-600 shadow transform translate-x-3"></div>
              <div className="w-3.5 h-3.5 bg-indigo-800 rounded-full border border-indigo-600 shadow transform -translate-x-3"></div>
            </div>
          )}

          {/* Granola and powder sprinkles */}
          {hasGranola && (
            <div className="absolute inset-0 flex flex-wrap justify-around p-1 opacity-90">
              <div className="w-1 h-1 bg-amber-600 rounded-sm transform rotate-45"></div>
              <div className="w-1.5 h-1 bg-amber-800 rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-yellow-600 rounded-sm transform -rotate-12"></div>
              <div className="w-1 h-1 bg-amber-700 rounded-sm"></div>
            </div>
          )}

          {/* Powdered Milk */}
          {hasMilkPowder && (
            <div className="absolute inset-0 bg-yellow-50/40 rounded-full blur-[2px]"></div>
          )}

          {/* Chocolate pieces */}
          {hasChoc && (
            <div className="absolute inset-0 flex justify-around items-center px-4">
              <div className="w-2.5 h-2 bg-[#422206] rounded-sm transform rotate-12 shadow"></div>
              <div className="w-2 h-2 bg-[#2a1403] rounded-sm transform -rotate-12 shadow"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const THEME_PRESETS = {
  purple: {
    plum950: '#0e051a',
    plum900: '#18092d',
    plum800: '#251245',
    plum700: '#351a5f',
    plum600: '#492482',
    plum500: '#5f31a6',
    primary500: '#ec4899',
    primary600: '#db2777',
    primary700: '#be185d',
    secondary500: '#f59e0b',
    secondary400: '#fbbf24',
  },
  green: {
    plum950: '#041005',
    plum900: '#081a0b',
    plum800: '#0f2913',
    plum700: '#163b1d',
    plum600: '#1d4f26',
    plum500: '#276933',
    primary500: '#f97316',
    primary600: '#ea580c',
    primary700: '#c2410c',
    secondary500: '#eab308',
    secondary400: '#facc15',
  },
  brown: {
    plum950: '#120904',
    plum900: '#1f1007',
    plum800: '#2b170c',
    plum700: '#3a2012',
    plum600: '#4d2c1a',
    plum500: '#633922',
    primary500: '#d97706',
    primary600: '#b45309',
    primary700: '#92400e',
    secondary500: '#fbbf24',
    secondary400: '#fef08a',
  },
  red: {
    plum950: '#150206',
    plum900: '#26050d',
    plum800: '#3a0915',
    plum700: '#4f0f20',
    plum600: '#66162d',
    plum500: '#7e1e3b',
    primary500: '#ef4444',
    primary600: '#dc2626',
    primary700: '#b91c1c',
    secondary500: '#f472b6',
    secondary400: '#f472b6',
  },
  dark: {
    plum950: '#050505',
    plum900: '#0f0f0f',
    plum800: '#1a1a1a',
    plum700: '#262626',
    plum600: '#333333',
    plum500: '#404040',
    primary500: '#eab308',
    primary600: '#ca8a04',
    primary700: '#a16207',
    secondary500: '#a3e635',
    secondary400: '#bef264',
  },
};

const defaultPreConfiguredCups = [
  {
    id: 'pre_1',
    name: 'Açaí Tradicional Jamile 🍓',
    description: 'O sabor clássico irresistível de açaí com banana fresca, morangos, leite em pó, leite condensado e granola crocante.',
    sizeName: 'Copo 300ml',
    styleName: 'Açaí Tradicional',
    badge: '🏆 Campeão de Vendas',
    price: 27.20,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80',
    sizeId: 's300',
    styleId: 'trad',
    extras: [
      { id: 'f_ban', name: 'Banana', price: 3.50 },
      { id: 'f_mor', name: 'Morango', price: 4.50 },
      { id: 'c_gra', name: 'Granola', price: 3.00 },
      { id: 'c_lei', name: 'Leite em pó', price: 3.20 },
      { id: 'c_lco', name: 'Leite condensado', price: 3.20 }
    ]
  },
  {
    id: 'pre_2',
    name: 'Ninho & Nutella Supremo 🍫',
    description: 'Copo de 500ml recheado com camadas fartas de creme de avelã autêntico, morangos, leite em pó e calda extra de chocolate.',
    sizeName: 'Copo 500ml',
    styleName: 'Açaí Tradicional',
    badge: '🔥 O Mais Desejado',
    price: 33.70,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    sizeId: 's500',
    styleId: 'trad',
    extras: [
      { id: 'f_mor', name: 'Morango', price: 4.50 },
      { id: 'cr_nut', name: 'Nutella', price: 8.00 },
      { id: 'cr_lei', name: 'Leite em pó', price: 3.20 }
    ]
  },
  {
    id: 'pre_3',
    name: 'Trufado Sensação Grego 🍧',
    description: 'Casadinho irresistível de açaí com iogurte grego, leite condensado, bombom Ouro Branco picado e morangos frescos.',
    sizeName: 'Copo 500ml',
    styleName: 'Casadinho (Açaí + Iogurte Grego)',
    badge: '✨ Combinação Premium',
    price: 29.95,
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=400&q=80',
    sizeId: 's500',
    styleId: 'casa',
    extras: [
      { id: 'f_mor', name: 'Morango', price: 4.50 },
      { id: 'd_our', name: 'Ouro Branco', price: 4.25 },
      { id: 'cr_lco', name: 'Leite condensado', price: 3.20 }
    ]
  },
  {
    id: 'pre_4',
    name: 'Açaí Fit Turbinado 🔋',
    description: 'Açaí tradicional com um mix de banana fresca, kiwi fatiado, granola crocante e abacaxi doce.',
    sizeName: 'Copo 500ml',
    styleName: 'Açaí Tradicional',
    badge: '🌱 Energia & Saúde',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1585059895124-747babf07a82?auto=format&fit=crop&w=400&q=80',
    sizeId: 's500',
    styleId: 'trad',
    extras: [
      { id: 'f_ban', name: 'Banana', price: 3.50 },
      { id: 'f_kiw', name: 'Kiwi', price: 3.50 },
      { id: 'f_aba', name: 'Abacaxi', price: 3.00 }
    ]
  }
];

export default function App() {
  const [view, setView] = useState<ViewState>('menu');
  const [cart, setCart] = useState<Cup[]>([]);
  
  // Dynamic Sizes, Styles, and Categories State
  const [sizesList, setSizesList] = useState<MenuItem[]>(sizes);
  const [showPaused, setShowPaused] = useState(false);
  const [stylesList, setStylesList] = useState<MenuItem[]>(styles);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  
  // Current cup being built
  const [currentSize, setCurrentSize] = useState<MenuItem | null>(null);
  const [currentStyle, setCurrentStyle] = useState<MenuItem | null>(null);
  const [currentExtras, setCurrentExtras] = useState<MenuItem[]>([]);
  
  // Pre-configured cups state loaded dynamically
  const [preConfiguredCups, setPreConfiguredCups] = useState<any[]>(() => {
    const saved = localStorage.getItem('jamile_pre_configured_cups');
    return saved ? JSON.parse(saved) : defaultPreConfiguredCups;
  });

  // Accordion Section states
  const [accordions, setAccordions] = useState<Record<string, boolean>>({
    size: true,
    style: true,
    fruits: false,
    complementos: false,
    doces: false,
    mousses: false,
    cremes: false,
    cremesEspeciais: false
  });

  // Settings Modal / WhatsApp Config State
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'whatsapp' | 'menu' | 'theme' | 'offers' | 'cloud' | 'notas'>('whatsapp');
  const [whatsappNumber, setWhatsappNumber] = useState('5511999999999');
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);

  // Brand Personalization and Admin Security states
  const [brandName, setBrandName] = useState('Jamile');
  const [brandSubtitle, setBrandSubtitle] = useState('');
  const [brandSlogan, setBrandSlogan] = useState('Sabor autêntico e qualidade superior');
  const [brandTheme, setBrandTheme] = useState<'purple' | 'green' | 'brown' | 'red' | 'dark'>('purple');
  const [adminPassword, setAdminPassword] = useState('1234');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Store status and Instagram
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [instagramHandle, setInstagramHandle] = useState('');

  // Admin / Menu manager states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('0,00');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemIsNew, setNewItemIsNew] = useState(false);
  const [newItemIsFeatured, setNewItemIsFeatured] = useState(false);
  const [newItemImageUrl, setNewItemImageUrl] = useState('');

  // Item editing states
  const [editingItem, setEditingItem] = useState<{ categoryId: string; item: MenuItem } | null>(null);
  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('0,00');
  const [editItemImageUrl, setEditItemImageUrl] = useState('');
  const [editItemIsNew, setEditItemIsNew] = useState(false);
  const [editItemIsFeatured, setEditItemIsFeatured] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Offer / Combo manager states
  const [newOfferName, setNewOfferName] = useState('');
  const [newOfferDescription, setNewOfferDescription] = useState('');
  const [newOfferBadge, setNewOfferBadge] = useState('🔥 Oferta Especial');
  const [newOfferImage, setNewOfferImage] = useState('https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80');
  const [newOfferSizeId, setNewOfferSizeId] = useState('s300');
  const [newOfferStyleId, setNewOfferStyleId] = useState('trad');
  const [newOfferExtras, setNewOfferExtras] = useState<MenuItem[]>([]);
  const [newOfferCustomPrice, setNewOfferCustomPrice] = useState('');

  // User Data (Notes, Events, Checklists)
  const [userNotes, setUserNotes] = useState('');
  const [userEvents, setUserEvents] = useState('');
  const [userChecklist, setUserChecklist] = useState<{id: string, text: string, done: boolean}[]>([]);

  // Load custom configurations on mount
  useEffect(() => {
    initAuth(
      async (user, token) => {
        setUser(user);
        setNeedsAuth(false);
        // Load data from cloud
        const cloudData = await getStoreConfig(user.uid);
        if (cloudData) {
          if (cloudData.whatsappNumber) setWhatsappNumber(cloudData.whatsappNumber);
          if (cloudData.isStoreOpen !== undefined) setIsStoreOpen(cloudData.isStoreOpen);
          if (cloudData.instagramHandle) setInstagramHandle(cloudData.instagramHandle);
          if (cloudData.brandName) setBrandName(cloudData.brandName);
          if (cloudData.brandSubtitle) setBrandSubtitle(cloudData.brandSubtitle);
          if (cloudData.brandSlogan) setBrandSlogan(cloudData.brandSlogan);
          if (cloudData.brandTheme) setBrandTheme(cloudData.brandTheme);
          if (cloudData.sizesList) setSizesList(cloudData.sizesList);
          if (cloudData.stylesList) setStylesList(cloudData.stylesList);
          if (cloudData.categories) setCategories(cloudData.categories);
          if (cloudData.itemGroups) setItemGroups(cloudData.itemGroups);
          if (cloudData.preConfiguredCups) setPreConfiguredCups(cloudData.preConfiguredCups);
          
          if (cloudData.userNotes) setUserNotes(cloudData.userNotes);
          if (cloudData.userEvents) setUserEvents(cloudData.userEvents);
          if (cloudData.userChecklist) setUserChecklist(cloudData.userChecklist);
        }
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );

    const savedNum = localStorage.getItem('jamile_whatsapp');
    if (savedNum) {
      setWhatsappNumber(savedNum);
    } else {
      localStorage.setItem('jamile_whatsapp', '5511999999999');
    }

    // Load Store open/closed status
    const savedIsOpen = localStorage.getItem('jamile_is_store_open');
    if (savedIsOpen !== null) {
      setIsStoreOpen(savedIsOpen === 'true');
    }

    // Load Instagram handle
    const savedInstagram = localStorage.getItem('jamile_instagram_handle');
    if (savedInstagram) {
      setInstagramHandle(savedInstagram);
    }

    // Load Branding config
    const savedBrandName = localStorage.getItem('jamile_brand_name');
    if (savedBrandName) setBrandName(savedBrandName);

    const savedBrandSubtitle = localStorage.getItem('jamile_brand_subtitle');
    if (savedBrandSubtitle && savedBrandSubtitle !== 'AÇAÍ') {
      setBrandSubtitle(savedBrandSubtitle);
    } else {
      setBrandSubtitle('');
    }

    const savedBrandSlogan = localStorage.getItem('jamile_brand_slogan');
    if (savedBrandSlogan) setBrandSlogan(savedBrandSlogan);

    const savedBrandTheme = localStorage.getItem('jamile_brand_theme');
    if (savedBrandTheme) setBrandTheme(savedBrandTheme as any);

    const savedAdminPassword = localStorage.getItem('jamile_admin_password');
    if (savedAdminPassword) setAdminPassword(savedAdminPassword);

    // Load sizes
    const savedSizes = localStorage.getItem('jamile_sizes');
    if (savedSizes) {
      setSizesList(JSON.parse(savedSizes));
    }

    // Load styles
    const savedStyles = localStorage.getItem('jamile_styles');
    if (savedStyles) {
      setStylesList(JSON.parse(savedStyles));
    }

    // Load categories
    const savedCategories = localStorage.getItem('jamile_categories');
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      setCategories(parsed);
      // Ensure all loaded categories have an accordion state initialized
      setAccordions(prev => {
        const next = { ...prev };
        parsed.forEach((cat: MenuCategory) => {
          if (next[cat.id] === undefined) {
            next[cat.id] = false;
          }
        });
        return next;
      });
    } else {
      const defaultCategoriesList: MenuCategory[] = [
        { id: 'fruits', name: 'Frutas Frescas', items: fruits },
        { id: 'complementos', name: 'Complementos', items: complementos },
        { id: 'doces', name: 'Doces Tradicionais', items: doces },
        { id: 'mousses', name: 'Mousses Cremosos', items: mousses },
        { id: 'cremes', name: 'Cremes & Coberturas', items: cremes },
        { id: 'cremesEspeciais', name: 'Cremes Especiais', items: cremesEspeciais },
      ];
      setCategories(defaultCategoriesList);
      localStorage.setItem('jamile_categories', JSON.stringify(defaultCategoriesList));
    }
  }, []);

  // Pre-fill item category selector once categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !newItemCategory) {
      setNewItemCategory(categories[0].id);
    }
  }, [categories, newItemCategory]);

  // Save custom phone number
  const saveWhatsappNumber = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    if (cleaned) {
      setWhatsappNumber(cleaned);
      localStorage.setItem('jamile_whatsapp', cleaned);
    }
  };

  // Toggle Accordion section
  const toggleAccordion = (section: string) => {
    setAccordions(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Checkout form
  const [formData, setFormData] = useState({
    name: '',
    deliveryType: 'entrega',
    address: '',
    payment: 'pix',
    notes: ''
  });

  // Calculate current cup total
  const currentTotal = (currentSize?.price || 0) + currentExtras.reduce((sum, item) => sum + item.price, 0);

  // Cart total
  const cartTotal = cart.reduce((sum, cup) => sum + cup.total, 0);

  const resetCurrentCup = () => {
    setCurrentSize(null);
    setCurrentStyle(null);
    setCurrentExtras([]);
    // Scroll smoothly to top of workspace
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Expand top sections and collapse all others
    const resetAccordions: Record<string, boolean> = {
      size: true,
      style: true
    };
    categories.forEach(cat => {
      resetAccordions[cat.id] = false;
    });
    setAccordions(resetAccordions);
  };

  const addToCart = () => {
    if (!currentSize || !currentStyle) return;
    
    const newCup: Cup = {
      id: Math.random().toString(36).substring(2, 9),
      size: currentSize,
      style: currentStyle,
      extras: [...currentExtras],
      total: currentTotal
    };
    
    setCart([...cart, newCup]);
    resetCurrentCup();
    setView('cart');
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(cup => cup.id !== id));
    if (cart.length === 1) {
      setView('menu');
    }
  };

  const toggleExtra = (item: MenuItem) => {
    const exists = currentExtras.some(e => e.id === item.id);
    if (exists) {
      setCurrentExtras(currentExtras.filter(e => e.id !== item.id));
    } else {
      setCurrentExtras([...currentExtras, item]);
    }
  };

  const getItemQuantity = (itemId: string): number => {
    return currentExtras.filter(e => e.id === itemId).length;
  };

  const increaseExtra = (item: MenuItem) => {
    setCurrentExtras([...currentExtras, item]);
  };

  const decreaseExtra = (itemId: string) => {
    const index = currentExtras.findLastIndex(e => e.id === itemId);
    if (index !== -1) {
      const updated = [...currentExtras];
      updated.splice(index, 1);
      setCurrentExtras(updated);
    }
  };

  // Pre-configured/Featured Combinations Handlers
  const toggleOfferExtra = (item: MenuItem) => {
    if (newOfferExtras.some(e => e.id === item.id)) {
      setNewOfferExtras(newOfferExtras.filter(e => e.id !== item.id));
    } else {
      setNewOfferExtras([...newOfferExtras, item]);
    }
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferName.trim()) {
      alert('Por favor, informe o nome do combo/oferta!');
      return;
    }
    
    const sizeObj = sizesList.find(s => s.id === newOfferSizeId) || sizesList[0];
    const styleObj = stylesList.find(st => st.id === newOfferStyleId) || stylesList[0];
    
    // Calculate default price
    const calculatedStandardPrice = sizeObj.price + styleObj.price + newOfferExtras.reduce((sum, item) => sum + item.price, 0);
    const resolvedPrice = newOfferCustomPrice ? parseFloat(newOfferCustomPrice.replace(',', '.')) : calculatedStandardPrice;
    
    const newOffer = {
      id: `pre_${Date.now()}`,
      name: newOfferName,
      description: newOfferDescription || `Combinação deliciosa com copo de ${sizeObj.name.replace('Copo ', '')}, base ${styleObj.name} e adicionais selecionados.`,
      sizeName: sizeObj.name,
      styleName: styleObj.name,
      badge: newOfferBadge || '✨ Combo Especial',
      price: resolvedPrice,
      image: newOfferImage || 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80',
      sizeId: newOfferSizeId,
      styleId: newOfferStyleId,
      extras: newOfferExtras.map(e => ({ id: e.id, name: e.name, price: e.price }))
    };
    
    const updated = [...preConfiguredCups, newOffer];
    setPreConfiguredCups(updated);
    localStorage.setItem('jamile_pre_configured_cups', JSON.stringify(updated));
    
    // Reset fields
    setNewOfferName('');
    setNewOfferDescription('');
    setNewOfferBadge('🔥 Oferta Especial');
    setNewOfferExtras([]);
    setNewOfferCustomPrice('');
    alert('Nova oferta lançada com sucesso!');
  };

  const handleDeleteOffer = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta oferta?')) {
      const updated = preConfiguredCups.filter(o => o.id !== id);
      setPreConfiguredCups(updated);
      localStorage.setItem('jamile_pre_configured_cups', JSON.stringify(updated));
    }
  };

  const addPreMadeToCart = (preMade: typeof preConfiguredCups[0]) => {
    const selectedSize = sizesList.find(s => s.id === preMade.sizeId) || sizesList.find(s => s.name.includes(preMade.sizeName.split(' ')[1])) || sizesList[0];
    const selectedStyle = stylesList.find(st => st.id === preMade.styleId) || stylesList.find(st => st.name.includes(preMade.styleName)) || stylesList[0];
    
    const resolvedExtras: MenuItem[] = [];
    preMade.extras.forEach(itemPreset => {
      let foundItem: MenuItem | undefined;
      for (const cat of categories) {
        foundItem = (cat.items || []).find(i => i.id === itemPreset.id || i.name.toLowerCase() === itemPreset.name.toLowerCase());
        if (foundItem) break;
      }
      if (foundItem) {
        resolvedExtras.push(foundItem);
      } else {
        resolvedExtras.push({
          id: itemPreset.id,
          name: itemPreset.name,
          price: itemPreset.price
        });
      }
    });

    const total = selectedSize.price + selectedStyle.price + resolvedExtras.reduce((sum, item) => sum + item.price, 0);

    const newCup: Cup = {
      id: `cup_${Date.now()}`,
      size: selectedSize,
      style: selectedStyle,
      extras: resolvedExtras,
      total: total
    };

    setCart(prev => [...prev, newCup]);
    alert(`"${preMade.name}" adicionado ao seu carrinho!`);
  };

  const customizePreMade = (preMade: typeof preConfiguredCups[0]) => {
    const selectedSize = sizesList.find(s => s.id === preMade.sizeId) || sizesList.find(s => s.name.includes(preMade.sizeName.split(' ')[1])) || sizesList[0];
    const selectedStyle = stylesList.find(st => st.id === preMade.styleId) || stylesList.find(st => st.name.includes(preMade.styleName)) || stylesList[0];
    
    const resolvedExtras: MenuItem[] = [];
    preMade.extras.forEach(itemPreset => {
      let foundItem: MenuItem | undefined;
      for (const cat of categories) {
        foundItem = (cat.items || []).find(i => i.id === itemPreset.id || i.name.toLowerCase() === itemPreset.name.toLowerCase());
        if (foundItem) break;
      }
      if (foundItem) {
        resolvedExtras.push(foundItem);
      } else {
        resolvedExtras.push({
          id: itemPreset.id,
          name: itemPreset.name,
          price: itemPreset.price
        });
      }
    });

    setCurrentSize(selectedSize);
    setCurrentStyle(selectedStyle);
    setCurrentExtras(resolvedExtras);

    setView('menu');
    
    window.scrollTo({ top: 400, behavior: 'smooth' });
    alert(`"${preMade.name}" foi carregado! Você pode alterar o tamanho, o estilo e adicionar/remover ingredientes.`);
  };

  // Menu Management Handlers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategoryName.trim() || (e.target as HTMLFormElement).querySelector('input')?.value.trim();
    if (!name) return;
    
    const itemsFromGroup = selectedGroupId ? itemGroups.find(g => g.id === selectedGroupId)?.items || [] : [];
    
    const newId = `cat_${Date.now()}`;
    const newCat: MenuCategory = {
      id: newId,
      name: name,
      items: [...itemsFromGroup]
    };
    
    const updatedCategories = [...categories, newCat];
    setCategories(updatedCategories);
    localStorage.setItem('jamile_categories', JSON.stringify(updatedCategories));
    
    // Initialize accordion state
    setAccordions(prev => ({ ...prev, [newId]: false }));
    
    setNewCategoryName('');
    setSelectedGroupId('');
    alert(`Categoria "${newCat.name}" criada com sucesso!`);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemCategory) return;
    
    // Parse price safely, converting comma to period
    const rawPrice = newItemPrice.replace(',', '.');
    const parsedPrice = parseFloat(rawPrice) || 0;
    
    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      name: newItemName.trim(),
      price: parsedPrice,
      isNew: newItemIsNew,
      isFeatured: newItemIsFeatured,
      imageUrl: newItemImageUrl.trim() || undefined
    };
    
    if (newItemCategory === 'sizes') {
      const updatedSizes = [...sizesList, { ...newItem, id: `s_${Date.now()}` }];
      setSizesList(updatedSizes);
      localStorage.setItem('jamile_sizes', JSON.stringify(updatedSizes));
    } else if (newItemCategory === 'styles') {
      const updatedStyles = [...stylesList, { ...newItem, id: `st_${Date.now()}` }];
      setStylesList(updatedStyles);
      localStorage.setItem('jamile_styles', JSON.stringify(updatedStyles));
    } else {
      const updatedCategories = categories.map(cat => {
        if (cat.id === newItemCategory) {
          return {
            ...cat,
            items: [...(cat.items || []), newItem]
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      localStorage.setItem('jamile_categories', JSON.stringify(updatedCategories));
    }
    
    setNewItemName('');
    setNewItemPrice('0,00');
    setNewItemIsNew(false);
    setNewItemIsFeatured(false);
    setNewItemImageUrl('');
    alert(`Item "${newItem.name}" adicionado com sucesso!`);
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    console.log('Delete item:', categoryId, itemId);
    if (!itemId) {
      console.error('itemId is undefined!');
      return;
    }
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    
    if (categoryId === 'sizes') {
      console.log('Attempting to delete size:', itemId, 'from sizesList:', sizesList);
      const updated = sizesList.filter(s => s.id !== itemId);
      console.log('Updated sizesList:', updated);
      setSizesList(updated);
      localStorage.setItem('jamile_sizes', JSON.stringify(updated));
    } else if (categoryId === 'styles') {
      const updated = stylesList.filter(s => s.id !== itemId);
      setStylesList(updated);
      localStorage.setItem('jamile_styles', JSON.stringify(updated));
    } else {
      const updatedCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: (cat.items || []).filter(item => item.id !== itemId)
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      localStorage.setItem('jamile_categories', JSON.stringify(updatedCategories));
    }
    alert('Excluindo item...');
  };

  const handleTogglePauseItem = (categoryId: string, itemId: string) => {
    if (categoryId === 'sizes') {
      const updated = sizesList.map(s => s.id === itemId ? { ...s, isPaused: !s.isPaused } : s);
      setSizesList(updated);
      localStorage.setItem('jamile_sizes', JSON.stringify(updated));
    } else if (categoryId === 'styles') {
      const updated = stylesList.map(s => s.id === itemId ? { ...s, isPaused: !s.isPaused } : s);
      setStylesList(updated);
      localStorage.setItem('jamile_styles', JSON.stringify(updated));
    } else {
      const updatedCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: (cat.items || []).map(item => item.id === itemId ? { ...item, isPaused: !item.isPaused } : item)
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      localStorage.setItem('jamile_categories', JSON.stringify(updatedCategories));
    }
  };

  const handleMoveItem = (categoryId: string, itemId: string, direction: 'up' | 'down') => {
    if (categoryId === 'sizes') {
      const index = sizesList.findIndex(i => i.id === itemId);
      const newList = [...sizesList];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < newList.length) {
        [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
        setSizesList(newList);
        localStorage.setItem('jamile_sizes', JSON.stringify(newList));
      }
    } else if (categoryId === 'styles') {
      const index = stylesList.findIndex(i => i.id === itemId);
      const newList = [...stylesList];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < newList.length) {
        [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
        setStylesList(newList);
        localStorage.setItem('jamile_styles', JSON.stringify(newList));
      }
    } else if (categoryId === 'offers') {
      const index = preConfiguredCups.findIndex(i => i.id === itemId);
      const newList = [...preConfiguredCups];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < newList.length) {
        [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
        setPreConfiguredCups(newList);
        localStorage.setItem('jamile_offers', JSON.stringify(newList));
      }
    } else {
      const updatedCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          const items = cat.items || [];
          const index = items.findIndex(i => i.id === itemId);
          const newItems = [...items];
          const newIndex = direction === 'up' ? index - 1 : index + 1;
          if (newIndex >= 0 && newIndex < newItems.length) {
            [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
          }
          return { ...cat, items: newItems };
        }
        return cat;
      });
      setCategories(updatedCategories);
      localStorage.setItem('jamile_categories', JSON.stringify(updatedCategories));
    }
  };

  const startEditItem = (categoryId: string, item: MenuItem) => {
    setEditingItem({ categoryId, item });
    setEditItemName(item.name);
    setEditItemPrice(item.price.toFixed(2).replace('.', ','));
    setEditItemImageUrl(item.imageUrl || '');
    setEditItemIsNew(!!item.isNew);
    setEditItemIsFeatured(!!item.isFeatured);
  };

  const startEditOffer = (offer: any) => {
    setEditingOffer(offer);
    setEditItemName(offer.name);
  };

  const handleSaveEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const rawPrice = editItemPrice.replace(',', '.');
    const parsedPrice = parseFloat(rawPrice) || 0;

    const updatedItem: MenuItem = {
      ...editingItem.item,
      name: editItemName.trim(),
      price: parsedPrice,
      imageUrl: editItemImageUrl.trim() || undefined,
      isNew: editItemIsNew,
      isFeatured: editItemIsFeatured,
    };

    const { categoryId } = editingItem;

    if (categoryId === 'sizes') {
      const updated = sizesList.map(s => s.id === updatedItem.id ? updatedItem : s);
      setSizesList(updated);
      localStorage.setItem('jamile_sizes', JSON.stringify(updated));
    } else if (categoryId === 'styles') {
      const updated = stylesList.map(s => s.id === updatedItem.id ? updatedItem : s);
      setStylesList(updated);
      localStorage.setItem('jamile_styles', JSON.stringify(updated));
    } else {
      const updatedCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: (cat.items || []).map(item => item.id === updatedItem.id ? updatedItem : item)
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      localStorage.setItem('jamile_categories', JSON.stringify(updatedCategories));
    }

    setEditingItem(null);
    alert('Item atualizado com sucesso!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        alert('A imagem é muito grande! Escolha uma imagem menor que 500KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditItemImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNoExit = () => {
    if (!editingItem) return;
    const rawPrice = editItemPrice.replace(',', '.');
    const parsedPrice = parseFloat(rawPrice) || 0;
    const updatedItem: MenuItem = {
      ...editingItem.item,
      name: editItemName.trim(),
      price: parsedPrice,
      imageUrl: editItemImageUrl.trim() || undefined,
      isNew: editItemIsNew,
      isFeatured: editItemIsFeatured,
    };
    const { categoryId } = editingItem;
    if (categoryId === 'sizes') {
      const updated = sizesList.map(s => s.id === updatedItem.id ? updatedItem : s);
      setSizesList(updated);
      localStorage.setItem('jamile_sizes', JSON.stringify(updated));
    } else if (categoryId === 'styles') {
      const updated = stylesList.map(s => s.id === updatedItem.id ? updatedItem : s);
      setStylesList(updated);
      localStorage.setItem('jamile_styles', JSON.stringify(updated));
    } else {
      const updatedCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: (cat.items || []).map(item => item.id === updatedItem.id ? updatedItem : item)
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      localStorage.setItem('jamile_categories', JSON.stringify(updatedCategories));
    }
    setEditingItem({ categoryId, item: updatedItem });
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria e todos os adicionais dela?")) return;
    
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    localStorage.setItem('jamile_categories', JSON.stringify(updatedCategories));
    
    // Cleanup accordion state
    setAccordions(prev => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  };

  const handleEditCategory = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return;
    const newName = prompt('Digite o novo nome da categoria:', cat.name);
    if (newName && newName.trim() !== '' && newName !== cat.name) {
      const updatedCategories = categories.map(c => 
        c.id === categoryId ? { ...c, name: newName.trim() } : c
      );
      setCategories(updatedCategories);
      localStorage.setItem('jamile_categories', JSON.stringify(updatedCategories));
    }
  };

  const handleResetDefaults = () => {
    if (!confirm("Isso removerá todas as suas categorias e adicionais customizados e restaurará os valores originais do cardápio. Continuar?")) return;
    
    const defaultCategoriesList: MenuCategory[] = [
      { id: 'fruits', name: 'Frutas Frescas', items: fruits },
      { id: 'complementos', name: 'Complementos', items: complementos },
      { id: 'doces', name: 'Doces Tradicionais', items: doces },
      { id: 'mousses', name: 'Mousses Cremosos', items: mousses },
      { id: 'cremes', name: 'Cremes & Coberturas', items: cremes },
      { id: 'cremesEspeciais', name: 'Cremes Especiais', items: cremesEspeciais },
    ];
    
    setSizesList(sizes);
    setStylesList(styles);
    setCategories(defaultCategoriesList);
    
    localStorage.removeItem('jamile_sizes');
    localStorage.removeItem('jamile_styles');
    localStorage.setItem('jamile_categories', JSON.stringify(defaultCategoriesList));
    
    alert("Cardápio original restaurado!");
  };

  const sendOrder = () => {
    if (!formData.name) {
      alert("Por favor, preencha seu nome.");
      return;
    }
    if (formData.deliveryType === 'entrega' && !formData.address) {
      alert("Por favor, preencha o endereço de entrega.");
      return;
    }

    let msg = `*NOVO PEDIDO - JAMILE AÇAÍ PREMIUM* 💜\n\n`;
    msg += `*Cliente:* ${formData.name}\n`;
    msg += `*Tipo:* ${formData.deliveryType === 'entrega' ? 'Entrega 🛵' : 'Retirada 🏪'}\n`;
    if (formData.deliveryType === 'entrega') {
      msg += `*Endereço:* ${formData.address}\n`;
    }
    msg += `*Pagamento:* ${formData.payment.toUpperCase()}\n`;
    if (formData.notes) {
      msg += `*Observações:* ${formData.notes}\n`;
    }
    msg += `\n*RESUMO DO PEDIDO:*\n`;
    
    cart.forEach((cup, idx) => {
      msg += `\n*Copo ${idx + 1}:* ${cup.size?.name} (R$ ${cup.size?.price.toFixed(2).replace('.', ',')})\n`;
      msg += `*Estilo:* ${cup.style?.name}\n`;
      if (cup.extras.length > 0) {
        msg += `*Adicionais:*\n`;
        const grouped = getGroupedExtras(cup.extras);
        grouped.forEach(g => {
          msg += `- ${g.quantity}x ${g.item.name} (+ R$ ${(g.item.price * g.quantity).toFixed(2).replace('.', ',')})\n`;
        });
      }
      msg += `_Subtotal: R$ ${cup.total.toFixed(2).replace('.', ',')}_\n`;
    });

    msg += `\n*TOTAL GERAL: R$ ${cartTotal.toFixed(2).replace('.', ',')}*`;

    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`, '_blank');
  };

  const copyMenuLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  // Reusable rendering components for selection lists
  const renderRadioOption = (item: MenuItem, selected: MenuItem | null, onSelect: (i: MenuItem) => void) => {
    const isSelected = selected?.id === item.id;
    return (
      <div
        key={item.id}
        onClick={() => {
          if (item.isPaused) {
            alert('Este item está pausado no momento.');
            return;
          }
          onSelect(item);
        }}
        id={`option-${item.id}`}
        className={`flex items-center w-full p-4 rounded-xl transition-all duration-300 border ${
          item.isPaused ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${isSelected 
            ? 'border-pink-500 bg-pink-500/10 text-white shadow-[0_0_15px_rgba(236,72,153,0.15)]' 
            : 'border-plum-800/60 bg-plum-900/40 text-zinc-300 hover:border-plum-700 hover:bg-plum-900/70'
        }`}
      >
        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 mr-3.5 transition-all shrink-0 ${
          isSelected ? 'border-pink-500 bg-pink-500 text-white' : 'border-zinc-600 text-transparent'
        }`}>
          <div className={`w-2 h-2 rounded-full bg-white transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center">
            <span className={`font-semibold text-base transition-colors ${isSelected ? 'text-white' : 'text-zinc-200'}`}>{item.name}</span>
            {item.isNew && (
              <span className="ml-2 bg-pink-600 text-white text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-widest scale-90">
                Novo!
              </span>
            )}
          </div>
        </div>
        {item.price > 0 && (
          <span className="text-pink-400 font-bold ml-2">
            + R$ {item.price.toFixed(2).replace('.', ',')}
          </span>
        )}
      </div>
    );
  };

  const renderCheckboxOption = (item: MenuItem) => {
    const qty = getItemQuantity(item.id);
    const isSelected = qty > 0;
    return (
      <div
        key={item.id}
        id={`checkbox-${item.id}`}
        className={`flex items-center justify-between py-3 border-b border-plum-800/20 last:border-0 transition-all duration-300 ${
          isSelected ? 'bg-pink-500/5 px-2 -mx-2 rounded-xl border-b-transparent' : ''
        } ${item.isPaused ? 'opacity-50' : ''}`}
      >
        {/* Left: Name and Price */}
        <div className="flex flex-col text-left pr-2 min-w-0">
          <span className={`font-extrabold text-sm sm:text-base truncate ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
            {item.name}
            {item.isPaused && <span className="text-red-400 ml-2 text-[10px] uppercase font-bold">[Pausado]</span>}
          </span>
          <span className="text-xs text-pink-400 font-bold mt-1">
            + R$ {item.price.toFixed(2).replace('.', ',')}
          </span>
          {item.isNew && (
            <span className="self-start mt-1.5 bg-pink-600 text-white text-[9px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider scale-90 origin-left shrink-0">
              Novo!
            </span>
          )}
          {item.isFeatured && (
            <span className="self-start mt-1.5 bg-yellow-500 text-black text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider scale-90 origin-left shrink-0 flex items-center gap-0.5">
              ⭐ Destaque
            </span>
          )}
        </div>

        {/* Right side: Image and Counter Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Adicional Photo */}
          <div className="w-16 h-16 rounded-xl bg-plum-950/80 border border-plum-800/50 overflow-hidden shrink-0 flex items-center justify-center relative shadow-inner">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const sibling = target.nextSibling as HTMLDivElement;
                  if (sibling) sibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-500/20 to-plum-800/40 text-pink-400 font-extrabold text-sm uppercase"
              style={{ display: item.imageUrl ? 'none' : 'flex' }}
            >
              {item.name.substring(0, 2)}
            </div>
          </div>

          {/* Counter Controls */}
          <div className="flex items-center gap-2">
            {qty > 0 ? (
              <div className="flex items-center bg-pink-600/10 border border-pink-500/30 rounded-xl p-1 animate-in zoom-in-95 duration-200">
                <button
                  type="button"
                  onClick={() => decreaseExtra(item.id)}
                  className="w-8 h-8 rounded-lg bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center font-black text-sm transition active:scale-90"
                >
                  —
                </button>
                <span className="w-7 text-center font-black text-sm text-white">{qty}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (item.isPaused) {
                      alert('Este item está pausado no momento.');
                      return;
                    }
                    increaseExtra(item);
                  }}
                  className="w-8 h-8 rounded-lg bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center font-black text-sm transition active:scale-90"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (item.isPaused) {
                    alert('Este item está pausado no momento.');
                    return;
                  }
                  increaseExtra(item);
                }}
                className="w-9 h-9 rounded-xl bg-plum-950 hover:bg-pink-600/20 border border-pink-500/30 hover:border-pink-500/60 text-pink-500 flex items-center justify-center text-lg font-black transition-all active:scale-90 shadow-sm"
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAccordionHeader = (
    key: string, 
    num: number, 
    title: string, 
    badgeText?: string, 
    badgeType: 'required' | 'optional' = 'optional',
    summaryText?: string
  ) => {
    const isOpen = accordions[key];
    return (
      <div 
        onClick={() => toggleAccordion(key)}
        id={`accordion-header-${key}`}
        className={`flex items-center justify-between p-4 bg-plum-900/90 border border-plum-800/70 rounded-2xl cursor-pointer select-none transition-all duration-300 ${
          isOpen ? 'rounded-b-none border-b-transparent bg-plum-900 shadow-md' : 'hover:bg-plum-900/90 hover:border-plum-700/80 mb-4'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-pink-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
            {num}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-bold text-white tracking-wide uppercase">{title}</h3>
              {badgeText && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider scale-90 ${
                  badgeType === 'required' 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                    : 'bg-plum-800 text-zinc-400'
                }`}>
                  {badgeText}
                </span>
              )}
            </div>
            {summaryText && !isOpen && (
              <p className="text-pink-400 text-xs font-semibold mt-0.5 animate-in fade-in">{summaryText}</p>
            )}
          </div>
        </div>
        <div className="text-zinc-400 p-1">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
    );
  };

  const activeTheme = THEME_PRESETS[brandTheme] || THEME_PRESETS.purple;

  return (
    <div className="min-h-screen bg-plum-950 text-zinc-100 font-sans selection:bg-pink-500/30 pb-36 relative overflow-x-hidden">
      
      {/* Dynamic Style Block to inject brand custom colors */}
      <style>{`
        :root {
          --plum-950: ${activeTheme.plum950} !important;
          --plum-900: ${activeTheme.plum900} !important;
          --plum-800: ${activeTheme.plum800} !important;
          --plum-700: ${activeTheme.plum700} !important;
          --plum-600: ${activeTheme.plum600} !important;
          --plum-500: ${activeTheme.plum500} !important;
          --primary-500: ${activeTheme.primary500} !important;
          --primary-600: ${activeTheme.primary600} !important;
          --primary-700: ${activeTheme.primary700} !important;
          --secondary-500: ${activeTheme.secondary500} !important;
          --secondary-400: ${activeTheme.secondary400} !important;
        }
      `}</style>
      
      {/* Decorative ambient glowing lights behind page */}
      <div className="absolute top-[10%] left-[-20%] w-[60%] h-[350px] bg-pink-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-20%] w-[50%] h-[400px] bg-plum-700/15 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* Upper Utility Navbar */}
      <div className="w-full bg-plum-900/60 backdrop-blur-md border-b border-plum-800/50 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 text-left">
            <div className="flex items-center gap-1 text-pink-500 shrink-0">
              <Sparkles size={14} className="animate-pulse" />
              <span className="font-sans text-xs uppercase font-black tracking-wider text-white">{brandName}</span>
            </div>
            <a 
              href={`https://instagram.com/${(instagramHandle || 'jamileacai').trim().replace('@', '')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-pink-400 hover:text-pink-350 font-extrabold bg-pink-500/10 hover:bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-500/20 transition-all active:scale-95 shrink-0"
            >
              <Instagram size={11} className="text-pink-500 animate-pulse" />
              <span>@{(instagramHandle || 'jamileacai').trim().replace('@', '')}</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            {/* Instagram Quick Link */}
            {instagramHandle && (
              <a 
                href={`https://instagram.com/${instagramHandle.trim().replace('@', '')}`}
                target="_blank" 
                rel="noopener noreferrer"
                title={`Siga-nos no Instagram @${instagramHandle.trim().replace('@', '')}`}
                className="p-1.5 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white rounded-lg transition hover:scale-105 active:scale-95 flex items-center justify-center shrink-0"
              >
                <Instagram size={16} />
              </a>
            )}
            {/* Owner Admin Button */}
            <button 
              onClick={() => {
                setSettingsTab('menu');
                setShowSettings(true);
              }}
              title="Gerenciar Cardápio (Categorias e Adicionais)"
              className="px-2.5 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs font-black transition flex items-center gap-1 active:scale-95 text-yellow-400 shrink-0"
            >
              🛠️ Painel
            </button>
            {/* Quick Share Link button */}
            <button 
              onClick={copyMenuLink}
              title="Copiar link para enviar para cliente"
              className="px-2.5 py-1.5 bg-pink-600/10 hover:bg-pink-600/20 text-pink-400 border border-pink-500/30 rounded-full text-xs font-bold transition flex items-center gap-1 active:scale-95 shrink-0"
            >
              {copiedLink ? <Check size={12} className="text-green-400" /> : <Share2 size={12} />}
              {copiedLink ? 'Copiado!' : 'Compartilhar'}
            </button>
            {/* Settings pencil */}
            <button 
              onClick={() => {
                setSettingsTab('whatsapp');
                setShowSettings(true);
              }}
              title="Configurar número do WhatsApp"
              className="p-1.5 bg-plum-800/80 hover:bg-plum-700 text-zinc-300 rounded-lg transition shrink-0"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Instructions Banner for the Store Owner */}
      {whatsappNumber === '5511999999999' && (
        <div className="max-w-xl mx-auto mt-4 px-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-start gap-3 shadow-lg shadow-yellow-500/5">
            <Info className="text-yellow-500 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="text-yellow-400 font-bold text-sm">Configuração pendente!</h4>
              <p className="text-zinc-300 text-xs mt-0.5 leading-relaxed">
                Você está usando o número de teste. Clique em <strong>Configurar Link</strong> ou no ícone <Settings size={12} className="inline mx-0.5" /> para inserir seu WhatsApp real e receber pedidos diretamente!
              </p>
              <button 
                onClick={() => setShowSettings(true)}
                className="mt-2 text-xs text-yellow-400 font-bold underline hover:text-yellow-300"
              >
                Configurar meu WhatsApp agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner / Header - Beautifully matched to the user's uploaded banner screenshot */}
      <header 
        className="relative w-full bg-plum-900 border-b border-pink-900/20 overflow-hidden shadow-2xl h-44 sm:h-64"
        style={{ 
          backgroundImage: `url(${jamileBanner})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        {/* Completely clear background banner, with no dark overlay or overlapping text to ensure the pre-designed banner is fully visible, prominent, and clean */}
      </header>

      {/* Store Info and Navigation Section */}
      <div className="bg-plum-950">
        {/* Store Info Cards below the banner so it doesn't block the beautiful Canva banner design */}
        <div className="max-w-xl mx-auto px-4 pt-5 pb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center sm:justify-start gap-1.5">
                <span>{brandName}</span>
                <Heart size={16} className="fill-pink-500 text-pink-500 animate-pulse" />
              </h1>
              {brandSlogan && (
                <p className="text-xs text-zinc-400 italic mt-1 font-light">
                  {brandSlogan}
                </p>
              )}
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm border ${
                  isStoreOpen 
                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full bg-current ${isStoreOpen ? 'animate-pulse' : ''}`} />
                  {isStoreOpen ? 'Aberto' : 'Fechado'}
                </span>
                
                <span className="bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <span>🛵</span> Entrega Rápida
                </span>

                {instagramHandle && (
                  <a 
                    href={`https://instagram.com/${instagramHandle.trim().replace('@', '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-pink-400 hover:text-pink-300 font-extrabold bg-pink-500/5 px-2.5 py-0.5 rounded-full border border-pink-500/10 transition-all active:scale-95"
                  >
                    <Instagram size={11} />
                    <span>@{instagramHandle.trim().replace('@', '')}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Live Cup Visualizer as a smaller badge below the banner */}
            <div className="relative shrink-0 flex items-center justify-center w-20 h-20 bg-plum-900/40 rounded-full border border-plum-800 shadow-md">
              <AcaiCupVisual size={currentSize || sizes[1]} style={currentStyle || styles[0]} extras={currentExtras} height="65px" brandName={brandName} />
              <div className="absolute -bottom-1 bg-pink-500/15 border border-pink-500/30 rounded-full px-2 py-0.5 text-[8px] font-bold text-pink-400 uppercase tracking-wider">
                Copo Live
              </div>
            </div>
          </div>
        </div>

        {/* Double Navigation Tabs */}
        <div className="border-t border-plum-900 bg-plum-950/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="max-w-xl mx-auto flex overflow-x-auto scrollbar-none snap-x whitespace-nowrap">
            <button 
              onClick={() => setView('menu')}
              id="tab-menu"
              className={`flex-1 min-w-[125px] sm:min-w-0 py-4 text-center text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 flex items-center justify-center gap-1.5 snap-center ${
                view === 'menu' 
                  ? 'border-pink-500 text-pink-400 bg-pink-500/5' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-plum-900/30'
              }`}
            >
              <span>📍 Montar Copo</span>
            </button>
            <button 
              onClick={() => setView('featured')}
              id="tab-featured"
              className={`flex-1 min-w-[125px] sm:min-w-0 py-4 text-center text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 flex items-center justify-center gap-1.5 snap-center ${
                view === 'featured' 
                  ? 'border-pink-500 text-pink-400 bg-pink-500/5' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-plum-900/30'
              }`}
            >
              <span>✨ Destaques & Ofertas</span>
            </button>
            <button 
              onClick={() => {
                if (cart.length > 0) setView('cart');
                else alert("Adicione pelo menos um copo ao carrinho primeiro!");
              }}
              id="tab-cart"
              className={`flex-1 min-w-[125px] sm:min-w-0 py-4 text-center text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 flex items-center justify-center gap-1.5 snap-center ${
                view === 'cart' 
                  ? 'border-pink-500 text-pink-400 bg-pink-500/5' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-plum-900/30'
              }`}
            >
              <span>🛒 Carrinho</span>
              {cart.length > 0 && (
                <span className="bg-pink-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                  {cart.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setView('store')}
              id="tab-store"
              className={`flex-1 min-w-[125px] sm:min-w-0 py-4 text-center text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 flex items-center justify-center gap-1.5 snap-center ${
                view === 'store' 
                  ? 'border-pink-500 text-pink-400 bg-pink-500/5' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-plum-900/30'
              }`}
            >
              <span>ℹ️ Sobre a Loja</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 relative mt-6">
        
        {view === 'menu' && (
          <div className="animate-in fade-in duration-300">
            {/* Call to action card if cart has items */}
            {cart.length > 0 && (
              <div className="bg-gradient-to-r from-pink-900/30 to-plum-900/30 border border-pink-500/30 rounded-2xl p-4 flex items-center justify-between mb-6 shadow-lg">
                <div>
                  <p className="text-pink-400 font-extrabold text-sm">{cart.length} {cart.length === 1 ? 'Copo' : 'Copos'} no pedido</p>
                  <p className="text-zinc-300 text-xs">Total Parcial: <strong className="text-white text-sm">R$ {cartTotal.toFixed(2).replace('.', ',')}</strong></p>
                </div>
                <button 
                  onClick={() => setView('cart')}
                  className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-lg shadow-pink-600/10 flex items-center gap-1.5"
                >
                  Ir para o Carrinho <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* Introductory Concept Card "Monte seu Copo" matching the layout */}
            <div className="bg-plum-900/90 border border-plum-800/80 rounded-3xl p-5 mb-6 flex items-center gap-4 shadow-xl">
              <div className="shrink-0 w-20 h-20 bg-plum-950/60 rounded-2xl border border-pink-500/15 overflow-hidden flex items-center justify-center">
                <img 
                  src={acaiCupBase} 
                  alt="Monte seu Copo Açaí" 
                  className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-white text-lg">Monte seu Copo</h3>
                  <span className="text-base">🥤</span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mt-0.5">
                  Açaí 100% puro, cremoso & natural. Escolha o tamanho do copo abaixo para abrir as opções de adicionais!
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="bg-pink-600/25 text-pink-400 border border-pink-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Açaí 100% Puro</span>
                  <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Cremoso</span>
                </div>
              </div>
            </div>

            {/* STEP 1: SIZE SELECTOR */}
            <div className="mb-6 bg-plum-900/40 border border-plum-800/60 rounded-3xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full bg-pink-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  1
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-white tracking-wide uppercase">Escolha o Tamanho do Copo</h3>
                  {currentSize && (
                    <p className="text-pink-400 text-xs font-semibold mt-0.5">
                      Selecionado: {currentSize.name} (R$ {currentSize.price.toFixed(2).replace('.', ',')})
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {sizesList.filter(item => !item.isPaused).map((item) => {
                  const isSelected = currentSize?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.isPaused) {
                          alert('Este item está pausado no momento.');
                          return;
                        }
                        setCurrentSize(item);
                        // Auto-expand Style selection and ALL dynamic additionals categories to show them open!
                        setAccordions(prev => {
                          const updated = { ...prev, size: true, style: true };
                          categories.forEach(cat => {
                            updated[cat.id] = true;
                          });
                          return updated;
                        });
                      }}
                      className={`relative flex flex-col items-center p-3 rounded-2xl cursor-pointer border transition-all duration-300 ${
                        isSelected 
                          ? 'border-pink-500 bg-pink-500/10 text-white shadow-[0_0_15px_rgba(236,72,153,0.15)]' 
                          : 'border-plum-800/55 bg-plum-900/40 hover:border-plum-700/60'
                      }`}
                    >
                      {/* Inner selected dot */}
                      <div className={`absolute top-2 right-2 w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-zinc-700 text-transparent'
                      }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>

                      {/* Beautiful Graphic representation of the cup size */}
                      <div className="mt-2 mb-3">
                        <AcaiCupVisual size={item} style={stylesList[0] || styles[0]} extras={[]} height="75px" brandName={brandName} />
                      </div>

                      <span className="font-extrabold text-sm text-center text-white">{item.name.replace('Copo ', '')}</span>
                      <span className="text-pink-400 font-black text-xs mt-1">R$ {item.price.toFixed(0)},00</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Render customization options only after size is selected, showing them fully open */}
            {currentSize ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                
                {/* STEP 2: STYLE SELECTOR */}
                <div className="bg-plum-900/40 border border-plum-800/60 rounded-3xl p-5 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 rounded-full bg-pink-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                      2
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-black text-white tracking-wide uppercase">Escolha seu Estilo</h3>
                      {currentStyle && (
                        <p className="text-pink-400 text-xs font-semibold mt-0.5">
                          Selecionado: {currentStyle.name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-zinc-400 mb-3 font-medium">Escolha a base do seu copo:</p>
                  <div className="space-y-2.5">
                    {stylesList.filter(item => !item.isPaused).map(item => renderRadioOption(item, currentStyle, (selected) => {
                      setCurrentStyle(selected);
                    }))}
                  </div>
                </div>

                {/* STEP 3: EXTRAS SECTION - ALL OPEN */}
                <div className="space-y-6">
                  <div className="text-center my-6">
                    <div className="inline-flex items-center gap-1.5 bg-pink-500/10 border border-pink-500/20 px-4 py-1.5 rounded-full">
                      <Sparkles size={14} className="text-pink-400" />
                      <span className="text-xs text-pink-400 font-extrabold uppercase tracking-widest">Personalize seu Copo</span>
                    </div>
                    <p className="text-zinc-400 text-xs mt-1">Todos os grupos de adicionais abertos abaixo para você escolher:</p>
                  </div>

                  {/* Dynamic additionals categories map - All fully expanded */}
                  {categories.map((category, index) => {
                    const stepNumber = index + 3;
                    const categoryItems = (category.items || []).filter(item => !item.isPaused);
                    const selectedItems = currentExtras.filter(e => categoryItems.some(item => item.id === e.id));
                    const groupedSelected = getGroupedExtras(selectedItems);
                    const summaryText = groupedSelected.map(g => `${g.quantity}x ${g.item.name}`).join(', ') || 'Nenhum selecionado';

                    return (
                      <div key={category.id} className="bg-plum-900/40 border border-plum-800/60 rounded-3xl p-5 shadow-lg">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-plum-800/40">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-pink-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                              {stepNumber}
                            </div>
                            <div>
                              <h3 className="text-base font-black text-white uppercase tracking-wide">{category.name}</h3>
                              {summaryText !== 'Nenhum selecionado' && (
                                <p className="text-pink-400 text-xs font-semibold mt-0.5">{summaryText}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-plum-800 text-zinc-400 font-bold uppercase tracking-wider">
                            Opcional
                          </span>
                        </div>
                        
                        {categoryItems.length === 0 ? (
                          <p className="text-xs text-zinc-500 italic text-center py-4">Nenhum adicional cadastrado nesta categoria.</p>
                        ) : (
                          <div className="flex flex-col divide-y divide-plum-800/20 bg-plum-950/20 rounded-2xl px-4 py-1 border border-plum-800/30">
                            {categoryItems.map(item => renderCheckboxOption(item))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            ) : (
              /* Informative Callout when no cup size is chosen yet */
              <div className="p-6 bg-plum-900/20 border border-dashed border-plum-800/40 rounded-3xl text-center my-6 animate-pulse">
                <span className="text-3xl">👈</span>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mt-2.5">Monte seu Copo do seu Jeito</h4>
                <p className="text-zinc-400 text-xs mt-1 leading-normal max-w-xs mx-auto">
                  Selecione um tamanho de copo acima para abrir as bases e todos os adicionais deliciosos!
                </p>
              </div>
            )}

            {/* Highlights & Offers Carousel - Featured at the bottom of the page */}
            <div className="mt-8 mb-4 bg-gradient-to-br from-amber-500/15 via-pink-500/5 to-transparent border border-amber-500/20 rounded-3xl p-4 shadow-lg animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 animate-pulse text-base">✨</span>
                  <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Combos & Ofertas Especiais</h4>
                </div>
                <span className="text-[10px] text-amber-400/80 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Mais Vendidos</span>
              </div>
              
              <p className="text-zinc-400 text-xs leading-relaxed mb-4 px-1">
                Copos prontos montados com carinho! Adicione direto ao seu carrinho ou use o botão ⚙️ para personalizar do seu jeito.
              </p>
              
              <div className="flex gap-4 overflow-x-auto pb-3 -mx-2 px-2 scrollbar-none snap-x">
                {preConfiguredCups.map(preMade => {
                  const selectedSize = sizesList.find(s => s.id === preMade.sizeId) || sizesList[0];
                  const selectedStyle = stylesList.find(st => st.id === preMade.styleId) || stylesList[0];
                  
                  const resolvedExtras: MenuItem[] = [];
                  preMade.extras.forEach(itemPreset => {
                    let foundItem: MenuItem | undefined;
                    for (const cat of categories) {
                      foundItem = (cat.items || []).find(i => i.id === itemPreset.id || i.name.toLowerCase() === itemPreset.name.toLowerCase());
                      if (foundItem) break;
                    }
                    resolvedExtras.push(foundItem || itemPreset);
                  });

                  const computedPrice = selectedSize.price + selectedStyle.price + resolvedExtras.reduce((sum, item) => sum + item.price, 0);

                  return (
                    <div 
                      key={preMade.id} 
                      className="snap-start shrink-0 w-64 bg-plum-950/80 border border-plum-800/60 rounded-2xl p-3 flex flex-col justify-between hover:border-pink-500/40 transition-all duration-300 shadow-md"
                    >
                      <div>
                        <div className="relative w-full h-24 bg-plum-900 rounded-xl overflow-hidden mb-2.5">
                          <img 
                            src={preMade.image} 
                            alt={preMade.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-pink-500 text-black text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider shadow">
                            {preMade.badge.split(' ').slice(1).join(' ') || 'Especial'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-white text-xs leading-snug line-clamp-1">{preMade.name}</h4>
                        <p className="text-zinc-400 text-[10px] leading-relaxed line-clamp-2 mt-1 min-h-[30px]">{preMade.description}</p>
                      </div>
                      
                      <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between">
                        <span className="text-pink-400 font-black text-xs">
                          R$ {computedPrice.toFixed(2).replace('.', ',')}
                        </span>
                        
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => customizePreMade(preMade)}
                            title="Personalizar esta combinação"
                            className="bg-plum-900 hover:bg-plum-850 text-zinc-300 border border-plum-800 hover:border-plum-700 text-xs font-bold px-2.5 py-1 rounded-xl transition active:scale-95"
                          >
                            ⚙️
                          </button>
                          <button
                            type="button"
                            onClick={() => addPreMadeToCart(preMade)}
                            className="bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl transition active:scale-95 flex items-center gap-1"
                          >
                            <ShoppingBag size={10} /> Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Bar Container for ordering / state builder */}
            <div className="fixed bottom-0 left-0 w-full bg-plum-950/95 border-t border-plum-800/60 p-4 z-40 shadow-[0_-10px_35px_rgba(14,5,26,0.95)] backdrop-blur-md">
              <div className="max-w-xl mx-auto flex items-center gap-3">
                {(!currentSize || !currentStyle) ? (
                  <div className="w-full bg-plum-900/60 text-zinc-500 py-4 px-6 rounded-2xl font-bold text-center text-sm md:text-base border border-plum-800/40">
                    Selecione Tamanho e Estilo para avançar
                  </div>
                ) : (
                  <button 
                    onClick={addToCart}
                    className="w-full bg-pink-600 hover:bg-pink-500 text-white py-4 rounded-2xl font-extrabold text-base flex items-center justify-between px-6 shadow-[0_0_25px_rgba(219,39,119,0.35)] transition-all active:scale-[0.98] animate-in slide-in-from-bottom-2"
                  >
                    <span className="flex items-center gap-2">Adicionar ao Pedido <Heart className="fill-white" size={16} /></span>
                    <span className="font-black text-lg">R$ {currentTotal.toFixed(2).replace('.', ',')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Store Information Card */}
            <div className="mt-14 mb-10 bg-plum-900/70 border border-plum-800/80 rounded-3xl p-6 text-center space-y-4 shadow-xl">
              <h4 className="text-yellow-500 font-extrabold text-sm uppercase tracking-[0.2em]">Horário de Atendimento</h4>
              
              <div className="flex flex-col items-center justify-center gap-2.5">
                <div className="flex items-center gap-2 text-zinc-200 font-bold bg-plum-950/60 px-4 py-1.5 rounded-full border border-plum-800/50">
                  <Clock size={16} className="text-pink-500" />
                  <span>11:00 até 00:30</span>
                </div>
                <span className="text-zinc-400 text-xs font-semibold">Todos os dias (Manhã até a Madrugada)</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-plum-800/50 text-sm">
                <a href={`https://instagram.com/${(instagramHandle || 'jamileacai').trim().replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-zinc-300 hover:text-pink-500 transition font-medium">
                  <Instagram size={18} className="text-pink-500" /> @{(instagramHandle || 'jamileacai').trim().replace('@', '')}
                </a>
                <span className="h-1.5 w-1.5 bg-pink-500 rounded-full hidden sm:inline"></span>
                <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                  <MapPin size={18} className="text-pink-500" /> Bairro Sylvio Venturdi
                </span>
              </div>
            </div>
          </div>
        )}

        {/* View Featured/Copos Prontos Page */}
        {view === 'featured' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 py-4 space-y-6">
            <div className="text-center max-w-md mx-auto space-y-1.5 mb-2">
              <span className="text-pink-500 font-extrabold text-[10px] tracking-widest uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/15">
                🍨 Praticidade & Sabor
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1">Destaques e Ofertas da Casa</h2>
              <p className="text-zinc-400 text-xs leading-normal">
                Nossos sabores mais amados combinados por quem mais entende. Adicione direto ao seu carrinho ou personalize!
              </p>
            </div>

            <div className="grid gap-6">
              {preConfiguredCups.map(preMade => {
                // Compute real-time price based on current prices in sizesList, stylesList, and categories
                const selectedSize = sizesList.find(s => s.id === preMade.sizeId) || sizesList.find(s => s.name.includes(preMade.sizeName.split(' ')[1])) || sizesList[0];
                const selectedStyle = stylesList.find(st => st.id === preMade.styleId) || stylesList.find(st => st.name.includes(preMade.styleName)) || stylesList[0];
                
                const resolvedExtras: MenuItem[] = [];
                preMade.extras.forEach(itemPreset => {
                  let foundItem: MenuItem | undefined;
                  for (const cat of categories) {
                    foundItem = (cat.items || []).find(i => i.id === itemPreset.id || i.name.toLowerCase() === itemPreset.name.toLowerCase());
                    if (foundItem) break;
                  }
                  resolvedExtras.push(foundItem || itemPreset);
                });

                const computedPrice = selectedSize.price + selectedStyle.price + resolvedExtras.reduce((sum, item) => sum + item.price, 0);

                return (
                  <div 
                    key={preMade.id} 
                    className="bg-plum-900/40 border border-plum-800/60 rounded-3xl overflow-hidden hover:border-pink-500/40 transition-all duration-300 shadow-xl flex flex-col sm:flex-row"
                  >
                    {/* Visual representation */}
                    <div className="relative w-full sm:w-44 h-48 sm:h-auto bg-plum-950/80 overflow-hidden shrink-0 flex items-center justify-center">
                      <img 
                        src={preMade.image} 
                        alt={preMade.name} 
                        className="w-full h-full object-cover transform hover:scale-110 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-pink-500 text-black text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider shadow-md">
                        {preMade.badge}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="text-base font-black text-white leading-snug">{preMade.name}</h3>
                          <span className="text-pink-400 font-black text-base shrink-0">
                            R$ {computedPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        
                        <p className="text-zinc-400 text-xs leading-normal mb-3.5">
                          {preMade.description}
                        </p>

                        <div className="space-y-1.5 mb-5">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-300">
                            <span className="text-zinc-500">Tamanho:</span>
                            <span className="font-bold text-pink-400 bg-pink-500/5 border border-pink-500/10 px-2 py-0.5 rounded">
                              {selectedSize.name}
                            </span>
                            <span className="text-zinc-500">Estilo:</span>
                            <span className="font-bold text-pink-400 bg-pink-500/5 border border-pink-500/10 px-2 py-0.5 rounded">
                              {selectedStyle.name}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1 pt-1">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider self-center mr-1">Adicionais inclusos:</span>
                            {resolvedExtras.map(extra => (
                              <span key={extra.id} className="text-[10px] bg-plum-950 text-zinc-300 font-semibold px-2 py-0.5 rounded-lg border border-plum-800">
                                {extra.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* CTA Actions */}
                      <div className="grid grid-cols-2 gap-2.5 border-t border-plum-800/40 pt-3">
                        <button
                          type="button"
                          onClick={() => customizePreMade(preMade)}
                          className="bg-plum-950 hover:bg-plum-900 text-zinc-300 hover:text-white border border-plum-800/80 hover:border-plum-700 py-2.5 rounded-xl text-xs font-extrabold transition-all active:scale-[0.98] text-center"
                        >
                          ⚙️ Personalizar
                        </button>
                        <button
                          type="button"
                          onClick={() => addPreMadeToCart(preMade)}
                          className="bg-pink-600 hover:bg-pink-500 text-white py-2.5 rounded-xl text-xs font-black transition-all active:scale-[0.98] shadow-md shadow-pink-600/10 text-center flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag size={13} />
                          Adicionar Direto
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View Store/Sobre a Loja Page */}
        {view === 'store' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 py-4 space-y-6">
            <div className="text-center max-w-md mx-auto space-y-1.5 mb-2">
              <span className="text-amber-400 font-extrabold text-[10px] tracking-widest uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/15">
                ℹ️ Nossa Identidade
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1">Sobre a Jamile Açaí</h2>
              <p className="text-zinc-400 text-xs leading-normal">
                Saiba tudo sobre nossa entrega, horário de atendimento, formas de pagamento e compromisso com a qualidade.
              </p>
            </div>

            <div className="grid gap-4 text-left">
              {/* Operational Status */}
              <div className="bg-plum-900/40 border border-plum-800/60 rounded-3xl p-5 shadow-lg flex items-start gap-4">
                <div className="p-3 bg-plum-950 rounded-2xl border border-plum-800 text-pink-500 shrink-0">
                  <Clock size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-white">Status & Horário de Funcionamento</h3>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className={`text-xs font-black uppercase tracking-wider ${isStoreOpen ? 'text-green-400' : 'text-red-400'}`}>
                      {isStoreOpen ? 'Aberto Agora' : 'Fechado no Momento'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal pt-1">
                    Atendimento de <strong className="text-zinc-200">Segunda a Domingo</strong> das <strong className="text-white">11h00 às 00h30</strong>.
                  </p>
                </div>
              </div>

              {/* Delivery info */}
              <div className="bg-plum-900/40 border border-plum-800/60 rounded-3xl p-5 shadow-lg flex items-start gap-4">
                <div className="p-3 bg-plum-950 rounded-2xl border border-plum-800 text-pink-500 shrink-0">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-white">Modalidade de Entrega</h3>
                  <p className="text-xs text-pink-400 font-extrabold bg-pink-500/5 border border-pink-500/10 px-2 py-0.5 rounded-md inline-block">
                    🛵 Só Delivery (Entrega Rápida)
                  </p>
                  <p className="text-xs text-zinc-400 leading-normal pt-1">
                    Preparamos com embalagem térmica reforçada para garantir que seu açaí chegue perfeitamente congelado e cremoso em <strong className="text-white">30 a 50 minutos</strong>.
                  </p>
                </div>
              </div>

              {/* Location / Address */}
              <div className="bg-plum-900/40 border border-plum-800/60 rounded-3xl p-5 shadow-lg flex items-start gap-4">
                <div className="p-3 bg-plum-950 rounded-2xl border border-plum-800 text-pink-500 shrink-0">
                  <MapPin size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-white">Nosso Endereço de Cobertura</h3>
                  <p className="text-xs font-bold text-zinc-200">Bairro Sylvio Venturdi</p>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Atendemos todo o Bairro Sylvio Venturdi e regiões próximas com entrega rápida.
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-plum-900/40 border border-plum-800/60 rounded-3xl p-5 shadow-lg flex items-start gap-4">
                <div className="p-3 bg-plum-950 rounded-2xl border border-plum-800 text-pink-500 shrink-0">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-white">Formas de Pagamento Aceitas</h3>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Aceitamos pagamentos no momento da entrega do pedido:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    <span className="text-[10px] bg-plum-950 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">📱 Pix</span>
                    <span className="text-[10px] bg-plum-950 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold uppercase">💳 Cartão de Crédito</span>
                    <span className="text-[10px] bg-plum-950 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-bold uppercase">💳 Débito</span>
                    <span className="text-[10px] bg-plum-950 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded font-bold uppercase">💵 Dinheiro</span>
                  </div>
                </div>
              </div>

              {/* Quality Guarantee Card */}
              <div className="bg-gradient-to-br from-pink-500/10 via-plum-900/20 to-transparent border border-pink-500/20 rounded-3xl p-6 shadow-xl text-center space-y-3 pt-6">
                <span className="text-2xl">✨</span>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Compromisso Jamile</h4>
                <p className="text-xs text-zinc-300 leading-relaxed max-w-sm mx-auto">
                  Utilizamos apenas açaí premium selecionado e frutas frescas higienizadas e fatiadas diariamente. Nosso compromisso é levar até você a melhor experiência em sabor e refrescância!
                </p>
                
                {instagramHandle && (
                  <div className="pt-2">
                    <a 
                      href={`https://instagram.com/${instagramHandle.trim().replace('@', '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 font-extrabold bg-pink-500/10 hover:bg-pink-500/15 px-4 py-2 rounded-xl border border-pink-500/20 transition-all active:scale-95"
                    >
                      <Instagram size={14} />
                      <span>Siga-nos @{instagramHandle.trim().replace('@', '')}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* View Cart Page */}
        {view === 'cart' && (
          <div className="animate-in slide-in-from-right-8 duration-300 py-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button 
                  onClick={() => setView('menu')} 
                  className="p-2.5 bg-plum-900 hover:bg-plum-800 text-zinc-300 rounded-xl mr-4 transition"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Seu Carrinho</h2>
                  <p className="text-zinc-400 text-xs mt-0.5">Revise os copos adicionados ao seu pedido</p>
                </div>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="bg-plum-900/60 border border-plum-800/60 rounded-3xl p-10 text-center space-y-4">
                <span className="text-5xl block">🛒</span>
                <h3 className="text-lg font-bold text-white">Seu carrinho está vazio</h3>
                <p className="text-zinc-400 text-sm">Adicione um copo de açaí montado do seu jeito para começar!</p>
                <button 
                  onClick={() => setView('menu')}
                  className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-3 rounded-xl font-bold transition"
                >
                  Montar Copo
                </button>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {cart.map((cup, idx) => (
                  <div key={cup.id} className="bg-plum-900/85 border border-plum-800/80 rounded-2xl p-5 relative overflow-hidden shadow-lg animate-in fade-in">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-600"></div>
                    
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {/* Miniature visual of cup */}
                        <div className="w-11 h-11 bg-plum-950/60 rounded-xl border border-pink-500/10 flex items-center justify-center p-0.5">
                          <AcaiCupVisual size={cup.size} style={cup.style} extras={cup.extras} height="40px" brandName={brandName} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-white">Copo {idx + 1} - {cup.size?.name}</h3>
                          <p className="text-yellow-500 text-xs font-semibold">{cup.style?.name}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(cup.id)}
                        className="text-zinc-500 hover:text-red-400 p-1.5 bg-plum-950/40 rounded-lg hover:bg-red-500/10 transition-all"
                        title="Remover copo"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    {cup.extras.length > 0 ? (
                      <div className="bg-plum-950/40 rounded-xl p-3 mt-3 space-y-1.5 border border-plum-800/30">
                        <p className="text-[10px] font-extrabold text-pink-400 uppercase tracking-widest mb-1.5">Acompanhamentos selecionados</p>
                        {getGroupedExtras(cup.extras).map(ge => (
                          <div key={ge.item.id} className="flex justify-between text-xs text-zinc-300">
                            <span>• {ge.quantity}x {ge.item.name}</span>
                            <span className="text-zinc-500 font-medium">R$ {(ge.item.price * ge.quantity).toFixed(2).replace('.', ',')}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 italic mt-2 pl-2">Sem adicionais</p>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-plum-800/60 flex justify-between items-center">
                      <span className="font-bold text-zinc-400 text-xs uppercase tracking-wider">Subtotal do Copo</span>
                      <span className="font-extrabold text-pink-500 text-lg">R$ {cup.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="space-y-4">
                <button 
                  onClick={() => { resetCurrentCup(); setView('menu'); }}
                  className="w-full bg-plum-900 hover:bg-plum-800 border border-pink-500/30 text-pink-400 py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition"
                >
                  <Plus size={18} /> Adicionar outro copo
                </button>

                <div className="fixed bottom-0 left-0 w-full bg-plum-950/95 border-t border-plum-800/60 p-4 z-40 shadow-[0_-10px_35px_rgba(14,5,26,0.95)] backdrop-blur-md">
                  <div className="max-w-xl mx-auto">
                    <button 
                      onClick={() => setView('checkout')}
                      className="w-full bg-pink-600 hover:bg-pink-500 text-white py-4 rounded-2xl font-extrabold text-base flex items-center justify-between px-6 shadow-[0_0_25px_rgba(219,39,119,0.35)] transition-all active:scale-[0.98]"
                    >
                      <span>Avançar para entrega</span>
                      <span className="font-black text-lg">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Checkout View / Finalize Order */}
        {view === 'checkout' && (
          <div className="animate-in slide-in-from-right-8 duration-300 py-4">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setView('cart')} 
                className="p-2.5 bg-plum-900 hover:bg-plum-800 text-zinc-300 rounded-xl mr-4 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">Finalizar Pedido</h2>
                <p className="text-zinc-400 text-xs mt-0.5">Preencha os dados de envio</p>
              </div>
            </div>

            {/* Customer Details block */}
            <div className="bg-plum-900/90 border border-plum-800/80 rounded-3xl p-5 mb-5 shadow-xl space-y-5">
              <h3 className="font-extrabold text-base text-white mb-2 border-b border-plum-800/50 pb-2.5 flex items-center gap-1.5">
                <span>👤 Seu Contato</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Seu Nome completo</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Maria Oliveira"
                    className="w-full bg-plum-950 border border-plum-800/80 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition duration-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Como deseja receber seu pedido?</label>
                  <div className="bg-pink-600/10 border border-pink-500/25 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                      <span className="text-xl">🛵</span>
                      <span>SÓ DELIVERY (Entrega em Casa)</span>
                    </div>
                    <span className="text-[10px] bg-pink-600 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Ativo
                    </span>
                  </div>
                </div>

                <div className="animate-in fade-in slide-in-from-top-3 duration-300">
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Endereço de Entrega</label>
                  <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value, deliveryType: 'entrega'})}
                    placeholder="Ex: Rua das Flores, 123 - Bairro Glória (Ponto de referência)"
                    rows={3}
                    className="w-full bg-plum-950 border border-plum-800/80 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition duration-300 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment block */}
            <div className="bg-plum-900/90 border border-plum-800/80 rounded-3xl p-5 mb-5 shadow-xl">
              <h3 className="font-extrabold text-base text-white mb-4 border-b border-plum-800/50 pb-2.5 flex items-center gap-1.5">
                <span>💳 Forma de Pagamento</span>
              </h3>
              
              <div className="space-y-2.5">
                {[
                  { id: 'pix', label: 'PIX (Envio de chave no chat)', icon: '⚡' },
                  { id: 'cartao', label: 'Cartão de Crédito/Débito (Levar maquininha)', icon: '💳' },
                  { id: 'dinheiro', label: 'Dinheiro', icon: '💵' }
                ].map((method) => (
                  <label key={method.id} className={`flex items-center p-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
                    formData.payment === method.id 
                      ? 'border-pink-500 bg-pink-500/10 text-white' 
                      : 'border-plum-800/60 bg-plum-950 hover:bg-plum-900/30'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value={method.id}
                      checked={formData.payment === method.id}
                      onChange={() => setFormData({...formData, payment: method.id})}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3.5 flex items-center justify-center transition-all ${
                      formData.payment === method.id ? 'border-pink-500' : 'border-zinc-600'
                    }`}>
                      {formData.payment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />}
                    </div>
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <span>{method.icon}</span>
                      <span>{method.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional Observation Notes */}
            <div className="bg-plum-900/90 border border-plum-800/80 rounded-3xl p-5 mb-10 shadow-xl">
               <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Observações adicionais (Opcional)</label>
               <textarea 
                 value={formData.notes}
                 onChange={(e) => setFormData({...formData, notes: e.target.value})}
                 placeholder="Ex: Enviar troco para R$ 50,00 ou tirar casca do kiwi..."
                 rows={2}
                 className="w-full bg-plum-950 border border-plum-800/80 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition duration-300 text-sm"
               />
            </div>

            {/* Order Confirmation fixed send bar */}
            <div className="fixed bottom-0 left-0 w-full bg-plum-950/95 border-t border-plum-800/60 p-4 z-40 shadow-[0_-10px_35px_rgba(14,5,26,0.95)] backdrop-blur-md">
              <div className="max-w-xl mx-auto space-y-2">
                {!isStoreOpen && (
                  <p className="text-[11px] text-red-400 font-extrabold text-center uppercase tracking-wider animate-pulse">
                    🚨 Desculpe, a loja está fechada agora. Não é possível enviar o pedido.
                  </p>
                )}
                <button 
                  onClick={isStoreOpen ? sendOrder : undefined}
                  disabled={!isStoreOpen}
                  className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] ${
                    isStoreOpen 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.3)]' 
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/40'
                  }`}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  <span>{isStoreOpen ? 'Enviar Pedido pelo WhatsApp' : 'Loja Fechada no Momento'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Elegant WhatsApp & Menu Configuration Modal for store owners (Painel do Dono) */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 overflow-y-auto">
          <div className={`bg-plum-900 border border-plum-800 rounded-3xl p-6 w-full shadow-2xl animate-in zoom-in-95 duration-200 my-8 transition-all ${
            (isAdminAuthenticated && (settingsTab === 'menu' || settingsTab === 'offers')) ? 'max-w-xl' : 'max-w-sm'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-plum-800/80 mb-4">
              <h3 className="font-black text-lg text-white flex items-center gap-2">
                <Settings size={20} className="text-pink-500" />
                <span>Painel de Controle</span>
              </h3>
              <div className="flex items-center gap-2">
                {isAdminAuthenticated && (
                  <button 
                    onClick={() => {
                      setIsAdminAuthenticated(false);
                      setPasswordInput('');
                    }}
                    title="Bloquear Painel"
                    className="text-yellow-500 hover:text-yellow-400 font-bold bg-plum-950/60 px-2 py-1 rounded-lg transition text-[10px] flex items-center gap-1 shrink-0"
                  >
                    🔒 Sair
                  </button>
                )}
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-zinc-400 hover:text-white font-black bg-plum-950/60 p-1.5 rounded-lg transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {!isAdminAuthenticated ? (
              <div className="space-y-4 py-4 animate-in fade-in duration-150 text-left">
                <div className="text-center space-y-2 mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/30">
                    <Settings size={24} className="animate-spin duration-1000" />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Acesso Restrito ao Dono</h4>
                  <p className="text-[11px] text-zinc-400">Insira a senha de administrador para gerenciar o sistema.</p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (passwordInput === adminPassword) {
                    setIsAdminAuthenticated(true);
                    setPasswordError('');
                    setPasswordInput('');
                  } else {
                    setPasswordError('Senha incorreta! Tente novamente.');
                  }
                }} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Senha de Acesso</label>
                    <input 
                      type="password"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError('');
                      }}
                      placeholder="••••"
                      className="w-full bg-plum-950 border border-plum-800 rounded-xl px-4 py-3 text-white text-center text-lg font-bold focus:outline-none focus:border-pink-500 transition"
                      autoFocus
                    />
                    {passwordError && (
                      <span className="text-[10px] text-red-400 mt-1.5 block font-bold text-center">❌ {passwordError}</span>
                    )}
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-plum-950 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition duration-200 active:scale-95"
                  >
                    🔓 Entrar no Painel
                  </button>
                  <p className="text-[10px] text-zinc-500 text-center">Dica: A senha padrão inicial é <strong className="text-zinc-400">1234</strong>. Você poderá alterá-la no painel.</p>
                </form>
              </div>
            ) : (
              <>
                {/* Modal Tabs navigation */}
                <div className="grid grid-cols-5 gap-1 p-1 bg-plum-950 rounded-xl mb-5 border border-plum-800/40">
                  <button
                    type="button"
                    onClick={() => setSettingsTab('whatsapp')}
                    className={`py-2 px-1 text-[9px] sm:text-[11px] font-bold rounded-lg transition-all ${
                      settingsTab === 'whatsapp'
                        ? 'bg-pink-600 text-white shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    🛵 Loja
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsTab('menu')}
                    className={`py-2 px-1 text-[9px] sm:text-[11px] font-bold rounded-lg transition-all ${
                      settingsTab === 'menu'
                        ? 'bg-yellow-500 text-plum-950 shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    📋 Itens
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsTab('offers')}
                    className={`py-2 px-1 text-[9px] sm:text-[11px] font-bold rounded-lg transition-all ${
                      settingsTab === 'offers'
                        ? 'bg-amber-500 text-plum-950 shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    ✨ Ofertas
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsTab('cloud')}
                    className={`py-2 px-1 text-[9px] sm:text-[11px] font-bold rounded-lg transition-all ${
                      settingsTab === 'cloud'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    ☁️ Nuvem
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsTab('notas')}
                    className={`py-2 px-1 text-[9px] sm:text-[11px] font-bold rounded-lg transition-all ${
                      settingsTab === 'notas'
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    📝 Notas
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsTab('theme')}
                    className={`py-2 px-1 text-[9px] sm:text-[11px] font-bold rounded-lg transition-all ${
                      settingsTab === 'theme'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    🎨 Tema
                  </button>
                </div>

                {/* Store Operational Status Toggle */}
                <div className="bg-plum-950 border border-plum-800/60 rounded-2xl p-4 mb-5 flex items-center justify-between text-left shadow-lg">
                  <div className="flex flex-col pr-2">
                    <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      {isStoreOpen ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                          <span className="text-green-400">Loja Aberta</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                          <span className="text-red-400">Loja Fechada</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-1 leading-normal">
                      Clientes {isStoreOpen ? 'podem fechar pedidos' : 'ficarão avisados que está fechado'}.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !isStoreOpen;
                      setIsStoreOpen(nextState);
                      localStorage.setItem('jamile_is_store_open', String(nextState));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all duration-250 active:scale-95 shrink-0 border ${
                      isStoreOpen 
                        ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30' 
                        : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30'
                    }`}
                  >
                    {isStoreOpen ? '🔴 Fechar' : '🟢 Abrir'}
                  </button>
                </div>
                
                {/* TAB 1: WHATSAPP SETTINGS */}
                {settingsTab === 'whatsapp' && (
                  <div className="space-y-4 animate-in fade-in duration-150 text-left">
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Insira o número do celular com o código do país (Brasil é 55) e o DDD para onde os clientes enviarão os pedidos.
                    </p>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Número do WhatsApp (Só números)</label>
                      <input 
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => saveWhatsappNumber(e.target.value)}
                        placeholder="Ex: 5511999999999"
                        className="w-full bg-plum-950 border border-plum-800 rounded-xl px-4 py-3 text-white text-base font-bold focus:outline-none focus:border-pink-500 transition"
                      />
                      <span className="text-[10px] text-pink-400 mt-1.5 block font-semibold">Atualizado automaticamente!</span>
                    </div>

                    <div className="bg-plum-950/60 p-3 rounded-xl border border-plum-800/40 space-y-1.5">
                      <p className="text-[10px] text-zinc-400 font-extrabold uppercase">Como funciona?</p>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        Este número é salvo localmente. Quando você compartilha o link do menu digital, as pessoas podem fazer pedidos e clicar no botão verde para enviar diretamente para o seu WhatsApp!
                      </p>
                    </div>

                    <button 
                      onClick={() => setShowSettings(false)}
                      className="w-full bg-pink-600 hover:bg-pink-500 text-white py-3.5 rounded-xl font-bold text-sm transition shadow-[0_4px_15px_rgba(219,39,119,0.2)]"
                    >
                      Confirmar e Fechar
                    </button>
                  </div>
                )}

                {/* TAB 2: MENU MANAGER */}
                {settingsTab === 'menu' && (
                  <div className="space-y-6 animate-in fade-in duration-150 max-h-[60vh] overflow-y-auto pr-1 text-left">
                    
                    {/* Section A: Add Category */}
                    <form onSubmit={handleAddCategory} className="bg-plum-950/50 p-4 rounded-2xl border border-plum-800/40 space-y-3">
                      <h4 className="text-xs font-black text-yellow-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span>📁 Criar Nova Categoria</span>
                      </h4>
                      <p className="text-[11px] text-zinc-400">Crie novas categorias de complementos (Ex: "Frutas Premium", "Caldas")</p>
                      
                      <div className="flex flex-col gap-2">
                        <input 
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Nome da categoria (Ex: Coberturas Quentes)"
                          className="flex-1 bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500"
                        />
                        <select
                          value={selectedGroupId}
                          onChange={(e) => setSelectedGroupId(e.target.value)}
                          className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-yellow-500"
                        >
                          <option value="">Não importar itens (vazio)</option>
                          {itemGroups.map(group => (
                            <option key={group.id} value={group.id}>{group.name}</option>
                          ))}
                        </select>
                        <button 
                          type="submit"
                          className="bg-yellow-500 hover:bg-yellow-400 text-plum-950 px-4 rounded-xl text-xs font-extrabold transition shrink-0"
                        >
                          + Criar Categoria
                        </button>
                      </div>
                    </form>

                    {/* Section B: Add Item */}
                    <form id="add-item-form" onSubmit={handleAddItem} className="bg-plum-950/50 p-4 rounded-2xl border border-plum-800/40 space-y-3.5">
                      <h4 className="text-xs font-black text-pink-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🍓 Adicionar Item ou Adicional</span>
                      </h4>
                      <p className="text-[11px] text-zinc-400">Adicione tamanhos, estilos de copos ou adicionais/ingredientes ao seu cardápio</p>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Onde Adicionar (Categoria)</label>
                          <select
                            value={newItemCategory}
                            onChange={(e) => setNewItemCategory(e.target.value)}
                            className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                          >
                            <option value="sizes">🥤 Tamanhos de Copo</option>
                            <option value="styles">🍨 Estilos de Copo</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>✨ Adicional: {cat.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Nome do Item</label>
                            <input 
                              type="text"
                              value={newItemName}
                              onChange={(e) => setNewItemName(e.target.value)}
                              placeholder="Ex: Gotas de chocolate"
                              className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Preço (R$)</label>
                            <input 
                              type="text"
                              value={newItemPrice}
                              onChange={(e) => setNewItemPrice(e.target.value)}
                              placeholder="Ex: 4,50"
                              className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">URL da Foto do Item (Opcional)</label>
                          <input 
                            type="url"
                            value={newItemImageUrl}
                            onChange={(e) => setNewItemImageUrl(e.target.value)}
                            placeholder="Ex: https://images.unsplash.com/photo-..."
                            className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                          />
                          <p className="text-[9px] text-zinc-500 mt-1">Cole um link de imagem (Unsplash, etc.) para ilustrar o ingrediente.</p>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                            <input 
                              type="checkbox"
                              checked={newItemIsNew}
                              onChange={(e) => setNewItemIsNew(e.target.checked)}
                              className="rounded border-plum-800 text-pink-600 focus:ring-pink-500"
                            />
                            <span>Destacar item com selo "Novo!" 🏷️</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                            <input 
                              type="checkbox"
                              checked={newItemIsFeatured}
                              onChange={(e) => setNewItemIsFeatured(e.target.checked)}
                              className="rounded border-plum-800 text-pink-600 focus:ring-pink-500"
                            />
                            <span>Adicionar aos Destaques da Casa ⭐</span>
                          </label>
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-pink-600 hover:bg-pink-500 text-white py-2.5 rounded-xl text-xs font-black transition"
                        >
                          + Adicionar ao Cardápio
                        </button>
                      </div>
                    </form>

                    {/* Section C: List Categories and items */}
                    <div className="space-y-4 text-left">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">📋 Itens Atuais Cadastrados</h4>
                        <button
                          type="button"
                          onClick={() => setShowPaused(!showPaused)}
                          className="text-[10px] text-pink-400 font-bold hover:text-pink-300"
                        >
                          {showPaused ? 'Esconder Pausados' : 'Ver Itens Pausados'}
                        </button>
                      </div>
                      
                      {/* Sizes management */}
                      <div className="bg-plum-950/30 p-3 rounded-xl border border-plum-800/40">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-yellow-400">🥤 Tamanhos cadastrados</span>
                          <button 
                            type="button"
                            onClick={() => {
                              setNewItemCategory('sizes');
                              document.getElementById('add-item-form')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-[10px] text-pink-400 font-black hover:text-pink-300"
                          >
                            + Adicionar
                          </button>
                        </div>
                        <div className="space-y-1.5 mt-2">
                          {sizesList.filter(item => showPaused || !item.isPaused).map(item => (
                            <div key={item.id} className="flex justify-between items-center text-xs bg-plum-950/60 py-1.5 px-3 rounded-lg border border-plum-900/60">
                              <div className="flex items-center gap-2 min-w-0">
                                {item.imageUrl && (
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.name} 
                                    className="w-6 h-6 rounded object-cover shrink-0 border border-plum-800" 
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                )}
                                <span className="text-zinc-200 truncate flex items-center gap-1">
                                  {item.name}
                                  {item.isFeatured && <span title="Destaque" className="text-yellow-400 shrink-0 text-[10px]">⭐</span>}
                                  {item.isNew && <span title="Novo" className="text-pink-400 text-[8px] bg-pink-500/15 border border-pink-500/25 px-1 rounded font-black shrink-0">N</span>}
                                </span>
                              </div>
                              <div className="flex items-center gap-2.5 shrink-0 pl-2">
                                <span className="text-pink-400 font-extrabold">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                                <button 
                                  type="button" 
                                  onClick={() => handleTogglePauseItem('sizes', item.id)}
                                  className={`text-sm transition ${item.isPaused ? 'text-green-400 hover:text-green-300' : 'text-zinc-500 hover:text-amber-500'}`}
                                  title={item.isPaused ? "Ativar" : "Pausar"}
                                >
                                  {item.isPaused ? '▶️' : '⏸️'}
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => handleMoveItem('sizes', item.id, 'up')}
                                  className="text-zinc-500 hover:text-white transition text-sm"
                                  title="Mover para cima"
                                >
                                  ⬆️
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => handleMoveItem('sizes', item.id, 'down')}
                                  className="text-zinc-500 hover:text-white transition text-sm"
                                  title="Mover para baixo"
                                >
                                  ⬇️
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => startEditItem('sizes', item)}
                                  className="text-zinc-400 hover:text-yellow-400 transition text-sm"
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => handleDeleteItem('sizes', item.id)}
                                  className="text-zinc-500 hover:text-red-400 transition text-sm"
                                  title="Excluir"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Styles management */}
                      <div className="bg-plum-950/30 p-3 rounded-xl border border-plum-800/40">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-yellow-400">🍨 Estilos cadastrados</span>
                        </div>
                        <div className="space-y-1.5 mt-2">
                          {stylesList.filter(item => showPaused || !item.isPaused).map(item => (
                            <div key={item.id} className="flex justify-between items-center text-xs bg-plum-950/60 py-1.5 px-3 rounded-lg border border-plum-900/60">
                              <div className="flex items-center gap-2 min-w-0">
                                {item.imageUrl && (
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.name} 
                                    className="w-6 h-6 rounded object-cover shrink-0 border border-plum-800" 
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                )}
                                <span className="text-zinc-200 truncate flex items-center gap-1">
                                  {item.name}
                                  {item.isFeatured && <span title="Destaque" className="text-yellow-400 shrink-0 text-[10px]">⭐</span>}
                                  {item.isNew && <span title="Novo" className="text-pink-400 text-[8px] bg-pink-500/15 border border-pink-500/25 px-1 rounded font-black shrink-0">N</span>}
                                </span>
                              </div>
                              <div className="flex items-center gap-2.5 shrink-0 pl-2">
                                <span className="text-pink-400 font-extrabold">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                                <button 
                                  type="button" 
                                  onClick={() => handleTogglePauseItem('styles', item.id)}
                                  className={`text-sm transition ${item.isPaused ? 'text-green-400 hover:text-green-300' : 'text-zinc-500 hover:text-amber-500'}`}
                                  title={item.isPaused ? "Ativar" : "Pausar"}
                                >
                                  {item.isPaused ? '▶️' : '⏸️'}
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => handleMoveItem('styles', item.id, 'up')}
                                  className="text-zinc-500 hover:text-white transition text-sm"
                                  title="Mover para cima"
                                >
                                  ⬆️
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => handleMoveItem('styles', item.id, 'down')}
                                  className="text-zinc-500 hover:text-white transition text-sm"
                                  title="Mover para baixo"
                                >
                                  ⬇️
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => startEditItem('styles', item)}
                                  className="text-zinc-400 hover:text-yellow-400 transition text-sm"
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => handleDeleteItem('styles', item.id)}
                                  className="text-zinc-500 hover:text-red-400 transition text-sm"
                                  title="Excluir"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Categories and their respective complement items */}
                      {categories.map(cat => (
                        <div key={cat.id} className="bg-plum-950/30 p-3 rounded-xl border border-plum-800/40 space-y-2">
                          <div className="flex justify-between items-center pb-1 border-b border-plum-800/40">
                            <span className="text-xs font-black text-pink-400">✨ Categoria: {cat.name}</span>
                            <div className="flex gap-2">
                              <button 
                                type="button"
                                onClick={() => handleEditCategory(cat.id)}
                                className="text-[10px] text-yellow-400 font-bold bg-yellow-500/10 hover:bg-yellow-500/20 px-2 py-0.5 rounded transition"
                              >
                                Editar ✏️
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="text-[10px] text-red-400 font-bold bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded transition"
                              >
                                Excluir Categoria 🗑️
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            {(!cat.items || cat.items.length === 0) ? (
                              <p className="text-[10px] text-zinc-500 italic pl-1">Sem itens nesta categoria</p>
                            ) : (
                              cat.items.filter(item => showPaused || !item.isPaused).map(item => (
                                <div key={item.id} className="flex justify-between items-center text-xs bg-plum-950/60 py-1.5 px-3 rounded-lg border border-plum-900/40">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {item.imageUrl && (
                                      <img 
                                        src={item.imageUrl} 
                                        alt={item.name} 
                                        className="w-6 h-6 rounded object-cover shrink-0 border border-plum-800" 
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                          (e.target as HTMLElement).style.display = 'none';
                                        }}
                                      />
                                    )}
                                    <span className="text-zinc-200 truncate flex items-center gap-1">
                                      {item.name}
                                      {item.isFeatured && <span title="Destaque" className="text-yellow-400 shrink-0 text-[10px]">⭐</span>}
                                      {item.isNew && <span title="Novo" className="text-pink-400 text-[8px] bg-pink-500/15 border border-pink-500/25 px-1 rounded font-black shrink-0">N</span>}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2.5 shrink-0 pl-2">
                                    <span className="text-pink-400 font-extrabold">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                                    <button 
                                      type="button" 
                                      onClick={() => handleTogglePauseItem(cat.id, item.id)}
                                      className={`text-sm transition ${item.isPaused ? 'text-green-400 hover:text-green-300' : 'text-zinc-500 hover:text-amber-500'}`}
                                      title={item.isPaused ? "Ativar" : "Pausar"}
                                    >
                                      {item.isPaused ? '▶️' : '⏸️'}
                                    </button>
                                    <button 
                                      type="button" 
                                      onClick={() => handleMoveItem(cat.id, item.id, 'up')}
                                      className="text-zinc-500 hover:text-white transition text-sm"
                                      title="Mover para cima"
                                    >
                                      ⬆️
                                    </button>
                                    <button 
                                      type="button" 
                                      onClick={() => handleMoveItem(cat.id, item.id, 'down')}
                                      className="text-zinc-500 hover:text-white transition text-sm"
                                      title="Mover para baixo"
                                    >
                                      ⬇️
                                    </button>
                                    <button 
                                      type="button" 
                                      onClick={() => startEditItem(cat.id, item)}
                                      className="text-zinc-400 hover:text-yellow-400 transition text-sm"
                                      title="Editar"
                                    >
                                      ✏️
                                    </button>
                                    <button 
                                      type="button" 
                                      onClick={() => handleDeleteItem(cat.id, item.id)}
                                      className="text-zinc-500 hover:text-red-400 transition text-sm"
                                      title="Excluir"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Section D: Wipe Custom and Reset to Defaults */}
                    <div className="pt-4 border-t border-plum-800/60 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="w-full bg-red-600/15 hover:bg-red-600/25 border border-red-500/20 text-red-400 py-2.5 rounded-xl text-xs font-bold transition"
                      >
                        ⚠️ Restaurar Cardápio Padrão Original
                      </button>
                      <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
                        Atenção: A restauração apagará permanentemente todos os adicionais e categorias que você cadastrou.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 3: OFFERS & COMBOS MANAGER */}
                {settingsTab === 'offers' && (
                  <div className="space-y-6 animate-in fade-in duration-150 max-h-[60vh] overflow-y-auto pr-1 text-left">
                    {/* Section A: Create Offer */}
                    <form onSubmit={handleAddOffer} className="bg-plum-950/50 p-4 rounded-2xl border border-plum-800/40 space-y-3.5">
                      <h4 className="text-xs font-black text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span>✨ Lançar Nova Oferta ou Combo</span>
                      </h4>
                      <p className="text-[11px] text-zinc-400">Monte um copo promocional fixo e lance-o em destaque para os clientes comprarem com 1 clique.</p>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Nome da Oferta / Combo</label>
                          <input 
                            type="text"
                            value={newOfferName}
                            onChange={(e) => setNewOfferName(e.target.value)}
                            placeholder="Ex: Combo Casal Supremo, Açaí Kids Trufado"
                            className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 animate-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Destaque (Badge)</label>
                            <input 
                              type="text"
                              value={newOfferBadge}
                              onChange={(e) => setNewOfferBadge(e.target.value)}
                              placeholder="Ex: 🔥 Mais Vendido"
                              className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 animate-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Preço Especial (R$)</label>
                            <input 
                              type="text"
                              value={newOfferCustomPrice}
                              onChange={(e) => setNewOfferCustomPrice(e.target.value)}
                              placeholder="Ex: 29,90 (Vazio = Soma padrão)"
                              className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 animate-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Tamanho Base</label>
                            <select
                              value={newOfferSizeId}
                              onChange={(e) => setNewOfferSizeId(e.target.value)}
                              className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 animate-none"
                            >
                              {sizesList.map(s => (
                                <option key={s.id} value={s.id}>{s.name} (+ R$ {s.price.toFixed(2)})</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Estilo Base</label>
                            <select
                              value={newOfferStyleId}
                              onChange={(e) => setNewOfferStyleId(e.target.value)}
                              className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 animate-none"
                            >
                              {stylesList.map(st => (
                                <option key={st.id} value={st.id}>{st.name} (+ R$ {st.price.toFixed(2)})</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Link da Imagem (Opcional)</label>
                          <input 
                            type="text"
                            value={newOfferImage}
                            onChange={(e) => setNewOfferImage(e.target.value)}
                            placeholder="Link de imagem da web"
                            className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 text-ellipsis animate-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Descrição do Combo</label>
                          <textarea 
                            value={newOfferDescription}
                            onChange={(e) => setNewOfferDescription(e.target.value)}
                            placeholder="Descreva o que vem neste combo dos deuses..."
                            rows={2}
                            className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none animate-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Selecione os Adicionais Inclusos</label>
                          <div className="space-y-3 max-h-40 overflow-y-auto p-2 bg-plum-950 border border-plum-800 rounded-xl">
                            {categories.map(cat => (
                              <div key={cat.id} className="space-y-1">
                                <span className="text-[9px] font-bold text-yellow-500/80 uppercase tracking-widest block">{cat.name}</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {(cat.items || []).map(item => {
                                    const isSelected = newOfferExtras.some(e => e.id === item.id);
                                    return (
                                      <button
                                        type="button"
                                        key={item.id}
                                        onClick={() => toggleOfferExtra(item)}
                                        className={`text-[9px] font-extrabold px-2 py-1 rounded-lg transition border flex items-center gap-1 ${
                                          isSelected
                                            ? 'bg-amber-500 text-plum-950 border-amber-400 font-black'
                                            : 'bg-plum-900 text-zinc-400 border-plum-800 hover:text-zinc-200 hover:border-zinc-700'
                                        }`}
                                      >
                                        <span>{item.name}</span>
                                        {isSelected && <span className="text-[8px]">✓</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Live price counter based on selections */}
                          <div className="mt-2.5 flex justify-between items-center bg-plum-950/60 px-3 py-2 rounded-xl border border-plum-850">
                            <span className="text-[10px] text-zinc-400 font-semibold">Valor somado normal:</span>
                            <span className="text-xs font-black text-white">
                              R$ {((sizesList.find(s => s.id === newOfferSizeId)?.price || 0) + 
                                   (stylesList.find(st => st.id === newOfferStyleId)?.price || 0) + 
                                   newOfferExtras.reduce((sum, item) => sum + item.price, 0)).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-400 text-plum-950 py-2.5 rounded-xl text-xs font-black transition active:scale-95 flex items-center justify-center gap-1.5 shadow"
                      >
                        🚀 Lançar Oferta Ativa
                      </button>
                    </form>

                    {/* Section B: Manage Active Offers */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 px-1">
                        <span>📋 Ofertas & Combos Ativos ({preConfiguredCups.length})</span>
                      </h4>
                      
                      <div className="space-y-2">
                        {preConfiguredCups.map(offer => (
                          <div 
                            key={offer.id} 
                            className="bg-plum-950 border border-plum-800 rounded-2xl p-3 flex justify-between gap-3 items-center shadow-md hover:border-pink-500/20 transition-all duration-300"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img 
                                src={offer.image} 
                                alt={offer.name} 
                                className="w-12 h-12 rounded-xl object-cover border border-plum-800 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0 text-left">
                                <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/15 text-[8px] font-black px-1.5 py-0.2 rounded uppercase mb-0.5 tracking-wider">
                                  {offer.badge.replace(/[^\w\sÀ-ÿ]/g, '').trim()}
                                </span>
                                <h5 className="font-extrabold text-white text-xs truncate leading-snug">{offer.name}</h5>
                                <div className="flex gap-1.5 mt-0.5 text-[9px] text-zinc-400 flex-wrap">
                                  <span>🥤 {offer.sizeName}</span>
                                  <span>•</span>
                                  <span>🍨 {offer.styleName}</span>
                                  {offer.extras && offer.extras.length > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="truncate max-w-[120px]">+ {offer.extras.map((e: any) => e.name).join(', ')}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="font-black text-pink-400 text-xs text-right whitespace-nowrap">
                                R$ {offer.price.toFixed(2).replace('.', ',')}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteOffer(offer.id)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 p-2 rounded-xl transition active:scale-95"
                                title="Excluir Oferta"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: FIREBASE CLOUD SYNC */}
                {settingsTab === 'cloud' && (
                  <div className="space-y-6 animate-in fade-in duration-150 text-left">
                    {!user ? (
                      <div className="text-center py-8">
                        <button
                          onClick={async () => {
                            setIsLoggingIn(true);
                            try {
                              await googleSignIn();
                            } catch (e) {
                              console.error(e);
                            } finally {
                              setIsLoggingIn(false);
                            }
                          }}
                          disabled={isLoggingIn}
                          className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition flex items-center justify-center gap-2 w-full"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545 10.239v3.821h5.445c-.712 2.315-2.757 3.951-5.445 3.951-3.141 0-5.688-2.547-5.688-5.688s2.547-5.688 5.688-5.688c1.42 0 2.7.53 3.666 1.396l2.842-2.842A9.704 9.704 0 0012.545 2.14C6.916 2.14 2.345 6.71 2.345 12.34s4.57 10.2 10.2 10.2c5.89 0 9.8-4.144 9.8-9.98 0-.671-.06-1.319-.174-1.936h-9.626z" /></svg>
                          {isLoggingIn ? 'Entrando...' : 'Entrar com Google'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-plum-950/50 p-4 rounded-2xl border border-plum-800/40">
                          <p className="text-sm text-zinc-300 mb-2">Conectado como:</p>
                          <p className="font-bold text-white text-lg">{user.displayName}</p>
                          <p className="text-xs text-zinc-400">{user.email}</p>
                        </div>
                        
                        <div className="bg-plum-950/50 p-4 rounded-2xl border border-plum-800/40 space-y-3">
                          <p className="text-xs text-zinc-300">Faça o backup de suas configurações, categorias e notas na nuvem.</p>
                          <button
                            onClick={async () => {
                              try {
                                await saveStoreConfig(user.uid, {
                                  whatsappNumber,
                                  isStoreOpen,
                                  instagramHandle,
                                  brandName,
                                  brandSubtitle,
                                  brandSlogan,
                                  brandTheme,
                                  sizesList,
                                  stylesList,
                                  categories,
                                  itemGroups,
                                  preConfiguredCups,
                                  userNotes,
                                  userEvents,
                                  userChecklist
                                });
                                alert('Dados salvos com sucesso na nuvem!');
                              } catch (e) {
                                console.error('Error saving:', e);
                                alert('Erro ao salvar os dados na nuvem.');
                              }
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2"
                          >
                            ☁️ Salvar Dados na Nuvem
                          </button>
                        </div>
                        
                        <button
                          onClick={logout}
                          className="w-full bg-red-600/20 text-red-500 border border-red-500/50 hover:bg-red-600 hover:text-white py-2 rounded-xl font-bold transition"
                        >
                          Sair da Conta
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* TAB 5: MINHAS NOTAS & EVENTOS */}
                {settingsTab === 'notas' && (
                  <div className="space-y-6 animate-in fade-in duration-150 text-left">
                    <div className="bg-plum-950/50 p-4 rounded-2xl border border-plum-800/40 space-y-3.5">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>📝 Minhas Notas Pessoais</span>
                      </h3>
                      <textarea
                        value={userNotes}
                        onChange={(e) => setUserNotes(e.target.value)}
                        placeholder="Escreva aqui suas ideias, recados, ou informações da loja..."
                        className="w-full h-32 bg-plum-950 border border-plum-800 rounded-xl p-3 text-sm text-zinc-300 focus:outline-none focus:border-yellow-500 resize-none"
                      />
                    </div>
                    
                    <div className="bg-plum-950/50 p-4 rounded-2xl border border-plum-800/40 space-y-3.5">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>📅 Eventos & Lembretes</span>
                      </h3>
                      <textarea
                        value={userEvents}
                        onChange={(e) => setUserEvents(e.target.value)}
                        placeholder="Anote aqui seus eventos futuros ou lembretes (Ex: Sexta-feira promoção, dia 20 fornecedor)..."
                        className="w-full h-24 bg-plum-950 border border-plum-800 rounded-xl p-3 text-sm text-zinc-300 focus:outline-none focus:border-yellow-500 resize-none"
                      />
                    </div>
                    
                    <div className="bg-plum-950/50 p-4 rounded-2xl border border-plum-800/40 space-y-3.5">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>✅ Checklist Diário</span>
                      </h3>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="newChecklistItem"
                          placeholder="Nova tarefa..."
                          className="flex-1 bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              if (input.value.trim()) {
                                setUserChecklist([...userChecklist, { id: `chk_${Date.now()}`, text: input.value.trim(), done: false }]);
                                input.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('newChecklistItem') as HTMLInputElement;
                            if (input && input.value.trim()) {
                              setUserChecklist([...userChecklist, { id: `chk_${Date.now()}`, text: input.value.trim(), done: false }]);
                              input.value = '';
                            }
                          }}
                          className="bg-yellow-500 text-plum-950 px-4 rounded-xl font-bold text-sm"
                        >
                          + Add
                        </button>
                      </div>
                      
                      <div className="space-y-2 mt-3">
                        {userChecklist.map((item, index) => (
                          <div key={item.id} className="flex items-center justify-between bg-plum-900/50 p-2 rounded-xl">
                            <label className="flex items-center gap-3 cursor-pointer flex-1">
                              <input 
                                type="checkbox"
                                checked={item.done}
                                onChange={(e) => {
                                  const newChecklist = [...userChecklist];
                                  newChecklist[index].done = e.target.checked;
                                  setUserChecklist(newChecklist);
                                }}
                                className="w-5 h-5 rounded accent-yellow-500"
                              />
                              <span className={`text-sm ${item.done ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                                {item.text}
                              </span>
                            </label>
                            <button
                              onClick={() => {
                                setUserChecklist(userChecklist.filter(c => c.id !== item.id));
                              }}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        {userChecklist.length === 0 && (
                          <p className="text-xs text-zinc-500 italic">Nenhuma tarefa. Adicione acima.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* TAB 3: THEME & BRAND PERSONALIZATION */}
                {settingsTab === 'theme' && (
                  <div className="space-y-6 animate-in fade-in duration-150 text-left">
                    <div className="bg-plum-950/50 p-4 rounded-2xl border border-plum-800/40 space-y-3.5">
                      <h4 className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🏢 Identidade da Loja</span>
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Nome Principal da Marca</label>
                          <input 
                            type="text"
                            value={brandName}
                            onChange={(e) => {
                              setBrandName(e.target.value);
                              localStorage.setItem('jamile_brand_name', e.target.value);
                            }}
                            placeholder="Ex: Jamile"
                            className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Subtítulo do Cabeçalho</label>
                          <input 
                            type="text"
                            value={brandSubtitle}
                            onChange={(e) => {
                              setBrandSubtitle(e.target.value);
                              localStorage.setItem('jamile_brand_subtitle', e.target.value);
                            }}
                            placeholder="Ex: AÇAÍ PREMIUM"
                            className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Slogan ou Frase da Loja</label>
                          <input 
                            type="text"
                            value={brandSlogan}
                            onChange={(e) => {
                              setBrandSlogan(e.target.value);
                              localStorage.setItem('jamile_brand_slogan', e.target.value);
                            }}
                            placeholder="Ex: Sabor autêntico e qualidade superior"
                            className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Instagram da Loja (Sem @)</label>
                          <input 
                            type="text"
                            value={instagramHandle}
                            onChange={(e) => {
                              setInstagramHandle(e.target.value);
                              localStorage.setItem('jamile_instagram_handle', e.target.value);
                            }}
                            placeholder="Ex: jamile_acai"
                            className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                          />
                          <p className="text-[9px] text-zinc-500 mt-1">Insira apenas o nome de usuário (Ex: jamile_acai) para habilitar o link do Instagram no cabeçalho.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-plum-950/50 p-4 rounded-2xl border border-plum-800/40 space-y-3">
                      <h4 className="text-xs font-black text-pink-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🎨 Paleta de Cores & Tema</span>
                      </h4>
                      <p className="text-[11px] text-zinc-400">Escolha uma das paletas premium pré-configuradas para o seu cardápio:</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {[
                          { id: 'purple', name: '💜 Roxo & Rosa (Jamile)', colors: ['bg-[#18092d]', 'bg-[#ec4899]'] },
                          { id: 'green', name: '💚 Verde & Laranja (Tropical)', colors: ['bg-[#081a0b]', 'bg-[#f97316]'] },
                          { id: 'brown', name: '🤎 Chocolate & Ouro (Gourmet)', colors: ['bg-[#1f1007]', 'bg-[#d97706]'] },
                          { id: 'red', name: '❤️ Morango & Creme (Especial)', colors: ['bg-[#26050d]', 'bg-[#ef4444]'] },
                          { id: 'dark', name: '🖤 Preto & Neon (Cyber)', colors: ['bg-[#0f0f0f]', 'bg-[#a3e635]'] },
                        ].map(themeItem => (
                          <button
                            key={themeItem.id}
                            type="button"
                            onClick={() => {
                              setBrandTheme(themeItem.id as any);
                              localStorage.setItem('jamile_brand_theme', themeItem.id);
                            }}
                            className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border transition text-left ${
                              brandTheme === themeItem.id 
                                ? 'border-pink-500 bg-pink-500/10 text-white animate-pulse' 
                                : 'border-plum-800/50 bg-plum-950/50 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            <div className="flex shrink-0">
                              <span className={`w-3.5 h-3.5 rounded-full ${themeItem.colors[0]} border border-white/20 -mr-1 z-10`}></span>
                              <span className={`w-3.5 h-3.5 rounded-full ${themeItem.colors[1]} border border-white/20`}></span>
                            </div>
                            <span className="truncate">{themeItem.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-plum-950/50 p-4 rounded-2xl border border-plum-800/40 space-y-3">
                      <h4 className="text-xs font-black text-yellow-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🔒 Segurança do Painel</span>
                      </h4>
                      
                      <div>
                        <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Nova Senha do Painel</label>
                        <input 
                          type="text"
                          value={adminPassword}
                          onChange={(e) => {
                            setAdminPassword(e.target.value);
                            localStorage.setItem('jamile_admin_password', e.target.value);
                          }}
                          placeholder="Ex: 1234"
                          className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500"
                        />
                        <p className="text-[9px] text-zinc-500 mt-1">Essa senha protege o painel de alterações não autorizadas.</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowSettings(false)}
                      className="w-full bg-pink-600 hover:bg-pink-500 text-white py-3.5 rounded-xl font-bold text-sm transition shadow-[0_4px_15px_rgba(219,39,119,0.2)]"
                    >
                      Confirmar e Fechar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Item Modal overlay */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" style={{ zIndex: 60 }}>
          <div className="bg-plum-900 border border-plum-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 my-8 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-plum-800/80 mb-4">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <span>✏️ Editar Item</span>
              </h3>
              <button 
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-zinc-400 hover:text-white font-black bg-plum-950/60 p-1.5 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditItem} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Nome do Item</label>
                <input 
                  type="text"
                  value={editItemName}
                  onChange={(e) => setEditItemName(e.target.value)}
                  placeholder="Ex: Gotas de chocolate"
                  className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Preço (R$)</label>
                <input 
                  type="text"
                  value={editItemPrice}
                  onChange={(e) => setEditItemPrice(e.target.value)}
                  placeholder="Ex: 4,50"
                  className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">URL da Foto do Item</label>
                <input 
                  type="url"
                  value={editItemImageUrl}
                  onChange={(e) => setEditItemImageUrl(e.target.value)}
                  placeholder="Ex: https://images.unsplash.com/photo-..."
                  className="w-full bg-plum-950 border border-plum-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                />
                <div className="mt-2 flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-plum-800 hover:bg-plum-700 text-white text-[10px] py-2 rounded-xl transition"
                  >
                    Selecionar Foto do Dispositivo
                  </button>
                </div>
                <p className="text-[9px] text-zinc-500 mt-1">Cole uma URL ou selecione uma foto (máx 500KB).</p>
              </div>

              {/* Image Preview */}
              {editItemImageUrl.trim() && (
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Visualização da Foto:</span>
                  <div className="w-full h-24 rounded-xl bg-plum-950 border border-plum-800 overflow-hidden flex items-center justify-center relative">
                    <img 
                      src={editItemImageUrl.trim()} 
                      alt="Prévia da foto" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const sibling = target.nextSibling as HTMLDivElement;
                        if (sibling) sibling.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-red-950/20 text-red-400 text-xs font-bold" style={{ display: 'none' }}>
                      Imagem inválida ⚠️
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input 
                    type="checkbox"
                    checked={editItemIsNew}
                    onChange={(e) => setEditItemIsNew(e.target.checked)}
                    className="rounded border-plum-800 text-pink-600 focus:ring-pink-500"
                  />
                  <span>Destacar item com selo "Novo!" 🏷️</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input 
                    type="checkbox"
                    checked={editItemIsFeatured}
                    onChange={(e) => setEditItemIsFeatured(e.target.checked)}
                    className="rounded border-plum-800 text-pink-600 focus:ring-pink-500"
                  />
                  <span>Adicionar aos Destaques da Casa ⭐</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="bg-plum-950 border border-plum-800 hover:bg-plum-900 text-zinc-400 py-2.5 rounded-xl text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={() => handleSaveNoExit()}
                  className="bg-pink-900 hover:bg-pink-800 text-pink-100 py-2.5 rounded-xl text-xs font-bold transition"
                >
                  Salvar
                </button>
                <button 
                  type="button"
                  onClick={(e) => handleSaveEditItem(e as any)}
                  className="bg-pink-600 hover:bg-pink-500 text-white py-2.5 rounded-xl text-xs font-black transition"
                >
                  Salvar e Sair
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
