export interface CoffeeType {
  name: string;
  grade: string;
  process: string;
  notes: string[];
  description: string;
  accentColor: string;
  juteBagImage: string;
  gradientTheme: string;
  glowColor: string;
  // Aurora mesh gradient — 3 colors derived from tasting notes
  gradientColors: [string, string, string];
  bgRight: string;
  // Watercolor flavor illustration
  flavorImage: string;
  // Scatter image for the right panel
  scatterImage?: string;
}

export const COFFEE_DATA: CoffeeType[] = [
  {
    name: "Sidamo Nensebo Refisa",
    grade: "Grade 1",
    process: "Washed",
    notes: ["Floral", "Citrus", "Honey"],
    description:
      "Exquisite washed coffee from the Nensebo woreda in West Arsi, known for its high altitude and complex floral notes.",
    accentColor: "#D4AF37",
    juteBagImage: "/assets/coffees/jute-bag-sidamo.png",
    gradientTheme: "from-[#F9E8D0] to-[#E6C9A8]",
    glowColor: "rgba(212, 175, 55, 0.4)",
    // Floral → soft lilac, Citrus → tangerine, Honey → golden amber
    gradientColors: ["#B8A0D2", "#E89830", "#C8960A"],
    bgRight: "#FDF5E6",
    flavorImage: "/images/flavors/sidamo-notes.png",
  },
  {
    name: "Guji Guduba Wet Mill",
    grade: "Grade 1",
    process: "Washed",
    notes: ["Jasmine", "Lemon", "Bergamot"],
    description:
      "Located in the heart of Hambella, Guduba station produces classic Guji profiles with intense aromatics.",
    accentColor: "#F59E0B",
    juteBagImage: "/assets/coffees/jute-bag-guji-guduba.png",
    gradientTheme: "from-[#FDE68A] to-[#FCD34D]",
    glowColor: "rgba(245, 158, 11, 0.4)",
    // Jasmine → warm ivory, Lemon → bright citrus, Bergamot → olive citrus
    gradientColors: ["#E8D5A8", "#E8C820", "#7A8530"],
    bgRight: "#FEFCE8",
    flavorImage: "/images/flavors/guji-guduba-notes.png",
  },
  {
    name: "Guji Gotae Sodu",
    grade: "Grade 1",
    process: "Washed",
    notes: ["Peach", "Black Tea", "Floral"],
    description:
      "A standout micro-lot from the Gotae Sodu kebele, offering exceptional clarity and sweetness.",
    accentColor: "#10B981",
    juteBagImage: "/assets/coffees/jute-bag-guji-gotae.png",
    gradientTheme: "from-[#D1FAE5] to-[#6EE7B7]",
    glowColor: "rgba(16, 185, 129, 0.4)",
    // Peach → warm peach, Black Tea → rich amber-brown, Floral → dusty rose
    gradientColors: ["#F0A878", "#5C3A1E", "#C89098"],
    bgRight: "#FFF0E6",
    flavorImage: "/images/flavors/guji-gotae-notes.png",
  },
  {
    name: "Guji Haro Sorsa",
    grade: "Grade 1",
    process: "Washed",
    notes: ["Apricot", "Jasmine", "Sugar Cane"],
    description:
      "From the renowned deep red soils of Haro Sorsa, processed at the Sisay washing station.",
    accentColor: "#8B5CF6",
    juteBagImage: "/assets/coffees/jute-bag-guji-haro.png",
    gradientTheme: "from-[#DDD6FE] to-[#C4B5FD]",
    glowColor: "rgba(139, 92, 246, 0.4)",
    // Apricot → warm apricot, Jasmine → soft cream, Sugar Cane → golden-green
    gradientColors: ["#E89050", "#F0E0C0", "#A0A850"],
    bgRight: "#FFF3E0",
    flavorImage: "/images/flavors/guji-haro-notes.png",
  },
  {
    name: "Yirgacheffe Banko Gotiti",
    grade: "Grade 1",
    process: "Natural",
    notes: ["Blueberry", "Strawberry", "Milk Chocolate"],
    description:
      "Classic Gedeb natural with intense berry notes and a creamy body.",
    accentColor: "#F43F5E",
    juteBagImage: "/assets/coffees/jute-bag-yirgacheffe-banko.png",
    gradientTheme: "from-[#FECDD3] to-[#FDA4AF]",
    glowColor: "rgba(244, 63, 94, 0.4)",
    // Blueberry → rich berry purple, Strawberry → warm strawberry, Milk Chocolate → creamy choc brown
    gradientColors: ["#6B4D8A", "#C04058", "#8B6848"],
    bgRight: "#FFF0F0",
    flavorImage: "/images/flavors/yirga-banko-notes.png",
  },
  {
    name: "Yirgacheffe Wurae",
    grade: "Grade 1",
    process: "Natural",
    notes: ["Tropical Fruit", "Winey", "Dried Fig"],
    description:
      "Complex and winey natural processed coffee from the Halo Berti kebele.",
    accentColor: "#B45309",
    juteBagImage: "/assets/coffees/jute-bag-yirgacheffe-wurae.png",
    gradientTheme: "from-[#FDE68A] to-[#F59E0B]",
    glowColor: "rgba(180, 83, 9, 0.4)",
    // Tropical → mango gold, Winey → wine red, Dried Fig → warm plum
    gradientColors: ["#D8A020", "#804050", "#6A4050"],
    bgRight: "#FFF8E7",
    flavorImage: "/images/flavors/yirga-wurae-notes.png",
  },
  {
    name: "Jimma Agaro Genji Challa",
    grade: "Grade 1",
    process: "Natural",
    notes: ["Stone Fruit", "Spices", "Honey"],
    description:
      "Known for its clean cup and distinct spicy notes, Agaro coffees are gaining rapid recognition.",
    accentColor: "#059669",
    juteBagImage: "/assets/coffees/jute-bag-jimma-agaro.png",
    gradientTheme: "from-[#D1FAE5] to-[#34D399]",
    glowColor: "rgba(5, 150, 105, 0.4)",
    // Stone Fruit → peach-apricot, Spices → warm cinnamon, Honey → golden amber
    gradientColors: ["#D88858", "#8A4818", "#C89820"],
    bgRight: "#FFF8EE",
    flavorImage: "/images/flavors/jimma-agaro-notes.png",
  },
];
