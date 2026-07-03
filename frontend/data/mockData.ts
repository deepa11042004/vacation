export interface AllDestinationItem {
  id: number;
  location: string;
  title: string;
  description: string;
  image: string;
  category: "national" | "international";
}

export const AllDestinationList: AllDestinationItem[] = [
  // National Experiences
  {
    id: 1,
    location: "Ranthambore, Rajasthan, India",
    title: "Aman-i-Khas",
    description:
      "Experience the raw wilderness of Ranthambore National Park in ultimate luxury, featuring air-conditioned tents and guided safari excursions.",
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format&fit=crop&q=80",
    category: "national",
  },
  {
    id: 2,
    location: "Udaipur, Rajasthan, India",
    title: "Taj Lake Palace",
    description:
      "A majestic 18th-century palace floating on Lake Pichola, offering legendary hospitality and unparalleled romantic views of the City Palace.",
    image:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
    category: "national",
  },
  {
    id: 3,
    location: "Agra, Uttar Pradesh, India",
    title: "The Oberoi Amarvilas",
    description:
      "Wake up to breathtaking, uninterrupted views of the Taj Mahal from your private balcony, wrapped in Moorish and Mughal architectural luxury.",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
    category: "national",
  },
  {
    id: 4,
    location: "Kabini, Karnataka, India",
    title: "Evolve Back",
    description:
      "Inspired by local Kuruba tribal design, this safari resort offers a sweeping view of the Kabini River and unparalleled wildlife sightings in the wild.",
    image:
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&auto=format&fit=crop&q=80",
    category: "national",
  },
  {
    id: 5,
    location: "Kumarakom, Kerala, India",
    title: "Kumarakom Lake Resort",
    description:
      "Reconnect with nature along the pristine backwaters of Kerala, featuring luxury heritage villas reconstructed from traditional ancestral homes.",
    image:
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80",
    category: "national",
  },
  {
    id: 6,
    location: "Shimla, Himachal Pradesh, India",
    title: "Wildflower Hall",
    description:
      "Located 8,250 feet above sea level in the Himalayas, experience pristine mountain air, pine forests, and an outdoor heated whirlpool with panoramic valley views.",
    image:
      "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?w=800&auto=format&fit=crop&q=80",
    category: "national",
  },

  // International Experiences
  {
    id: 7,
    location: "Noonu Atoll, Maldives",
    title: "Soneva Jani",
    description:
      "A sanctuary of overwater villas with retractable roofs to stargaze from bed and private water slides into the turquoise lagoon.",
    image:
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop&q=80",
    category: "international",
  },
  {
    id: 8,
    location: "Canyon Point, Utah, USA",
    title: "Amangiri",
    description:
      "Tucked into a protected valley in the American Southwest, this modernist oasis blends seamlessly with the red-rock desert landscape.",
    image:
      "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=800&auto=format&fit=crop&q=80",
    category: "international",
  },
  {
    id: 9,
    location: "Lake Como, Italy",
    title: "Villa d'Este",
    description:
      "A legendary hotel of timeless elegance, surrounded by 25 acres of manicured gardens, overlooking the serene waters of Lake Como.",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80",
    category: "international",
  },
  {
    id: 10,
    location: "Kyoto, Japan",
    title: "Hoshinoya Kyoto",
    description:
      "Accessible by a tranquil boat ride down the Oi River, this historic riverside ryokan offers a perfect blend of Japanese tradition and modern luxury.",
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
    category: "international",
  },
  {
    id: 11,
    location: "Sabi Sand, South Africa",
    title: "Singita Boulders Lodge",
    description:
      "An organic masterpiece resting along the banks of the Sand River, providing front-row seats to frequent big game sightings in the bush.",
    image:
      "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&auto=format&fit=crop&q=80",
    category: "international",
  },
  {
    id: 12,
    location: "Santorini, Greece",
    title: "Canaves Oia Suites",
    description:
      "Carved into the volcanic cliffside, enjoy panoramic vistas of the Aegean Sea and the caldera from your private infinity plunge pool.",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80",
    category: "international",
  },
];

export interface AllHotelsItem {
  id: number;
  location: string;
  title: string;
  description: string;
  image: string;
  category: "associated" | "internal";
}

export const AllHotelsList: AllHotelsItem[] = [
  // Associated Hotels
  {
    id: 1,
    location: "Ranthambore, Rajasthan, India",
    title: "Aman-i-Khas",
    description:
      "Experience the raw wilderness of Ranthambore National Park in ultimate luxury, featuring air-conditioned tents and guided safari excursions.",
    image:
      "https://images.pexels.com/photos/30791068/pexels-photo-30791068.jpeg",
    category: "associated",
  },
  {
    id: 2,
    location: "Udaipur, Rajasthan, India",
    title: "Taj Lake Palace",
    description:
      "A majestic 18th-century palace floating on Lake Pichola, offering legendary hospitality and unparalleled romantic views of the City Palace.",
    image:
      "https://images.pexels.com/photos/33243028/pexels-photo-33243028.jpeg",
    category: "associated",
  },
  {
    id: 3,
    location: "Agra, Uttar Pradesh, India",
    title: "The Oberoi Amarvilas",
    description:
      "Wake up to breathtaking, uninterrupted views of the Taj Mahal from your private balcony, wrapped in Moorish and Mughal architectural luxury.",
    image:
      "https://images.pexels.com/photos/37680039/pexels-photo-37680039.jpeg",
    category: "associated",
  },
  {
    id: 4,
    location: "Kabini, Karnataka, India",
    title: "Evolve Back",
    description:
      "Inspired by local Kuruba tribal design, this safari resort offers a sweeping view of the Kabini River and unparalleled wildlife sightings in the wild.",
    image:
      "https://images.pexels.com/photos/34909119/pexels-photo-34909119.jpeg",
    category: "associated",
  },
  {
    id: 5,
    location: "Kumarakom, Kerala, India",
    title: "Kumarakom Lake Resort",
    description:
      "Reconnect with nature along the pristine backwaters of Kerala, featuring luxury heritage villas reconstructed from traditional ancestral homes.",
    image:
      "https://images.pexels.com/photos/10135346/pexels-photo-10135346.jpeg",
    category: "associated",
  },
  {
    id: 6,
    location: "Shimla, Himachal Pradesh, India",
    title: "Wildflower Hall",
    description:
      "Located 8,250 feet above sea level in the Himalayas, experience pristine mountain air, pine forests, and an outdoor heated whirlpool with panoramic valley views.",
    image:
      "https://images.pexels.com/photos/27555453/pexels-photo-27555453.jpeg",
    category: "associated",
  },

  // Internal Hotels
  {
    id: 7,
    location: "Noonu Atoll, Maldives",
    title: "Soneva Jani",
    description:
      "A sanctuary of overwater villas with retractable roofs to stargaze from bed and private water slides into the turquoise lagoon.",
    image:
      "https://images.pexels.com/photos/32457946/pexels-photo-32457946.jpeg",
    category: "internal",
  },
  {
    id: 8,
    location: "Canyon Point, Utah, USA",
    title: "Amangiri",
    description:
      "Tucked into a protected valley in the American Southwest, this modernist oasis blends seamlessly with the red-rock desert landscape.",
    image:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    category: "internal",
  },
  {
    id: 9,
    location: "Lake Como, Italy",
    title: "Villa d'Este",
    description:
      "A legendary hotel of timeless elegance, surrounded by 25 acres of manicured gardens, overlooking the serene waters of Lake Como.",
    image:
      "https://images.pexels.com/photos/6836380/pexels-photo-6836380.jpeg",
    category: "internal",
  },
  {
    id: 10,
    location: "Kyoto, Japan",
    title: "Hoshinoya Kyoto",
    description:
      "Accessible by a tranquil boat ride down the Oi River, this historic riverside ryokan offers a perfect blend of Japanese tradition and modern luxury.",
    image:
      "https://images.pexels.com/photos/37331182/pexels-photo-37331182.jpeg",
    category: "internal",
  },
  {
    id: 11,
    location: "Sabi Sand, South Africa",
    title: "Singita Boulders Lodge",
    description:
      "An organic masterpiece resting along the banks of the Sand River, providing front-row seats to frequent big game sightings in the bush.",
    image:
      "https://images.pexels.com/photos/3011575/pexels-photo-3011575.jpeg",
    category: "internal",
  },
  {
    id: 12,
    location: "Santorini, Greece",
    title: "Canaves Oia Suites",
    description:
      "Carved into the volcanic cliffside, enjoy panoramic vistas of the Aegean Sea and the caldera from your private infinity plunge pool.",
    image:
      "https://images.pexels.com/photos/3460597/pexels-photo-3460597.jpeg",
    category: "internal",
  },
];
