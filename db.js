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
    portrait: "/assets/ansh_1.jpg?v=2",
    stats: [
      { label: "Months Learning", value: "6+" },
      { label: "Photos Taken", value: "2K+" },
      { label: "Cups of Coffee", value: "150+" },
      { label: "New Techniques", value: "Countless" }
    ]
  },

  // ── Photo Categories ──────────────────────────────────────
  categories: ["All", "Portraits", "Landscapes", "Street", "Events", "Wildlife"],

  // ── Photo & Video Gallery ──────────────────────────────────
  // Each item: { id, src, thumb, title, category, description, featured, media_type, media_items }
  photos: [
    {
      id: 1,
      src: "https://picsum.photos/seed/port1/800/1200",
      thumb: "https://picsum.photos/seed/port1/400/600",
      title: "Golden Hour Portrait Series",
      category: "Portraits",
      description: "Natural light portrait set captured during the magic hour with warm amber tones.",
      featured: true,
      media_type: "image",
      media_items: [
        { url: "https://picsum.photos/seed/port1/800/1200", media_type: "image" },
        { url: "https://picsum.photos/seed/port1b/800/1200", media_type: "image" },
        { url: "https://picsum.photos/seed/port1c/800/1200", media_type: "image" }
      ]
    },
    {
      id: 2,
      src: "https://picsum.photos/seed/land1/1200/800",
      thumb: "https://picsum.photos/seed/land1/600/400",
      title: "Misty Mountains Landscape",
      category: "Landscapes",
      description: "Early morning mist rolling through the valley.",
      featured: true,
      media_type: "image",
      media_items: [
        { url: "https://picsum.photos/seed/land1/1200/800", media_type: "image" },
        { url: "https://picsum.photos/seed/land1b/1200/800", media_type: "image" }
      ]
    },
    {
      id: 3,
      src: "https://picsum.photos/seed/street1/800/1000",
      thumb: "https://picsum.photos/seed/street1/400/500",
      title: "Cinematic City Vibes",
      category: "Street",
      description: "Atmospheric street video and stills showcasing neon reflections.",
      featured: false,
      media_type: "video",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      media_items: [
        { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", media_type: "video", poster: "https://picsum.photos/seed/street1/800/1000" },
        { url: "https://picsum.photos/seed/street1/800/1000", media_type: "image" },
        { url: "https://picsum.photos/seed/street1b/800/1000", media_type: "image" }
      ]
    },
    {
      id: 4,
      src: "https://picsum.photos/seed/event1/1200/800",
      thumb: "https://picsum.photos/seed/event1/600/400",
      title: "Wedding Bliss Carousel",
      category: "Events",
      description: "Candid moments of joy, emotion, and celebration during the ceremony.",
      featured: true,
      media_type: "image",
      media_items: [
        { url: "https://picsum.photos/seed/event1/1200/800", media_type: "image" },
        { url: "https://picsum.photos/seed/event1b/1200/800", media_type: "image" },
        { url: "https://picsum.photos/seed/event1c/1200/800", media_type: "image" },
        { url: "https://picsum.photos/seed/event1d/1200/800", media_type: "image" }
      ]
    },
    {
      id: 5,
      src: "https://picsum.photos/seed/wild1/1000/800",
      thumb: "https://picsum.photos/seed/wild1/500/400",
      title: "Majestic Eagle in Flight",
      category: "Wildlife",
      description: "Bald eagle soaring above the river in crisp detail.",
      featured: false,
      media_type: "image",
      media_items: [
        { url: "https://picsum.photos/seed/wild1/1000/800", media_type: "image" }
      ]
    },
    {
      id: 6,
      src: "https://picsum.photos/seed/port2/800/1100",
      thumb: "https://picsum.photos/seed/port2/400/550",
      title: "Studio Lighting Showcase",
      category: "Portraits",
      description: "Behind the scenes video & high-fashion studio portraits.",
      featured: false,
      media_type: "video",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      media_items: [
        { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", media_type: "video", poster: "https://picsum.photos/seed/port2/800/1100" },
        { url: "https://picsum.photos/seed/port2/800/1100", media_type: "image" }
      ]
    },
    {
      id: 7,
      src: "https://picsum.photos/seed/land2/1200/800",
      thumb: "https://picsum.photos/seed/land2/600/400",
      title: "Autumn Forest Collection",
      category: "Landscapes",
      description: "Fall colors blanketing the hillside in rich ochre and scarlet.",
      featured: true,
      media_type: "image",
      media_items: [
        { url: "https://picsum.photos/seed/land2/1200/800", media_type: "image" },
        { url: "https://picsum.photos/seed/land2b/1200/800", media_type: "image" }
      ]
    },
    {
      id: 8,
      src: "https://picsum.photos/seed/street2/800/1200",
      thumb: "https://picsum.photos/seed/street2/400/600",
      title: "Rainy Alley Reflections",
      category: "Street",
      description: "Reflections on wet cobblestone streets under umbrella canopies.",
      featured: false,
      media_type: "image",
      media_items: [
        { url: "https://picsum.photos/seed/street2/800/1200", media_type: "image" }
      ]
    },
    {
      id: 9,
      src: "https://picsum.photos/seed/event2/1000/800",
      thumb: "https://picsum.photos/seed/event2/500/400",
      title: "Live Concert Momentum",
      category: "Events",
      description: "Live concert performance captured in motion with crowd energy.",
      featured: false,
      media_type: "image",
      media_items: [
        { url: "https://picsum.photos/seed/event2/1000/800", media_type: "image" },
        { url: "https://picsum.photos/seed/event2b/1000/800", media_type: "image" }
      ]
    },
    {
      id: 10,
      src: "https://picsum.photos/seed/wild2/1200/900",
      thumb: "https://picsum.photos/seed/wild2/600/450",
      title: "Deer at Dawn",
      category: "Wildlife",
      description: "A deer pausing in the early morning amber light.",
      featured: true,
      media_type: "image",
      media_items: [
        { url: "https://picsum.photos/seed/wild2/1200/900", media_type: "image" }
      ]
    },
    {
      id: 11,
      src: "https://picsum.photos/seed/port3/800/1000",
      thumb: "https://picsum.photos/seed/port3/400/500",
      title: "Candid Emotion Series",
      category: "Portraits",
      description: "An unposed, genuine sequence of happiness.",
      featured: false,
      media_type: "image",
      media_items: [
        { url: "https://picsum.photos/seed/port3/800/1000", media_type: "image" },
        { url: "https://picsum.photos/seed/port3b/800/1000", media_type: "image" },
        { url: "https://picsum.photos/seed/port3c/800/1000", media_type: "image" }
      ]
    },
    {
      id: 12,
      src: "https://picsum.photos/seed/land3/1200/800",
      thumb: "https://picsum.photos/seed/land3/600/400",
      title: "Ocean Sunset Horizon",
      category: "Landscapes",
      description: "The sun melting into the Pacific horizon with pastel skies.",
      featured: false,
      media_type: "image",
      media_items: [
        { url: "https://picsum.photos/seed/land3/1200/800", media_type: "image" }
      ]
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
    email: "lowanshiansh@gmail.com",
    phone: "+91 7828479491",
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
