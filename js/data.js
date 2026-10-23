/**
 * CampusGear P2P — Campus Equipment Lending Catalog
 * Academic hardware lending and borrowing marketplace
 * Built for BCE23EM01 | Authors: Yash Patange (125B1B348) & Pranjal Swami (125B1B141)
 */

window.CAMPUS_DATA = {
  categories: [
    { id: "all", name: "All Products", icon: "layers" },
    { id: "calculators", name: "Calculators", icon: "calculator" },
    { id: "microcontrollers", name: "Microcontrollers & IoT", icon: "cpu" },
    { id: "drafting", name: "Drafting & Architecture", icon: "pen-tool" },
    { id: "lab", name: "Lab & Testing", icon: "activity" },
    { id: "audio_visual", name: "AR/VR & Media", icon: "glasses" }
  ],

  initialGear: [
    {
      id: "gear-101",
      title: "Casio fx-991EX ClassWiz Scientific Calculator",
      category: "calculators",
      image: "assets/calc.jpg",
      description: "High-resolution display with matrix, vector, numerical integration, and calculus solvers. Essential for Applied Mathematics, Physics, and Thermodynamics exams.",
      condition: "Pristine (Grade A)",
      conditionScore: 98,
      deposit: 15,
      rentalFee: 0,
      feeType: "Free Campus Share",
      duration: "Up to 14 days",
      owner: {
        name: "Pranjal S.",
        department: "Mechanical Eng '26",
        hostel: "Block B - Room 314",
        rating: 4.9,
        reviewsCount: 19,
        verified: true,
        eduEmail: "p.swami@campus.edu"
      },
      specifications: ["552 Functions", "Solar + Battery", "High-Res LCD", "Exam Approved"],
      available: true
    },
    {
      id: "gear-102",
      title: "Arduino Uno R3 Ultimate Starter Lab Kit",
      category: "microcontrollers",
      image: "assets/microcontroller.jpg",
      description: "Complete electronics prototyping bundle: ATmega328P Uno R3 board, transparent breadboard, ultrasonic sensor HC-SR04, 0.96-inch OLED, jumper wire pack, and resistors.",
      condition: "Excellent (Grade A)",
      conditionScore: 96,
      deposit: 25,
      rentalFee: 0,
      feeType: "Free Campus Share",
      duration: "Up to 21 days",
      owner: {
        name: "Yash P.",
        department: "Computer Eng '25",
        hostel: "Hall 4 - Room 108",
        rating: 5.0,
        reviewsCount: 24,
        verified: true,
        eduEmail: "y.patange@campus.edu"
      },
      specifications: ["14 Digital I/O", "6 PWM Ports", "OLED Display", "USB Cable Included"],
      available: true
    },
    {
      id: "gear-103",
      title: "Rotring Professional Technical Drafting & Compass Set",
      category: "drafting",
      image: "assets/drafting.jpg",
      description: "Precision engineered velvet case compass set with stainless steel T-square, acrylic set squares, technical drawing pens (0.35mm, 0.5mm, 0.7mm), and A1 drafting board clip.",
      condition: "Pristine (Grade A)",
      conditionScore: 97,
      deposit: 30,
      rentalFee: 2,
      feeType: "$2 / week",
      duration: "Up to 30 days",
      owner: {
        name: "Aanya Verma",
        department: "Architecture '26",
        hostel: "Dorm 2 - Studio West",
        rating: 4.8,
        reviewsCount: 14,
        verified: true,
        eduEmail: "a.verma@campus.edu"
      },
      specifications: ["Micro-Gear Adjustment", "Velvet Hard Case", "Rapidograph Compatible", "Precision Steel"],
      available: true
    },
    {
      id: "gear-104",
      title: "Rigol Digital Storage Benchtop Oscilloscope & Fluke Multimeter",
      category: "lab",
      image: "assets/multimeter.jpg",
      description: "50MHz 2-channel digital storage oscilloscope with color LCD display, accompanied by a Fluke 87V true-RMS digital multimeter with calibrated silicone test probes.",
      condition: "Calibrated (Grade A+)",
      conditionScore: 99,
      deposit: 60,
      rentalFee: 5,
      feeType: "$5 / week (Escrow Hold)",
      duration: "Up to 7 days",
      owner: {
        name: "Prof. K. Raman Lab",
        department: "Electrical Eng Lab",
        hostel: "Tech Tower - Lab 204",
        rating: 5.0,
        reviewsCount: 42,
        verified: true,
        eduEmail: "k.raman@campus.edu"
      },
      specifications: ["50MHz 2-Channel", "1GSa/s Sample Rate", "True-RMS Fluke", "Calibrated Probes"],
      available: true
    },
    {
      id: "gear-105",
      title: "Raspberry Pi 4 Model B (4GB RAM) Lab Desktop Kit",
      category: "microcontrollers",
      image: "assets/raspberry_pi.jpg",
      description: "Quad-core SBC in clear acrylic enclosure with dual aluminum heatsinks, 32GB class 10 SanDisk microSD pre-flashed with Raspberry Pi OS, official power supply, and micro-HDMI cable.",
      condition: "Like New (Grade A)",
      conditionScore: 96,
      deposit: 35,
      rentalFee: 0,
      feeType: "Free Campus Share",
      duration: "Up to 14 days",
      owner: {
        name: "Rohan K.",
        department: "AI & Data Science '26",
        hostel: "Hall 3 - Room 412",
        rating: 4.9,
        reviewsCount: 11,
        verified: true,
        eduEmail: "r.kulkarni@campus.edu"
      },
      specifications: ["1.5GHz Quad-Core", "4GB LPDDR4", "Dual 4K HDMI", "Pre-flashed OS"],
      available: true
    },
    {
      id: "gear-106",
      title: "Meta Quest 2 Advanced All-In-One VR Headset (128GB)",
      category: "audio_visual",
      image: "assets/vr_headset.jpg",
      description: "Complete VR headset with dual Touch motion controllers, silicone face cover, headstrap, and Link cable. Ideal for spatial computing, Unity/Unreal 3D projects, and thesis presentations.",
      condition: "Very Good (Grade B+)",
      conditionScore: 93,
      deposit: 70,
      rentalFee: 5,
      feeType: "$5 / week (Escrow Hold)",
      duration: "Up to 10 days",
      owner: {
        name: "Devina M.",
        department: "Interaction Design '25",
        hostel: "Dorm 1 - Room 202",
        rating: 5.0,
        reviewsCount: 16,
        verified: true,
        eduEmail: "d.mehta@campus.edu"
      },
      specifications: ["1832 x 1920 Per Eye", "6DoF Tracking", "Dual Controllers", "Link Cable Included"],
      available: false
    }
  ]
};
