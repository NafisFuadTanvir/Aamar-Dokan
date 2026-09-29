/**
 * Bangladesh Delivery Zones and Fee Engine
 * All fees are stored in poisha (1 BDT = 100 poisha).
 */

export interface DistrictInfo {
  id: string;
  nameBn: string;
  nameEn: string;
  isDhaka: boolean;
}

export const BD_DISTRICTS: DistrictInfo[] = [
  { id: "dhaka", nameBn: "ঢাকা", nameEn: "Dhaka", isDhaka: true },
  { id: "gazipur", nameBn: "গাজীপুর", nameEn: "Gazipur", isDhaka: false },
  { id: "narayanganj", nameBn: "নারায়ণগঞ্জ", nameEn: "Narayanganj", isDhaka: false },
  { id: "chittagong", nameBn: "চট্টগ্রাম", nameEn: "Chattogram", isDhaka: false },
  { id: "sylhet", nameBn: "সিলেট", nameEn: "Sylhet", isDhaka: false },
  { id: "rajshahi", nameBn: "রাজশাহী", nameEn: "Rajshahi", isDhaka: false },
  { id: "khulna", nameBn: "খুলনা", nameEn: "Khulna", isDhaka: false },
  { id: "barisal", nameBn: "বরিশাল", nameEn: "Barishal", isDhaka: false },
  { id: "rangpur", nameBn: "রংপুর", nameEn: "Rangpur", isDhaka: false },
  { id: "mymensingh", nameBn: "ময়মনসিংহ", nameEn: "Mymensingh", isDhaka: false },
  { id: "comilla", nameBn: "কুমিল্লা", nameEn: "Cumilla", isDhaka: false },
  { id: "coxsbazar", nameBn: "কক্সবাজার", nameEn: "Cox's Bazar", isDhaka: false },
  { id: "bogra", nameBn: "বগুড়া", nameEn: "Bogura", isDhaka: false },
  { id: "jessore", nameBn: "যশোর", nameEn: "Jashore", isDhaka: false },
  { id: "tangail", nameBn: "টাঙ্গাইল", nameEn: "Tangail", isDhaka: false },
  { id: "feni", nameBn: "ফেনী", nameEn: "Feni", isDhaka: false },
  { id: "noakhali", nameBn: "নোয়াখালী", nameEn: "Noakhali", isDhaka: false },
  { id: "pabna", nameBn: "পাবনা", nameEn: "Pabna", isDhaka: false },
  { id: "dinajpur", nameBn: "দিনাজপুর", nameEn: "Dinajpur", isDhaka: false },
  { id: "kushtia", nameBn: "কুষ্টিয়া", nameEn: "Kushtia", isDhaka: false },
];

export const DEFAULT_DELIVERY_FEES = {
  INSIDE_DHAKA_POISHA: 7000, // ৳70
  OUTSIDE_DHAKA_POISHA: 13000, // ৳130
};

export function calculateDeliveryFeePoisha(districtId: string): number {
  const district = BD_DISTRICTS.find((d) => d.id === districtId);
  if (district && district.isDhaka) {
    return DEFAULT_DELIVERY_FEES.INSIDE_DHAKA_POISHA;
  }
  return DEFAULT_DELIVERY_FEES.OUTSIDE_DHAKA_POISHA;
}
