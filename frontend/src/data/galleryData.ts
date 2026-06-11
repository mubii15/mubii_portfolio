export interface GalleryItem {
  id: string;
  name: string;
  subtitle: string;
  category: "PHOTOGRAPHY" | "CINEMATOGRAPHY" | "VFX" | "COLOR GRADING" | "CONTEMPORARY ART";
  image: string;
  large?: boolean; 
  type: "project" | "single";
  date: string;
  description: string;
  additionalImages?: string[];
}

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: "1",
    name: "URBAN SOLITUDE",
    subtitle: "STREET SERIES",
    category: "PHOTOGRAPHY",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80",
    type: "single",
    date: "MAR 2024",
    description: "A study of quiet moments in the heart of London.",
  },
  {
    id: "2",
    name: "JOSHUA DIAZ",
    subtitle: "PORTRAIT SERIES",
    category: "CONTEMPORARY ART",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
    type: "project",
    date: "FEB 2024",
    description: "An experimental portrait project exploring identity.",
    additionalImages: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    ]
  },
  {
    id: "3",
    name: "NEON NIGHTS",
    subtitle: "CINEMATIC SERIES",
    category: "CINEMATOGRAPHY",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    type: "single",
    date: "JAN 2024",
    description: "Capturing the electric atmosphere of night cityscapes.",
  },
  {
    id: "4",
    name: "CHROME DREAMS",
    subtitle: "VFX PROJECT",
    category: "VFX",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    type: "project",
    date: "DEC 2023",
    description: "Advanced look development for reflective surfaces.",
    additionalImages: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1521119966571-6100a7194851?w=800&q=80",
    ]
  },
  {
    id: "5",
    name: "GASPAR ZALDO",
    subtitle: "PHOTOGRAPHER",
    category: "PHOTOGRAPHY",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    large: true,
    type: "single",
    date: "NOV 2023",
    description: "A minimalist portrait of a photographer in his element.",
  },
  {
    id: "6",
    name: "SABRINA TAMX",
    subtitle: "PAINTER",
    category: "CONTEMPORARY ART",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    large: true,
    type: "project",
    date: "OCT 2023",
    description: "Following the process of an artist in real-time.",
    additionalImages: [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80",
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&q=80",
    ]
  },
  {
    id: "7",
    name: "VELVET MOTION",
    subtitle: "FILM STUDY",
    category: "CINEMATOGRAPHY",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    type: "single",
    date: "SEP 2023",
    description: "Slow-motion study of movement and light.",
  },
  {
    id: "8",
    name: "RETRO FUTURE",
    subtitle: "COLOR GRADE",
    category: "COLOR GRADING",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    type: "project",
    date: "AUG 2023",
    description: "Stylized aesthetic blending 80s neon with modern tech.",
    additionalImages: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
    ]
  },
  {
    id: "9",
    name: "FRANCISCO GOYA",
    subtitle: "1742-1828",
    category: "PHOTOGRAPHY",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
    type: "single",
    date: "JUL 2023",
    description: "Classical composition meet modern lighting.",
  },
  {
    id: "10",
    name: "BEETHOVEN",
    subtitle: "COMPOSER",
    category: "CONTEMPORARY ART",
    image: "https://images.unsplash.com/photo-1521119966571-6100a7194851?w=800&q=80",
    large: true,
    type: "single",
    date: "JUN 2023",
    description: "A dramatic portrait inspired by classical music.",
  },
  {
    id: "11",
    name: "PASTEL SKIES",
    subtitle: "LUT DEV",
    category: "COLOR GRADING",
    image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80",
    type: "single",
    date: "MAY 2023",
    description: "Custom LUT development for a dream-like cinematic palette.",
  },
  {
    id: "12",
    name: "GRAIN & GLORY",
    subtitle: "FILM ADAPTATION",
    category: "PHOTOGRAPHY",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&q=80",
    type: "project",
    date: "APR 2023",
    description: "Experimental film photography highlighting texture and imperfection.",
    additionalImages: [
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80",
    ]
  }
];
