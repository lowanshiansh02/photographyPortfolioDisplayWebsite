// ============================================================
// db.js — Mock Database Layer
// Replace this file with real API calls when ready.
// All UI code imports from here, so swapping is seamless.
// ============================================================

const DB = {
  // ── Photographer Profile ──────────────────────────────────
  profile: {
    name: "Ansh",
    tagline: "Capturing Moments, Creating Memories",
    heroSubtitle: "A passionate photographer exploring portraits, landscapes & everyday moments.",
    bio: `Photography is my way of capturing the beauty of everyday life and freezing fleeting moments in time. 
Whether it's the golden-hour glow of a quiet landscape or the raw emotion of a candid portrait, 
I am constantly exploring new ways to tell visual stories. Every photograph reflects a unique perspective, 
and this portfolio is my dedicated space to share how I see the world with you.`,
    portrait: "https://picsum.photos/seed/photographer/600/750",
    stats: [
      { label: "Months Learning", value: "6+" },
      { label: "Photos Taken", value: "2K+" },
      { label: "Cups of Coffee", value: "150+" },
      { label: "New Techniques", value: "Countless" }
    ]
  },

  // ── Photo Categories ──────────────────────────────────────
  categories: ["All", "Portraits", "Landscapes", "Street", "Events", "Wildlife"],

  // ── Photo Gallery ─────────────────────────────────────────
  // Each photo: { id, src, title, category, description, featured }
  photos: [
    {
      id: 1,
      src: "https://picsum.photos/seed/port1/800/1200",
      thumb: "https://picsum.photos/seed/port1/400/600",
      title: "Golden Hour Portrait",
      category: "Portraits",
      description: "Natural light portrait during the magic hour.",
      featured: true
    },
    {
      id: 2,
      src: "https://picsum.photos/seed/land1/1200/800",
      thumb: "https://picsum.photos/seed/land1/600/400",
      title: "Misty Mountains",
      category: "Landscapes",
      description: "Early morning mist rolling through the valley.",
      featured: true
    },
    {
      id: 3,
      src: "https://picsum.photos/seed/street1/800/1000",
      thumb: "https://picsum.photos/seed/street1/400/500",
      title: "City Lights",
      category: "Street",
      description: "Urban nightscape with neon reflections.",
      featured: false
    },
    {
      id: 4,
      src: "https://picsum.photos/seed/event1/1200/800",
      thumb: "https://picsum.photos/seed/event1/600/400",
      title: "Wedding Bliss",
      category: "Events",
      description: "A candid moment of joy during the ceremony.",
      featured: true
    },
    {
      id: 5,
      src: "https://picsum.photos/seed/wild1/1000/800",
      thumb: "https://picsum.photos/seed/wild1/500/400",
      title: "Majestic Eagle",
      category: "Wildlife",
      description: "Bald eagle soaring above the river.",
      featured: false
    },
    {
      id: 6,
      src: "https://picsum.photos/seed/port2/800/1100",
      thumb: "https://picsum.photos/seed/port2/400/550",
      title: "Studio Elegance",
      category: "Portraits",
      description: "Dramatic studio lighting with a classic feel.",
      featured: false
    },
    {
      id: 7,
      src: "https://picsum.photos/seed/land2/1200/800",
      thumb: "https://picsum.photos/seed/land2/600/400",
      title: "Autumn Forest",
      category: "Landscapes",
      description: "Fall colors blanketing the hillside.",
      featured: true
    },
    {
      id: 8,
      src: "https://picsum.photos/seed/street2/800/1200",
      thumb: "https://picsum.photos/seed/street2/400/600",
      title: "Rainy Alley",
      category: "Street",
      description: "Reflections on wet cobblestone streets.",
      featured: false
    },
    {
      id: 9,
      src: "https://picsum.photos/seed/event2/1000/800",
      thumb: "https://picsum.photos/seed/event2/500/400",
      title: "Concert Energy",
      category: "Events",
      description: "Live music performance captured in motion.",
      featured: false
    },
    {
      id: 10,
      src: "https://picsum.photos/seed/wild2/1200/900",
      thumb: "https://picsum.photos/seed/wild2/600/450",
      title: "Deer at Dawn",
      category: "Wildlife",
      description: "A deer pausing in the early morning light.",
      featured: true
    },
    {
      id: 11,
      src: "https://picsum.photos/seed/port3/800/1000",
      thumb: "https://picsum.photos/seed/port3/400/500",
      title: "Candid Smile",
      category: "Portraits",
      description: "An unposed, genuine moment of happiness.",
      featured: false
    },
    {
      id: 12,
      src: "https://picsum.photos/seed/land3/1200/800",
      thumb: "https://picsum.photos/seed/land3/600/400",
      title: "Ocean Sunset",
      category: "Landscapes",
      description: "The sun melting into the Pacific horizon.",
      featured: false
    },
    {
      id: 13,
      src: "https://picsum.photos/seed/street3/900/1200",
      thumb: "https://picsum.photos/seed/street3/450/600",
      title: "Morning Commute",
      category: "Street",
      description: "Rush hour captured in long exposure.",
      featured: true
    },
    {
      id: 14,
      src: "https://picsum.photos/seed/wild3/1100/800",
      thumb: "https://picsum.photos/seed/wild3/550/400",
      title: "Fox in Snow",
      category: "Wildlife",
      description: "A red fox against a pristine white backdrop.",
      featured: false
    },
    {
      id: 15,
      src: "https://picsum.photos/seed/event3/1200/800",
      thumb: "https://picsum.photos/seed/event3/600/400",
      title: "Birthday Celebration",
      category: "Events",
      description: "Pure joy in every frame of the celebration.",
      featured: false
    },
    {
      id: 16,
      src: "https://picsum.photos/seed/port4/800/1100",
      thumb: "https://picsum.photos/seed/port4/400/550",
      title: "Silhouette",
      category: "Portraits",
      description: "A powerful silhouette against the sunset.",
      featured: false
    }
  ],

  // ── Testimonials ──────────────────────────────────────────
  testimonials: [
    {
      id: 1,
      name: "Ananya Sharma",
      role: "Long-time Friend",
      avatar: "https://picsum.photos/seed/client1/100/100",
      text: "Ansh has been photographing our friend group for years. I am so thrilled she is finally sharing her beautiful perspective with the rest of the world!",
      rating: 5
    },
    {
      id: 2,
      name: "Rahul Mehta",
      role: "First Official Client",
      avatar: "https://picsum.photos/seed/client2/100/100",
      text: "I've always admired Ansh's secret archives. When she finally agreed to shoot my portraits, the results were as stunning as I always knew they'd be.",
      rating: 5
    },
    {
      id: 3,
      name: "Priya Kapoor",
      role: "Fellow Artist",
      avatar: "https://picsum.photos/seed/client3/100/100",
      text: "She genuinely has an eye for finding unique angles and lighting. It's about time these captures made it out of the hard drive and into a gallery!",
      rating: 5
    }
  ],

  // ── Services ──────────────────────────────────────────────
  services: [
    {
      icon: "🖼️",
      title: "Fine Art Prints",
      description: "Carefully selected captures from my archive, now available as high-quality prints for your space."
    },
    {
      icon: "📸",
      title: "Portrait Sessions",
      description: "Now accepting bookings to bring my years of candid and natural-light experience to your portraits."
    },
    {
      icon: "🌿",
      title: "Nature & Landscape",
      description: "Continuing to explore the outdoors and capturing the quiet, beautiful moments of nature."
    },
    {
      icon: "🤝",
      title: "Collaborations",
      description: "Always open to collaborating with other creatives to experiment with new visual stories."
    }
  ],

  // ── Contact Info ──────────────────────────────────────────
  contact: {
    email: "hello@anshphotography.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    socials: {
      instagram: "#",
      facebook: "#",
      twitter: "#",
      pinterest: "#"
    }
  },

  // ── Navigation Links ──────────────────────────────────────
  navLinks: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Services", href: "#services" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" }
  ]
};
