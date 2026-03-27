/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Star, 
  Wifi, 
  Coffee, 
  Waves, 
  Utensils, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import confetti from 'canvas-confetti';

// Stylized Success Checkmark Component
const SuccessCheckmark = () => (
  <div className="relative w-24 h-24 flex items-center justify-center">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1 
      }}
      className="absolute inset-0 bg-gold rounded-full shadow-[0_0_30px_rgba(197,160,89,0.5)]"
    />
    <motion.svg
      viewBox="0 0 52 52"
      className="w-12 h-12 text-white z-10"
      initial="initial"
      animate="animate"
    >
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.1 27.2l7.1 7.2 16.7-16.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "circOut" }}
      />
    </motion.svg>
    
    {/* Decorative rings */}
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 1.5 + i * 0.2, opacity: 0 }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          delay: i * 0.3,
          ease: "easeOut" 
        }}
        className="absolute inset-0 border border-gold/30 rounded-full"
      />
    ))}
  </div>
);

// Initialize Gemini for image generation
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const NAV_LINKS = [
  { name: 'Home', href: '#' },
  { name: 'Rooms', href: '#rooms' },
  { name: 'Amenities', href: '#amenities' },
  { name: 'Dining', href: '#dining' },
  { name: 'Contact', href: '#contact' },
];

const ROOMS = [
  {
    id: 1,
    name: 'Presidential Suite',
    tagline: 'The Pinnacle of Urban Luxury',
    description: 'Our Presidential Suite offers an unparalleled experience of luxury and sophistication. Spanning over 200 square meters, this suite features a grand living area, a private dining room for eight, and a master bedroom with a king-sized bed draped in the finest Egyptian cotton.',
    price: '$1,200',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['24/7 Private Butler', 'Panoramic City Views', 'Private Infinity Pool Access', 'In-room Spa Treatments', 'Limousine Airport Transfer'],
    specs: { size: '210 sqm', occupancy: '2 Adults, 1 Child', bed: 'Grand King' }
  },
  {
    id: 2,
    name: 'Executive Deluxe',
    tagline: 'Sophistication for the Modern Traveler',
    description: 'Designed for both business and leisure, the Executive Deluxe room combines sleek modern aesthetics with warm, inviting textures. Enjoy a dedicated workspace, a state-of-the-art entertainment system, and a spa-inspired bathroom.',
    price: '$650',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Ergonomic Workspace', 'Smart Home Integration', 'Nespresso Machine', 'Rain Shower', 'Daily Turndown Service'],
    specs: { size: '65 sqm', occupancy: '2 Adults', bed: 'King Size' }
  },
  {
    id: 3,
    name: 'Classic Heritage Room',
    tagline: 'Timeless Elegance & Warmth',
    description: 'Our Classic Heritage rooms pay homage to the local culture with hand-crafted furniture and traditional art pieces, seamlessly integrated with modern luxury. A perfect retreat for those seeking comfort and character.',
    price: '$450',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Local Heritage Decor', 'Garden or Courtyard View', 'Luxury Bath Amenities', 'Pillow Menu', 'High-Speed WiFi'],
    specs: { size: '45 sqm', occupancy: '2 Adults', bed: 'Queen Size' }
  }
];

const AMENITIES = [
  { icon: Waves, name: 'Infinity Pool', description: 'Swim above the clouds in our heated rooftop pool.' },
  { icon: Utensils, name: 'Fine Dining', description: 'Award-winning cuisine prepared by world-class chefs.' },
  { icon: Coffee, name: 'Artisan Cafe', description: 'Freshly roasted coffee and delicate pastries.' },
  { icon: Wifi, name: 'Ultra-Fast WiFi', description: 'Stay connected with high-speed fiber internet.' },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000');
  const [selectedRoom, setSelectedRoom] = useState<typeof ROOMS[0] | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [stickyBooking, setStickyBooking] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1 Adult'
  });
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourPosition, setTourPosition] = useState(50); // 0 to 100 for panning
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<'idle' | 'processing' | 'received' | 'confirmed'>('idle');
  const [preSelectedRoom, setPreSelectedRoom] = useState<string>("Any Available");
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  
  // Guest Data State
  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '1 Adult',
    roomType: 'Any Available'
  });

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setReservationStatus('processing');

    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...guestData, roomType: preSelectedRoom })
      });
      const data = await response.json();
      
      setTimeout(() => {
        setIsChecking(false);
        setReservationStatus('received');
        
        // Simulate "Acceptance" after 8 seconds
        setTimeout(() => {
          setReservationStatus('confirmed');
          // Trigger celebratory confetti
          const duration = 3 * 1000;
          const animationEnd = Date.now() + duration;
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

          const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

          const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#C5A059', '#FFFFFF'] });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#C5A059', '#141414'] });
          }, 250);
        }, 8000);
      }, 2500);
    } catch (error) {
      console.error("Reservation failed:", error);
      setIsChecking(false);
      setReservationStatus('idle');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('Sending...');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      const data = await response.json();
      setContactStatus(data.message);
      setContactData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setContactStatus(null), 5000);
    } catch (error) {
      console.error("Contact failed:", error);
      setContactStatus('Failed to send message.');
    }
  };

  const handleCheckAvailability = (roomType?: string) => {
    if (roomType) setPreSelectedRoom(roomType);
    
    // If we have sticky booking data, sync it to guestData
    setGuestData(prev => ({
      ...prev,
      checkIn: stickyBooking.checkIn || prev.checkIn,
      checkOut: stickyBooking.checkOut || prev.checkOut,
      guests: stickyBooking.guests || prev.guests
    }));

    // On mobile, open drawer. On desktop, scroll.
    if (window.innerWidth < 768) {
      setIsBookingDrawerOpen(true);
    } else {
      const bookSection = document.getElementById('book');
      if (bookSection) {
        bookSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate a custom hero image on load to "amaze" the client
  useEffect(() => {
    async function generateHero() {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: 'A hyper-realistic, ultra-luxury hotel lobby with golden accents, marble floors, and a grand chandelier, cinematic lighting, 8k resolution, architectural photography' }]
          },
          config: { imageConfig: { aspectRatio: "16:9" } }
        });
        
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setHeroImage(`data:image/png;base64,${part.inlineData.data}`);
          }
        }
      } catch (error) {
        console.error("Image generation failed:", error);
      }
    }
    generateHero();
  }, []);

  return (
    <div className="min-h-screen selection:bg-gold selection:text-white">
      {/* Mobile Booking Drawer */}
      <AnimatePresence>
        {isBookingDrawerOpen && (
          <div className="fixed inset-0 z-[120] flex items-end justify-center md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-luxury-black/80 backdrop-blur-sm"
              onClick={() => setIsBookingDrawerOpen(false)}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full bg-white rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif text-luxury-black">Complete Reservation</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Secure your luxury stay</p>
                </div>
                <button 
                  onClick={() => setIsBookingDrawerOpen(false)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={(e) => {
                  handleReservationSubmit(e);
                  setIsBookingDrawerOpen(false);
                }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Check In</label>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <input 
                          type="date" 
                          value={guestData.checkIn}
                          onChange={(e) => setGuestData(prev => ({ ...prev, checkIn: e.target.value }))}
                          className="w-full bg-transparent text-sm font-bold focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Check Out</label>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <input 
                          type="date" 
                          value={guestData.checkOut}
                          onChange={(e) => setGuestData(prev => ({ ...prev, checkOut: e.target.value }))}
                          className="w-full bg-transparent text-sm font-bold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      value={guestData.name}
                      onChange={(e) => setGuestData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="john@example.com"
                      value={guestData.email}
                      onChange={(e) => setGuestData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+1 (555) 000-0000"
                      value={guestData.phone}
                      onChange={(e) => setGuestData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-luxury-black text-white py-5 rounded-2xl text-xs uppercase tracking-[0.3em] font-black hover:bg-gold transition-all shadow-xl"
                  >
                    Confirm Reservation
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Virtual Tour Modal */}
      <AnimatePresence>
        {isTourOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-luxury-black/95 backdrop-blur-xl"
              onClick={() => setIsTourOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full h-full md:w-[90vw] md:h-[80vh] bg-black rounded-none md:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white">
                  <Waves className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-serif text-xl">360° Grand Lobby Tour</h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">Drag to explore the space</p>
                </div>
              </div>

              <button 
                onClick={() => setIsTourOpen(false)}
                className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Panorama Viewer */}
              <div 
                className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
                onMouseDown={(e) => {
                  setIsDragging(true);
                  setStartX(e.pageX);
                }}
                onMouseMove={(e) => {
                  if (!isDragging) return;
                  const x = e.pageX;
                  const walk = (x - startX) * 0.1;
                  setTourPosition(prev => Math.max(0, Math.min(100, prev - walk)));
                  setStartX(x);
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={(e) => {
                  setIsDragging(true);
                  setStartX(e.touches[0].pageX);
                }}
                onTouchMove={(e) => {
                  if (!isDragging) return;
                  const x = e.touches[0].pageX;
                  const walk = (x - startX) * 0.2;
                  setTourPosition(prev => Math.max(0, Math.min(100, prev - walk)));
                  setStartX(x);
                }}
                onTouchEnd={() => setIsDragging(false)}
              >
                <div 
                  className="absolute inset-0 transition-transform duration-100 ease-out"
                  style={{ 
                    backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=3000)',
                    backgroundSize: 'cover',
                    backgroundPosition: `${tourPosition}% center`,
                    width: '200%',
                    left: '-50%'
                  }}
                />
                
                {/* Hotspots */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ transform: `translate(calc(-50% + ${(tourPosition - 50) * -10}px), -50%)` }}
                >
                  <div className="group pointer-events-auto">
                    <div className="w-4 h-4 bg-gold rounded-full animate-ping absolute inset-0" />
                    <div className="w-4 h-4 bg-gold rounded-full relative z-10 border-2 border-white" />
                    <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black">Concierge Desk</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tour Controls */}
              <div className="p-6 bg-luxury-black/80 backdrop-blur border-t border-white/10 flex justify-between items-center">
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-gold/20 text-gold rounded-lg text-[10px] uppercase tracking-widest font-bold border border-gold/30">Lobby</button>
                  <button className="px-4 py-2 text-white/40 hover:text-white rounded-lg text-[10px] uppercase tracking-widest font-bold transition-colors">Sky Pool</button>
                  <button className="px-4 py-2 text-white/40 hover:text-white rounded-lg text-[10px] uppercase tracking-widest font-bold transition-colors">Grand Suite</button>
                </div>
                <div className="flex items-center gap-4 text-white/40">
                  <span className="text-[10px] uppercase tracking-widest">Navigation: Drag to Pan</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Room Detail Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-luxury-black/90 backdrop-blur-sm"
              onClick={() => setSelectedRoom(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl bg-luxury-cream rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedRoom(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-gold transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Carousel */}
              <div className="w-full lg:w-3/5 relative h-[300px] lg:h-auto bg-black">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImageIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={selectedRoom.images[activeImageIdx]} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                
                {/* Carousel Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {selectedRoom.images.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === activeImageIdx ? 'bg-gold w-6' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-2/5 p-8 md:p-12 overflow-y-auto bg-white">
                <div className="space-y-8">
                  <div>
                    <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black mb-2 block">{selectedRoom.tagline}</span>
                    <h2 className="text-4xl md:text-5xl mb-4">{selectedRoom.name}</h2>
                    <div className="flex items-center gap-6 py-4 border-y border-gray-100">
                      <div className="text-center">
                        <p className="text-[8px] uppercase tracking-widest text-gray-400 mb-1">Size</p>
                        <p className="text-xs font-bold">{selectedRoom.specs.size}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] uppercase tracking-widest text-gray-400 mb-1">Occupancy</p>
                        <p className="text-xs font-bold">{selectedRoom.specs.occupancy}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] uppercase tracking-widest text-gray-400 mb-1">Bed</p>
                        <p className="text-xs font-bold">{selectedRoom.specs.bed}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-widest font-black text-gold">Description</h4>
                    <p className="text-gray-600 text-sm leading-relaxed font-light">
                      {selectedRoom.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-widest font-black text-gold">Exclusive Features</h4>
                    <ul className="grid grid-cols-1 gap-3">
                      {selectedRoom.features.map(f => (
                        <li key={f} className="flex items-center gap-3 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400">Starting from</p>
                      <p className="text-3xl font-serif text-gold">{selectedRoom.price}<span className="text-xs text-gray-400 font-sans"> / Night</span></p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => {
                          setSelectedRoom(null);
                          handleCheckAvailability(selectedRoom.name);
                        }}
                        className="bg-luxury-black text-white px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-black hover:bg-gold transition-all shadow-xl whitespace-nowrap"
                      >
                        Book Now
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedRoom(null);
                          handleCheckAvailability(selectedRoom.name);
                        }}
                        className="border border-luxury-black text-luxury-black px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-black hover:bg-luxury-black hover:text-white transition-all whitespace-nowrap"
                      >
                        Book for Me
                      </button>
                    </div>
                  </div>
                </div>

                {/* Room Navigation Bar */}
                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                  <button 
                    onClick={() => {
                      const currentIdx = ROOMS.findIndex(r => r.id === selectedRoom.id);
                      const prevIdx = (currentIdx - 1 + ROOMS.length) % ROOMS.length;
                      setSelectedRoom(ROOMS[prevIdx]);
                      setActiveImageIdx(0);
                    }}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-gold transition-colors group"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Previous Room
                  </button>
                  
                  <div className="flex gap-1">
                    {ROOMS.map((_, idx) => (
                      <div 
                        key={idx}
                        className={`w-1 h-1 rounded-full ${ROOMS.findIndex(r => r.id === selectedRoom.id) === idx ? 'bg-gold' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      const currentIdx = ROOMS.findIndex(r => r.id === selectedRoom.id);
                      const nextIdx = (currentIdx + 1) % ROOMS.length;
                      setSelectedRoom(ROOMS[nextIdx]);
                      setActiveImageIdx(0);
                    }}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-gold transition-colors group"
                  >
                    Next Room
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky Booking Bar */}
      <AnimatePresence>
        {scrolled && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 w-full z-[60] pt-20 pb-4 px-4 bg-white/80 backdrop-blur-xl border-b border-gold/20 shadow-xl hidden md:block"
          >
            <div className="max-w-6xl mx-auto">
              <div className="bg-luxury-black/5 rounded-2xl p-2 flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center divide-x divide-gold/20">
                  <div className="flex-1 px-6 py-2 space-y-1 group">
                    <label className="text-[8px] uppercase tracking-[0.3em] text-gold font-black block">Check In</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold" />
                      <input 
                        type="date" 
                        value={stickyBooking.checkIn}
                        onChange={(e) => setStickyBooking(prev => ({ ...prev, checkIn: e.target.value }))}
                        className="bg-transparent text-xs font-bold text-luxury-black focus:outline-none cursor-pointer w-full" 
                      />
                    </div>
                  </div>
                  <div className="flex-1 px-6 py-2 space-y-1 group">
                    <label className="text-[8px] uppercase tracking-[0.3em] text-gold font-black block">Check Out</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold" />
                      <input 
                        type="date" 
                        value={stickyBooking.checkOut}
                        onChange={(e) => setStickyBooking(prev => ({ ...prev, checkOut: e.target.value }))}
                        className="bg-transparent text-xs font-bold text-luxury-black focus:outline-none cursor-pointer w-full" 
                      />
                    </div>
                  </div>
                  <div className="flex-1 px-6 py-2 space-y-1 group">
                    <label className="text-[8px] uppercase tracking-[0.3em] text-gold font-black block">Guests</label>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gold" />
                      <select 
                        value={stickyBooking.guests}
                        onChange={(e) => setStickyBooking(prev => ({ ...prev, guests: e.target.value }))}
                        className="bg-transparent text-xs font-bold text-luxury-black focus:outline-none appearance-none cursor-pointer w-full"
                      >
                        <option>1 Adult</option>
                        <option>2 Adults</option>
                        <option>Family Suite</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleCheckAvailability()}
                  className="bg-gold text-white px-10 py-4 rounded-xl text-[10px] uppercase tracking-[0.4em] font-black hover:bg-luxury-black transition-all flex items-center gap-3 group whitespace-nowrap"
                >
                  Check Availability <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Booking Bar */}
      <AnimatePresence>
        {scrolled && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 z-[60] md:hidden"
          >
            <div className="bg-luxury-black/95 backdrop-blur-2xl border border-gold/30 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2">
              <div className="flex items-center gap-1">
                {/* Check In */}
                <div className="flex-1 min-w-0">
                  <div className="bg-white/5 rounded-2xl p-2 flex flex-col items-center justify-center border border-white/5">
                    <span className="text-[7px] uppercase tracking-widest text-gold font-bold mb-1">In</span>
                    <input 
                      type="date" 
                      value={stickyBooking.checkIn}
                      onChange={(e) => setStickyBooking(prev => ({ ...prev, checkIn: e.target.value }))}
                      className="bg-transparent text-[10px] text-white focus:outline-none w-full text-center appearance-none"
                    />
                  </div>
                </div>
                
                {/* Check Out */}
                <div className="flex-1 min-w-0">
                  <div className="bg-white/5 rounded-2xl p-2 flex flex-col items-center justify-center border border-white/5">
                    <span className="text-[7px] uppercase tracking-widest text-gold font-bold mb-1">Out</span>
                    <input 
                      type="date" 
                      value={stickyBooking.checkOut}
                      onChange={(e) => setStickyBooking(prev => ({ ...prev, checkOut: e.target.value }))}
                      className="bg-transparent text-[10px] text-white focus:outline-none w-full text-center appearance-none"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="flex-1 min-w-0">
                  <div className="bg-white/5 rounded-2xl p-2 flex flex-col items-center justify-center border border-white/5 relative">
                    <span className="text-[7px] uppercase tracking-widest text-gold font-bold mb-1">Guests</span>
                    <div className="flex items-center justify-center gap-1">
                      <select 
                        value={stickyBooking.guests}
                        onChange={(e) => setStickyBooking(prev => ({ ...prev, guests: e.target.value }))}
                        className="bg-transparent text-[10px] text-white focus:outline-none w-full text-center appearance-none pr-4"
                      >
                        <option className="text-black">1</option>
                        <option className="text-black">2</option>
                        <option className="text-black">3+</option>
                      </select>
                      <ChevronDown className="w-2 h-2 text-gold absolute right-2 bottom-3" />
                    </div>
                  </div>
                </div>

                {/* Action */}
                <button 
                  onClick={() => handleCheckAvailability()}
                  className="w-14 h-14 bg-gold rounded-[1.5rem] flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 border border-gold/30 rounded-full rotate-45" />
              <div className="absolute inset-0 border border-gold/30 rounded-full -rotate-45" />
              <span className="text-2xl font-serif text-gold font-bold italic z-10">O</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-serif tracking-[0.2em] uppercase leading-none ${scrolled ? 'text-luxury-black' : 'text-white'}`}>Oxvera</span>
              <span className={`text-[8px] uppercase tracking-[0.4em] mt-1 ${scrolled ? 'text-gray-400' : 'text-white/50'}`}>Hotel & Suites</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-10">
            {NAV_LINKS.map(link => (
              <a 
                key={link.name} 
                href={link.href}
                className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors hover:text-gold ${scrolled ? 'text-luxury-black' : 'text-white'}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <button 
            onClick={() => handleCheckAvailability()}
            className={`hidden md:block px-8 py-3 rounded-full border text-xs uppercase tracking-widest transition-all ${scrolled ? 'border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-white' : 'border-white text-white hover:bg-white hover:text-luxury-black'}`}
          >
            Book Now
          </button>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gold" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-luxury-cream flex flex-col items-center justify-center gap-8"
          >
            {NAV_LINKS.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="text-3xl font-serif italic text-luxury-black hover:text-gold transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button className="mt-4 px-10 py-4 bg-gold text-white rounded-full text-sm uppercase tracking-widest">
              Reserve a Room
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            key={heroImage}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2 }}
            src={heroImage} 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-2xl"
          >
            <span className="text-gold text-sm uppercase tracking-[0.4em] font-semibold mb-6 block">Welcome to Excellence</span>
            <h1 className="text-white text-7xl md:text-9xl leading-[0.9] mb-8">
              Refined <br />
              <span className="italic font-light">Elegance</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-light mb-10 max-w-lg leading-relaxed">
              Experience a sanctuary of luxury where every detail is crafted for your ultimate comfort and prestige.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-gold text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-gold transition-all flex items-center gap-3 group"
              >
                Explore Rooms <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setIsTourOpen(true)}
                className="px-10 py-5 border border-white text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-luxury-black transition-all"
              >
                Virtual Tour
              </button>
            </div>
          </motion.div>
        </div>

        {/* Hero Booking Section */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 hidden lg:block">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex items-center justify-between gap-8"
          >
            <div className="flex-1 flex items-center divide-x divide-white/10">
              <div className="flex-1 px-6 space-y-1">
                <label className="text-[8px] uppercase tracking-widest text-gold font-bold">Check In</label>
                <input 
                  type="date" 
                  value={stickyBooking.checkIn}
                  onChange={(e) => setStickyBooking(prev => ({ ...prev, checkIn: e.target.value }))}
                  className="block w-full bg-transparent text-white text-xs focus:outline-none font-medium cursor-pointer" 
                />
              </div>
              <div className="flex-1 px-6 space-y-1">
                <label className="text-[8px] uppercase tracking-widest text-gold font-bold">Check Out</label>
                <input 
                  type="date" 
                  value={stickyBooking.checkOut}
                  onChange={(e) => setStickyBooking(prev => ({ ...prev, checkOut: e.target.value }))}
                  className="block w-full bg-transparent text-white text-xs focus:outline-none font-medium cursor-pointer" 
                />
              </div>
              <div className="flex-1 px-6 space-y-1">
                <label className="text-[8px] uppercase tracking-widest text-gold font-bold">Guests</label>
                <select 
                  value={stickyBooking.guests}
                  onChange={(e) => setStickyBooking(prev => ({ ...prev, guests: e.target.value }))}
                  className="block w-full bg-transparent text-white text-xs focus:outline-none font-medium appearance-none cursor-pointer"
                >
                  <option className="text-black">1 Adult</option>
                  <option className="text-black">2 Adults</option>
                  <option className="text-black">Family Suite</option>
                </select>
              </div>
            </div>
            <button 
              onClick={() => handleCheckAvailability()}
              className="bg-gold text-white px-10 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-gold transition-all"
            >
              {isChecking ? 'Searching...' : 'Check Availability'}
            </button>
          </motion.div>
        </div>

        {/* Vertical Text Accent */}
        <div className="absolute right-10 bottom-20 hidden lg:block">
          <span className="vertical-text text-white/30 text-xs uppercase tracking-[1em] font-medium">Est. 2024 • Oxvera Suites</span>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000" 
              alt="Hotel Exterior" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-3xl overflow-hidden shadow-2xl hidden md:block border-8 border-luxury-cream">
            <img 
              src="https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=500" 
              alt="Spa" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="space-y-8">
          <span className="text-gold text-sm uppercase tracking-[0.4em] font-semibold">Our Story</span>
          <h2 className="text-5xl md:text-6xl leading-tight">
            A Legacy of <br />
            <span className="italic font-light">Unmatched Luxury</span>
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg font-light">
            Located in the heart of the city's most prestigious district, Oxvera Hotel and Suites offers a unique blend of contemporary design and timeless hospitality. Our mission is to provide an oasis of calm and sophistication for travelers who seek the extraordinary.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div>
              <h4 className="text-3xl font-serif text-gold mb-1">150+</h4>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Luxury Rooms</p>
            </div>
            <div>
              <h4 className="text-3xl font-serif text-gold mb-1">12</h4>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Global Awards</p>
            </div>
          </div>
          <button className="px-10 py-5 border border-gold text-gold rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-white transition-all">
            Discover More
          </button>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <span className="text-gold text-sm uppercase tracking-[0.4em] font-semibold">Accommodation</span>
              <h2 className="text-5xl md:text-6xl">Rooms & Suites</h2>
            </div>
            <p className="max-w-md text-gray-500 font-light">
              Each room is a masterpiece of design, featuring premium materials and state-of-the-art technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {ROOMS.map((room, idx) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group cursor-pointer p-4 rounded-3xl transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(197,160,89,0.15)] hover:bg-white"
                onClick={() => {
                  setSelectedRoom(room);
                  setActiveImageIdx(0);
                }}
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 relative shadow-lg">
                  <img 
                    src={room.images[0]} 
                    alt={room.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold tracking-widest">
                    From {room.price}
                  </div>
                </div>
                <h3 className="text-2xl mb-2 group-hover:text-gold transition-colors">{room.name}</h3>
                <p className="text-gray-500 text-sm font-light mb-4 line-clamp-2">{room.description}</p>
                <div className="flex gap-3">
                  {room.features.slice(0, 3).map(f => (
                    <span key={f} className="text-[9px] uppercase tracking-widest bg-luxury-cream px-2 py-1 rounded text-gray-400 font-bold">{f}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dining Section */}
      <section id="dining" className="py-32 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=500" 
                    alt="Dining 1" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1550966842-2849a2830a28?auto=format&fit=crop&q=80&w=500" 
                    alt="Dining 2" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=500" 
                    alt="Dining 3" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=500" 
                    alt="Dining 4" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <span className="text-gold text-sm uppercase tracking-[0.4em] font-semibold">Gastronomy</span>
              <h2 className="text-5xl md:text-6xl leading-tight">
                A Journey of <br />
                <span className="italic font-light">Exquisite Flavors</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg font-light">
                From intimate candlelit dinners to vibrant social gatherings, our culinary team creates unforgettable experiences using the finest seasonal ingredients.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif">The Gilded Plate</h4>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Fine Dining • 18:00 - 23:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif">Azure Lounge</h4>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Cocktails & Tapas • 12:00 - 01:00</p>
                  </div>
                </div>
              </div>
              <button className="px-10 py-5 bg-luxury-black text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all">
                Reserve a Table
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-32 bg-luxury-black text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-gold text-sm uppercase tracking-[0.4em] font-semibold">Experience</span>
              <h2 className="text-5xl md:text-6xl">World-Class <br /><span className="italic font-light">Amenities</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {AMENITIES.map((item, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gold">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-serif">{item.name}</h4>
                  <p className="text-white/50 text-sm font-light leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full border border-white/10 p-10">
              <div className="w-full h-full rounded-full overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1000" 
                  alt="Pool" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold rounded-full flex flex-col items-center justify-center text-center p-4 animate-pulse">
              <Star className="w-6 h-6 mb-2" />
              <span className="text-[10px] uppercase tracking-widest font-bold">5-Star Rated Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-luxury-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <span className="text-gold text-sm uppercase tracking-[0.4em] font-semibold mb-4 block">Guest Reviews</span>
          <h2 className="text-5xl md:text-6xl italic font-light">What they say about us</h2>
        </div>
        
        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="min-w-[400px] bg-white p-10 rounded-3xl shadow-sm inline-block whitespace-normal">
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-gold text-gold" />)}
              </div>
              <p className="text-lg italic font-serif text-gray-600 mb-8">
                "An absolutely breathtaking experience. The attention to detail and the warmth of the staff made our stay truly unforgettable. Oxvera is the new standard of luxury."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="text-left">
                  <h5 className="font-bold text-sm">Alexandra Sterling</h5>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">London, UK</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reservation Section */}
      <section id="book" className="py-32 bg-luxury-black relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Suite" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <span className="text-gold text-sm uppercase tracking-[0.4em] font-black">Reservations</span>
                <h2 className="text-6xl md:text-8xl text-white leading-[0.9] font-serif">
                  Secure Your <br />
                  <span className="italic font-light">Sanctuary</span>
                </h2>
                <p className="text-white/60 text-xl font-light max-w-md leading-relaxed">
                  Experience the pinnacle of urban luxury. Book directly with us for exclusive benefits and the best rates guaranteed.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/10">
                <div className="space-y-2">
                  <p className="text-gold text-2xl font-serif italic">Best Price</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Guaranteed</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gold text-2xl font-serif italic">Free Wifi</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">High Speed</p>
                </div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-8 relative overflow-hidden"
            >
              {isChecking && (
                <div className="absolute inset-0 z-20 bg-luxury-black/60 backdrop-blur-md flex flex-col items-center justify-center text-center p-10">
                  <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6" />
                  <h3 className="text-white text-2xl font-serif italic mb-2">Processing your request...</h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">Securing your luxury experience</p>
                </div>
              )}

              <AnimatePresence>
                {(reservationStatus === 'received' || reservationStatus === 'confirmed') && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`absolute inset-0 z-20 backdrop-blur-xl flex flex-col items-center justify-center text-center p-10 text-white ${reservationStatus === 'confirmed' ? 'bg-luxury-black/95' : 'bg-gold'}`}
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-8"
                    >
                      {reservationStatus === 'confirmed' ? (
                        <SuccessCheckmark />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                          <Mail className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </motion.div>
                    
                    <h3 className="text-4xl font-serif italic mb-4">
                      {reservationStatus === 'confirmed' ? 'Reservation Confirmed' : 'Request Received'}
                    </h3>
                    
                    <p className="text-white/90 text-sm font-light mb-10 max-w-xs mx-auto leading-relaxed">
                      {reservationStatus === 'confirmed' 
                        ? `Congratulations ${guestData.name.split(' ')[0]}! Your stay at Oxvera is officially confirmed. We've sent your final reservation details and itinerary to your email.`
                        : `Thank you ${guestData.name.split(' ')[0]}. Your reservation request is being processed. A preliminary PDF receipt has been sent to ${guestData.email}.`}
                    </p>
                    
                    <div className="flex flex-col w-full gap-4 max-w-xs">
                      <button 
                        onClick={() => setReservationStatus('idle')}
                        className={`w-full py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-black transition-all shadow-xl ${reservationStatus === 'confirmed' ? 'bg-gold text-white hover:bg-white hover:text-gold' : 'bg-white text-gold hover:bg-luxury-black hover:text-white'}`}
                      >
                        {reservationStatus === 'confirmed' ? 'Great, See You Soon' : 'Close'}
                      </button>
                      
                      <button 
                        className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest font-bold text-white/60 hover:text-white transition-colors py-2"
                        onClick={() => alert("Simulating PDF Download...")}
                      >
                        <ChevronRight className="w-3 h-3 rotate-90" /> 
                        {reservationStatus === 'confirmed' ? 'Download Final Confirmation (PDF)' : 'Download Processing Receipt (PDF)'}
                      </button>
                    </div>

                    {reservationStatus === 'received' && (
                      <div className="absolute bottom-8 left-0 w-full px-10">
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 8, ease: "linear" }}
                            className="h-full bg-white"
                          />
                        </div>
                        <p className="text-[8px] uppercase tracking-widest mt-2 text-white/40">Verifying availability...</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleReservationSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={guestData.name}
                        onChange={(e) => setGuestData({...guestData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-gold text-white text-sm transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={guestData.email}
                        onChange={(e) => setGuestData({...guestData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-gold text-white text-sm transition-all" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">Check In</label>
                      <div className="relative group">
                        <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50 group-focus-within:text-gold transition-colors" />
                        <input 
                          required
                          type="date" 
                          value={guestData.checkIn}
                          onChange={(e) => setGuestData({...guestData, checkIn: e.target.value})}
                          className="w-full bg-transparent border-b border-white/20 pl-8 py-4 focus:outline-none focus:border-gold text-white text-sm transition-all" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">Check Out</label>
                      <div className="relative group">
                        <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50 group-focus-within:text-gold transition-colors" />
                        <input 
                          required
                          type="date" 
                          value={guestData.checkOut}
                          onChange={(e) => setGuestData({...guestData, checkOut: e.target.value})}
                          className="w-full bg-transparent border-b border-white/20 pl-8 py-4 focus:outline-none focus:border-gold text-white text-sm transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">Guests</label>
                      <div className="relative group">
                        <Users className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50 group-focus-within:text-gold transition-colors" />
                        <select 
                          value={guestData.guests}
                          onChange={(e) => setGuestData({...guestData, guests: e.target.value})}
                          className="w-full bg-transparent border-b border-white/20 pl-8 py-4 focus:outline-none focus:border-gold text-white text-sm appearance-none cursor-pointer"
                        >
                          <option className="bg-luxury-black">1 Adult</option>
                          <option className="bg-luxury-black">2 Adults</option>
                          <option className="bg-luxury-black">Family Suite</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">Room Type</label>
                      <select 
                        value={preSelectedRoom}
                        onChange={(e) => setPreSelectedRoom(e.target.value)}
                        className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-gold text-white text-sm appearance-none cursor-pointer"
                      >
                        <option className="bg-luxury-black" value="Any Available">Any Available</option>
                        <option className="bg-luxury-black" value="Presidential Suite">Presidential Suite</option>
                        <option className="bg-luxury-black" value="Executive Deluxe">Executive Deluxe</option>
                        <option className="bg-luxury-black" value="Classic Heritage Room">Classic Heritage Room</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full py-6 bg-gold text-white rounded-2xl text-[10px] uppercase tracking-[0.4em] font-black hover:bg-white hover:text-gold transition-all shadow-2xl shadow-gold/20 flex items-center justify-center gap-4 group"
                  >
                    Confirm Reservation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <p className="text-center text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold">
                  * Best Rate Guarantee • Secure Payment • Instant Confirmation
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-gold text-sm uppercase tracking-[0.4em] font-black">Get in Touch</span>
                <h2 className="text-5xl md:text-7xl font-serif">Contact <br /><span className="italic font-light">Oxvera</span></h2>
                <p className="text-gray-500 text-lg font-light max-w-md leading-relaxed">
                  Have a question or special request? Our dedicated concierge team is available 24/7 to assist you.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif mb-1">Our Location</h4>
                    <p className="text-gray-400 text-sm">123 Luxury Avenue, Elite District, City</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif mb-1">Phone Number</h4>
                    <p className="text-gray-400 text-sm">+1 (234) 567-8900</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif mb-1">Email Address</h4>
                    <p className="text-gray-400 text-sm">reservations@oxvera.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_50px_100px_rgba(0,0,0,0.05)] relative overflow-hidden border border-gray-50">
              <AnimatePresence>
                {contactStatus === 'Thank you for contacting us. We will get back to you shortly.' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center p-10"
                  >
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12 }}
                      >
                        <Star className="w-10 h-10 text-gold" />
                      </motion.div>
                    </div>
                    <h3 className="text-3xl font-serif italic mb-4 text-luxury-black">Message Sent</h3>
                    <p className="text-gray-500 text-sm font-light mb-8 max-w-xs mx-auto leading-relaxed">
                      Your inquiry has been received. Our concierge team will review your message and respond within 24 hours.
                    </p>
                    <button 
                      onClick={() => setContactStatus(null)}
                      className="px-10 py-4 bg-luxury-black text-white rounded-full text-[10px] uppercase tracking-[0.3em] font-black hover:bg-gold transition-all shadow-lg"
                    >
                      Return to Form
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleContactSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">Your Name</label>
                    <input 
                      required
                      type="text" 
                      value={contactData.name}
                      onChange={(e) => setContactData({...contactData, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full bg-transparent border-b border-gray-100 py-4 focus:outline-none focus:border-gold text-sm transition-all placeholder:text-gray-200" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={contactData.email}
                      onChange={(e) => setContactData({...contactData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full bg-transparent border-b border-gray-100 py-4 focus:outline-none focus:border-gold text-sm transition-all placeholder:text-gray-200" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">Subject</label>
                  <input 
                    required
                    type="text" 
                    value={contactData.subject}
                    onChange={(e) => setContactData({...contactData, subject: e.target.value})}
                    placeholder="Inquiry about..."
                    className="w-full bg-transparent border-b border-gray-100 py-4 focus:outline-none focus:border-gold text-sm transition-all placeholder:text-gray-200" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={contactData.message}
                    onChange={(e) => setContactData({...contactData, message: e.target.value})}
                    placeholder="How can we help you?"
                    className="w-full bg-transparent border-b border-gray-100 py-4 focus:outline-none focus:border-gold text-sm transition-all resize-none placeholder:text-gray-200" 
                  />
                </div>
                <button 
                  type="submit"
                  disabled={contactStatus === 'Sending...'}
                  className="w-full py-6 bg-luxury-black text-white rounded-2xl text-[10px] uppercase tracking-[0.4em] font-black hover:bg-gold transition-all shadow-xl flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactStatus === 'Sending...' ? 'Sending Inquiry...' : 'Send Message'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                {contactStatus && contactStatus !== 'Sending...' && contactStatus !== 'Thank you for contacting us. We will get back to you shortly.' && (
                  <p className="text-center text-xs text-red-500 font-bold">{contactStatus}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-black text-white pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 border border-gold/30 rounded-full rotate-45" />
                <div className="absolute inset-0 border border-gold/30 rounded-full -rotate-45" />
                <span className="text-2xl font-serif text-gold font-bold italic z-10">O</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif tracking-[0.2em] uppercase leading-none text-white">Oxvera</span>
                <span className="text-[8px] uppercase tracking-[0.4em] mt-1 text-white/50">Hotel & Suites</span>
              </div>
            </div>
            <p className="text-white/50 text-sm font-light leading-relaxed">
              Crafting moments of pure elegance and sophisticated comfort in the heart of the city.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold transition-colors"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-lg font-serif tracking-widest uppercase">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/50 font-light">
              <li><a href="#" className="hover:text-gold transition-colors">Our Rooms</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Special Offers</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Dining & Bar</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Wellness & Spa</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-lg font-serif tracking-widest uppercase">Contact Us</h4>
            <ul className="space-y-4 text-sm text-white/50 font-light">
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-gold shrink-0" /> 123 Luxury Avenue, Elite District, City</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-gold shrink-0" /> +1 (234) 567-8900</li>
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-gold shrink-0" /> reservations@oxvera.com</li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-lg font-serif tracking-widest uppercase">Newsletter</h4>
            <p className="text-white/50 text-sm font-light">Subscribe to receive exclusive offers and news.</p>
            <div className="flex">
              <input type="email" placeholder="Your Email" className="bg-white/5 border border-white/10 px-4 py-3 rounded-l-lg focus:outline-none focus:border-gold w-full text-sm" />
              <button className="bg-gold px-6 py-3 rounded-r-lg hover:bg-white hover:text-gold transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
          <p>© 2024 Oxvera Hotel and Suites. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Custom Styles for Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
          width: fit-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
