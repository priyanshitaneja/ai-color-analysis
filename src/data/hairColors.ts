import type { NamedColor } from '../types';

export interface HairColorGroup {
  category: string;
  colors: NamedColor[];
}

export const hairColors: HairColorGroup[] = [
  {
    category: "Brown",
    colors: [
      { name: "Cool Brown", hex: "#5C4033" },
      { name: "Neutral Brown", hex: "#6B4423" },
      { name: "Warm Brown", hex: "#7B5B3A" },
      { name: "Medium Chestnut", hex: "#954535" },
      { name: "Light Golden Brown", hex: "#A0785A" },
      { name: "Soft Honey Brown", hex: "#9B7848" },
      { name: "Light Brown", hex: "#A67B5B" },
      { name: "Medium Brown", hex: "#6B4226" },
      { name: "Medium Cool Brown", hex: "#5A4032" },
      { name: "Medium Warm Brown", hex: "#7B5B3A" },
      { name: "Ash Blonde", hex: "#B8A990" },
      { name: "Ash Brown", hex: "#8A7560" },
      { name: "Medium Brown w/Honey", hex: "#8B6D4A" },
      { name: "Mushroom Brown", hex: "#9B8E80" },
      { name: "Deep Brown w/Caramel", hex: "#5C3D2E" },
      { name: "Bitter Chocolate", hex: "#3D1C02" },
      { name: "Dark Reddish Brown", hex: "#5C2018" },
      { name: "Dark Chestnut Brown", hex: "#5E3023" },
      { name: "Dark Golden Brown", hex: "#6B4226" },
      { name: "Dark Mocha Brown", hex: "#4A3228" }
    ]
  },
  {
    category: "Blonde",
    colors: [
      { name: "Iced Champagne Blonde", hex: "#F0E6D6" },
      { name: "Platinum Blonde", hex: "#E5E1D6" },
      { name: "Strawberry Blonde", hex: "#D4956A" },
      { name: "Cool Rose Blonde", hex: "#D4B5A0" },
      { name: "Pearl Blonde", hex: "#E8DCD0" },
      { name: "Light Cool Blonde", hex: "#D9CFC0" },
      { name: "Light Golden Blonde", hex: "#DBC396" },
      { name: "Medium Golden Blonde", hex: "#C9A96E" },
      { name: "Champagne Blonde", hex: "#F1DEB4" },
      { name: "Golden Blonde w/highlights", hex: "#C9A86C" },
      { name: "Light Ash Blonde", hex: "#C5B9A8" },
      { name: "Medium Ash Blonde", hex: "#B0A18E" },
      { name: "Dark Ash Blonde", hex: "#9B8E7A" },
      { name: "Soft Honey Blonde", hex: "#C9A96C" },
      { name: "Dark Golden Blonde", hex: "#B8942E" },
      { name: "Cool Violet Blonde", hex: "#C4B0B4" },
      { name: "Caramel Blonde", hex: "#BA8D56" },
      { name: "Golden Honey Blonde", hex: "#C4952E" },
      { name: "Sandy Blonde", hex: "#C2B280" },
      { name: "Dirty Blonde", hex: "#A89060" }
    ]
  },
  {
    category: "Red & Auburn",
    colors: [
      { name: "Light Auburn", hex: "#A55B3A" },
      { name: "Medium Auburn", hex: "#8B3A1A" },
      { name: "Dark Auburn", hex: "#6B2A1A" },
      { name: "Light Golden Auburn", hex: "#B86B3A" },
      { name: "Muted Dark Auburn", hex: "#6E3B28" },
      { name: "Light Copper", hex: "#C87D4A" },
      { name: "Medium Copper", hex: "#B56C3A" },
      { name: "Dark Copper", hex: "#8B4A2A" },
      { name: "Coppery Gold", hex: "#C48A3E" },
      { name: "Copper & Ginger", hex: "#CB6D3A" },
      { name: "Natural Ginger", hex: "#C46A3A" },
      { name: "Ombre Ginger", hex: "#B85A2A" },
      { name: "Auburn Strawberry", hex: "#A04A2E" },
      { name: "Rosewood", hex: "#6B3A3A" },
      { name: "Spicy Cinnamon", hex: "#8B4528" },
      { name: "Hot & Fiery Ginger", hex: "#CF5A2A" },
      { name: "Rich & Deep Mahogany", hex: "#5C2018" }
    ]
  },
  {
    category: "Black",
    colors: [
      { name: "Plum Black", hex: "#2A1028" },
      { name: "Burgundy Black", hex: "#2A0E18" },
      { name: "Ebony", hex: "#1A1110" },
      { name: "Black", hex: "#0A0A0A" },
      { name: "Blue Black", hex: "#0C0C1E" }
    ]
  },
  {
    category: "Grey & Silver",
    colors: [
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Light Ash Grey", hex: "#B0A8A0" },
      { name: "Dark Ash Grey", hex: "#706860" },
      { name: "Gunmetal Grey", hex: "#5C5858" },
      { name: "Soft Charcoal", hex: "#4A4646" }
    ]
  }
];
