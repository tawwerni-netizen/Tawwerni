export const brand = {
  name: "طوّرني",
  nameEn: "Tawwerni",
  domain: "tawwerni.com",
  tagline: "حوّل تعلّمك اليومي لتقدّم حقيقي",
  coachName: "فهيم",
  colors: {
    teal50: "#E1F5EE",
    teal100: "#9FE1CB",
    teal200: "#5DCAA5",
    teal400: "#1D9E75",
    teal600: "#0F6E56",
    teal800: "#085041",
    teal900: "#04342C",
  },
} as const;

export const pricing = {
  priceEgp: 200,
  originalPriceEgp: 2000,
  discountPercent: 90,
  offerNote: "عرض خاص لفترة محدودة",
} as const;

export const payment = {
  vodafoneCash: ["01200176755", "01067558133"],
  instapay: ["hhifzy@instapay", "01067558133"],
  supportWhatsapp: "01069999557",
  supportEmail: "Tawwerni@gmail.com",
  activationHours: 24,
} as const;
