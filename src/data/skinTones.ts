export interface SkinTone {
  level: number;         // I through VI
  name: string;
  category: string;      // Fair, Light, Medium, Medium Dark, Dark, Deep
  description: string;
  undertoneOptions: ('cool' | 'neutral' | 'warm')[];
  coolVariants: { name: string; hex: string }[];
  neutralVariants: { name: string; hex: string }[];
  warmVariants: { name: string; hex: string }[];
}

export const skinTones: SkinTone[] = [
  {
    level: 1, name: "Skin Tone I", category: "Fair",
    description: "Very pale, porcelain or ivory toned skin. Always burns in the sun. Skin could have a naturally reddish undertone. Eyes most likely blue, grey or green. Might have blonde or red hair.",
    undertoneOptions: ['cool', 'neutral', 'warm'],
    coolVariants: [{ name: "Rose Fair", hex: "#F2D4C9" }],
    neutralVariants: [{ name: "Natural Fair", hex: "#F5DCC8" }],
    warmVariants: [{ name: "Golden Light", hex: "#F7DDB7" }]
  },
  {
    level: 2, name: "Skin Tone II", category: "Light",
    description: "Fair or cream-coloured complexion, often with subtle beige undertones. Eye and hair colour could fall anywhere along the range of light to dark. May have freckles. Can tan occasionally.",
    undertoneOptions: ['cool', 'neutral', 'warm'],
    coolVariants: [{ name: "Rose Light", hex: "#E8C9B5" }, { name: "Beige Light", hex: "#DFC1AA" }],
    neutralVariants: [{ name: "Natural Light", hex: "#E5CEB5" }],
    warmVariants: [{ name: "Golden Light", hex: "#DCBA98" }, { name: "Golden Dark", hex: "#D4AF87" }]
  },
  {
    level: 3, name: "Skin Tone III", category: "Medium",
    description: "Golden, honey-hued skin tone, or a light olive complexion. Can gradually build up a sun-kissed glow, but may burn at the start of summer.",
    undertoneOptions: ['cool', 'neutral', 'warm'],
    coolVariants: [{ name: "Beige Medium", hex: "#C9A882" }],
    neutralVariants: [{ name: "Natural Medium", hex: "#C8A47A" }],
    warmVariants: [{ name: "Golden Medium", hex: "#C49A6C" }, { name: "Honey Fair", hex: "#CDA66A" }, { name: "Honey Light", hex: "#C09A5F" }]
  },
  {
    level: 4, name: "Skin Tone IV", category: "Medium Dark",
    description: "Gorgeous caramel tone that tans quickly without burning. Most likely have dark hair and eyes that range from dark to hazel to ebony.",
    undertoneOptions: ['cool', 'neutral', 'warm'],
    coolVariants: [{ name: "Beige Dark", hex: "#A48262" }],
    neutralVariants: [{ name: "Natural Dark", hex: "#A47D5B" }],
    warmVariants: [{ name: "Honey Medium", hex: "#A8854E" }, { name: "Honey Dark", hex: "#9A7644" }]
  },
  {
    level: 5, name: "Skin Tone V", category: "Dark",
    description: "Skin tone ranges from radiant bronze to rich brown. Hair and eyes are likely naturally dark. Very rarely sunburn and generally tan quickly and easily.",
    undertoneOptions: ['cool', 'neutral'],
    coolVariants: [{ name: "Cocoa Light", hex: "#8B6F4E" }, { name: "Cocoa", hex: "#795C3F" }],
    neutralVariants: [{ name: "Tawny Fair", hex: "#8A6642" }, { name: "Tawny Medium", hex: "#7A5A3A" }],
    warmVariants: [{ name: "Chestnut Light", hex: "#7D5A3C" }]
  },
  {
    level: 6, name: "Skin Tone VI", category: "Deep",
    description: "Skin tone falls in the range of deep mahogany to espresso. Almost never sunburn. Tan quickly and deeply. Likely to have both dark hair and dark eyes.",
    undertoneOptions: ['cool', 'neutral'],
    coolVariants: [{ name: "Cocoa Medium", hex: "#5C3D2E" }, { name: "Deep Mahogany", hex: "#4E342E" }],
    neutralVariants: [],
    warmVariants: [{ name: "Chestnut Medium", hex: "#6B4226" }]
  }
];
