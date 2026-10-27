/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Bengali, Banglish & English Intelligent Search Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides:
 * 1. Trilingual vocabulary & synonyms mapping (Bangla <-> Banglish <-> English)
 * 2. Phonetic Banglish -> Bengali transliteration (Avro-style rule based)
 * 3. Reverse Bengali -> Banglish romanization
 * 4. Bengali character and diacritic normalization (র/ড়/ঢ়, শ/ষ/স, ণ/ন, ঁ, etc.)
 * 5. Full search query expansion for multi-language product matching
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface TranslationHint {
  bangla?: string;
  english?: string;
  banglish?: string;
}

export interface ExpandedSearch {
  original: string;
  detectedType: "bangla" | "banglish" | "english" | "mixed";
  terms: string[];
  primaryHint?: TranslationHint;
}

// ── 1. Character & Script Detection ───────────────────────────────────────────

const BANGLA_CHAR_REGEX = /[\u0980-\u09FF]/;
const LATIN_CHAR_REGEX = /[a-zA-Z]/;

export function isBanglaText(str: string): boolean {
  return BANGLA_CHAR_REGEX.test(str);
}

export function isLatinText(str: string): boolean {
  return LATIN_CHAR_REGEX.test(str);
}

export function detectScriptType(query: string): "bangla" | "banglish" | "english" | "mixed" {
  const hasBangla = isBanglaText(query);
  const hasLatin = isLatinText(query);

  if (hasBangla && hasLatin) return "mixed";
  if (hasBangla) return "bangla";
  if (hasLatin) {
    // Check if it's more likely Banglish or standard English
    const lower = query.toLowerCase().trim();
    if (isLikelyBanglish(lower)) return "banglish";
    return "english";
  }
  return "mixed";
}

// ── 2. Bengali Character Normalization ────────────────────────────────────────

/**
 * Normalizes common variations in Bengali spelling:
 * - ড়, ঢ় -> র
 * - ষ, স -> শ
 * - ণ -> ন
 * - য় -> য
 * - ৎ -> ত
 * - ঁ (remove chandrabindu for loose matching)
 * - ী -> ি
 * - ূ -> ু
 */
export function normalizeBangla(text: string): string {
  return text
    .replace(/[ড়ঢ়]/g, "র")
    .replace(/[ষস]/g, "শ")
    .replace(/ণ/g, "ন")
    .replace(/য়/g, "য")
    .replace(/ৎ/g, "ত")
    .replace(/ঁ/g, "")
    .replace(/ী/g, "ি")
    .replace(/ূ/g, "ু")
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Zero width chars
    .trim();
}

/**
 * Generates alternative spellings for Bengali queries
 * e.g., "খাটি" <-> "খাঁটি", "কালিজিরা" <-> "কালোজিরা"
 */
export function getBanglaVariants(word: string): string[] {
  const variants = new Set<string>();
  variants.add(word);

  // Add/remove chandrabindu
  if (word.includes("ঁ")) {
    variants.add(word.replace(/ঁ/g, ""));
  } else {
    // Common words with chandrabindu
    if (word.includes("খাটি")) variants.add(word.replace(/খাটি/g, "খাঁটি"));
    if (word.includes("কাথা")) variants.add(word.replace(/কাথা/g, "কাঁথা"));
    if (word.includes("ফাকি")) variants.add(word.replace(/ফাকি/g, "ফাঁকি"));
    if (word.includes("বাশ")) variants.add(word.replace(/বাশ/g, "বাঁশ"));
    if (word.includes("চাদ")) variants.add(word.replace(/চাদ/g, "চাঁদ"));
    if (word.includes("ধোয়া")) variants.add(word.replace(/ধোয়া/g, "ধোঁয়া"));
  }

  // Common o/i interchange (e.g. কালোজিরা / কালিজিরা)
  if (word.includes("কালোজিরা")) variants.add(word.replace(/কালোজিরা/g, "কালিজিরা"));
  if (word.includes("কালিজিরা")) variants.add(word.replace(/কালিজিরা/g, "কালোজিরা"));

  // সরিষা / সর্ষে
  if (word.includes("সরিষা")) variants.add(word.replace(/সরিষা/g, "সর্ষে"));
  if (word.includes("সর্ষে")) variants.add(word.replace(/সর্ষে/g, "সরিষা"));

  // চিনিগুড়া / চিনিগুঁড়া
  if (word.includes("চিনিগুড়া")) variants.add(word.replace(/চিনিগুড়া/g, "চিনিগুঁড়া"));
  if (word.includes("চিনিগুঁড়া")) variants.add(word.replace(/চিনিগুঁড়া/g, "চিনিগুড়া"));

  // গুড় / গুড়
  if (word.includes("গুড়")) variants.add(word.replace(/গুড়/g, "গুড়"));
  if (word.includes("গুড়")) variants.add(word.replace(/গুড়/g, "গুড়"));

  // পেঁয়াজ / পেঁয়াজ
  if (word.includes("পেঁয়াজ")) variants.add(word.replace(/পেঁয়াজ/g, "পেঁয়াজ"));
  if (word.includes("পেঁয়াজ")) variants.add(word.replace(/পেঁয়াজ/g, "পেঁয়াজ"));

  // শাড়ি / শাড়ি
  if (word.includes("শাড়ি")) variants.add(word.replace(/শাড়ি/g, "শাড়ি"));
  if (word.includes("শাড়ি")) variants.add(word.replace(/শাড়ি/g, "শাড়ি"));

  return Array.from(variants);
}

// ── 3. Trilingual E-Commerce Dictionary ─────────────────────────────────────────

interface DictionaryEntry {
  bangla: string[];
  banglish: string[];
  english: string[];
  tags?: string[];
}

export const TRILINGUAL_DICTIONARY: DictionaryEntry[] = [
  // ── Foods & Groceries ─────────────────────────
  {
    bangla: ["মধু", "কাঁচা মধু", "সুন্দরবনের মধু"],
    banglish: ["modhu", "madhu", "modhoo", "modu", "kacha modhu", "sundarban modhu", "shundorbon modhu"],
    english: ["honey", "raw honey", "pure honey", "sundarban honey"],
    tags: ["food", "organic", "grocery"],
  },
  {
    bangla: ["সরিষা", "সরিষার তেল", "সর্ষে", "সর্ষের তেল", "ঘানির তেল"],
    banglish: ["shorisha", "sorisha", "shorishar tel", "sorishar tel", "sorisha tel", "shorisha tel", "ghanir tel"],
    english: ["mustard", "mustard oil", "pure mustard oil"],
    tags: ["food", "oil", "cooking"],
  },
  {
    bangla: ["কালোজিরা", "কালিজিরা", "কালোজিরার তেল", "কালিজিরার তেল"],
    banglish: ["kalo jira", "kalijira", "kalojeera", "kalonji", "kalo jeera", "kalojeerar tel", "kalijirar tel", "kalo zira"],
    english: ["black seed", "black cumin", "nigella", "kalonji", "black seed oil"],
    tags: ["herbal", "oil", "wellness"],
  },
  {
    bangla: ["ঘি", "গাওয়া ঘি", "খাঁটি ঘি"],
    banglish: ["ghee", "ghi", "gawa ghee", "gawaghee", "khati ghee"],
    english: ["ghee", "clarified butter", "cow ghee"],
    tags: ["food", "dairy", "cooking"],
  },
  {
    bangla: ["তেল", "রান্নার তেল"],
    banglish: ["tel", "toyl", "rannar tel"],
    english: ["oil", "cooking oil"],
    tags: ["grocery", "cooking"],
  },
  {
    bangla: ["নারিকেল তেল", "নারকেল তেল", "নারিকেল", "নারকেল"],
    banglish: ["narikel tel", "narkel tel", "narikel", "narkel", "narikeler tel"],
    english: ["coconut oil", "coconut", "pure coconut oil"],
    tags: ["hair", "oil", "cooking"],
  },
  {
    bangla: ["জলপাই তেল", "অলিভ অয়েল", "অলিভ অয়েল", "জলপাই"],
    banglish: ["jolpai tel", "jolphai tel", "olive oil", "jolpai", "jolphai"],
    english: ["olive oil", "extra virgin olive oil", "olive"],
    tags: ["cooking", "oil", "wellness"],
  },
  {
    bangla: ["তিল", "তিলের তেল"],
    banglish: ["til", "tiler tel", "teel"],
    english: ["sesame", "sesame oil"],
    tags: ["oil", "cooking"],
  },
  {
    bangla: ["চা", "চা পাতা", "গ্রিন টি", "সবুজ চা", "লাল চা"],
    banglish: ["cha", "chaw", "cha pata", "green tea", "greentea", "lal cha"],
    english: ["tea", "green tea", "tea leaf", "black tea"],
    tags: ["beverage", "grocery"],
  },
  {
    bangla: ["কফি"],
    banglish: ["coffee", "kofi", "koffee", "cofe"],
    english: ["coffee", "instant coffee", "coffee beans"],
    tags: ["beverage"],
  },
  {
    bangla: ["চাল", "ভাত", "পোলাও চাল", "পোলাওয়ের চাল"],
    banglish: ["chal", "chawl", "bhat", "polao chal", "polawer chal"],
    english: ["rice", "aromatic rice", "polao rice"],
    tags: ["food", "grocery"],
  },
  {
    bangla: ["চিনিগুঁড়া", "চিনিগুড়া", "চিনিগুঁড়া চাল"],
    banglish: ["chinigura", "chiniguda", "chini gura", "chinigura chal"],
    english: ["chinigura", "chinigura rice", "aromatic rice"],
    tags: ["rice", "grocery"],
  },
  {
    bangla: ["বাসমতী", "বাসমতি", "বাসমতি চাল"],
    banglish: ["basmati", "bashmoti", "basmati chal"],
    english: ["basmati", "basmati rice"],
    tags: ["rice", "grocery"],
  },
  {
    bangla: ["ডাল", "মসুর ডাল", "মুগ ডাল", "মটর ডাল"],
    banglish: ["dal", "daal", "moshur dal", "moog dal", "mug dal", "motor dal"],
    english: ["lentil", "lentils", "red lentil", "pulse", "pulses"],
    tags: ["food", "grocery"],
  },
  {
    bangla: ["লবণ", "লবন", "সৈন্ধব লবণ"],
    banglish: ["lobon", "laban", "nobon", "shondhob lobon", "pink salt"],
    english: ["salt", "pink salt", "himalayan pink salt", "table salt"],
    tags: ["food", "grocery"],
  },
  {
    bangla: ["চিনি", "লাল চিনি", "দেশি চিনি"],
    banglish: ["chini", "lal chini", "deshi chini", "brown sugar"],
    english: ["sugar", "brown sugar", "raw sugar"],
    tags: ["food", "grocery"],
  },
  {
    bangla: ["গুড়", "গুড়", "খেজুরের গুড়", "পাটালি গুড়", "ঝোলা গুড়"],
    banglish: ["gur", "gud", "khejurer gur", "patali gur", "jhola gur", "nolen gur"],
    english: ["jaggery", "date palm jaggery", "molasses", "cane jaggery"],
    tags: ["food", "sweet", "organic"],
  },
  {
    bangla: ["হলুদ", "হলুদের গুঁড়া", "কাঁচা হলুদ"],
    banglish: ["holud", "halud", "holuder gura", "holud gura", "kacha holud"],
    english: ["turmeric", "turmeric powder", "raw turmeric"],
    tags: ["spice", "grocery"],
  },
  {
    bangla: ["মরিচ", "মরিচের গুঁড়া", "শুকনো মরিচ", "কাঁচা মরিচ"],
    banglish: ["morich", "marich", "moricher gura", "shukno morich", "kacha morich"],
    english: ["chili", "chilli", "pepper", "red chili", "chili powder"],
    tags: ["spice", "grocery"],
  },
  {
    bangla: ["আদা", "আদার গুঁড়া", "শুঁঠ"],
    banglish: ["ada", "adar gura", "shuth"],
    english: ["ginger", "ginger powder", "dry ginger"],
    tags: ["spice", "grocery"],
  },
  {
    bangla: ["রসুন", "রসুনের গুঁড়া"],
    banglish: ["roshun", "roshon", "roshuner gura"],
    english: ["garlic", "garlic powder"],
    tags: ["spice", "grocery"],
  },
  {
    bangla: ["পেঁয়াজ", "পেয়াজ"],
    banglish: ["peyaj", "peaj", "peyaz", "piaj"],
    english: ["onion", "onions"],
    tags: ["grocery"],
  },
  {
    bangla: ["জিরা", "জিরার গুঁড়া"],
    banglish: ["jira", "jeera", "jirar gura"],
    english: ["cumin", "cumin powder", "cumin seeds"],
    tags: ["spice", "grocery"],
  },
  {
    bangla: ["ধনিয়া", "ধনে", "ধনিয়ার গুঁড়া"],
    banglish: ["dhonia", "dhone", "dhoniar gura"],
    english: ["coriander", "coriander powder", "coriander seeds"],
    tags: ["spice", "grocery"],
  },
  {
    bangla: ["এলাচ", "ছোট এলাচ", "বড় এলাচ"],
    banglish: ["elach", "elaichi", "choto elach", "boro elach"],
    english: ["cardamom", "green cardamom", "black cardamom"],
    tags: ["spice", "grocery"],
  },
  {
    bangla: ["দারুচিনি"],
    banglish: ["daruchini", "darusini", "daruchine"],
    english: ["cinnamon", "cinnamon stick", "cinnamon powder"],
    tags: ["spice", "grocery"],
  },
  {
    bangla: ["লবঙ্গ"],
    banglish: ["lobongo", "labanga", "lobonggo"],
    english: ["clove", "cloves"],
    tags: ["spice", "grocery"],
  },
  {
    bangla: ["তেজপাতা"],
    banglish: ["tejpata", "tej pata", "tezpata"],
    english: ["bay leaf", "bay leaves"],
    tags: ["spice", "grocery"],
  },
  {
    bangla: ["মশলা", "মসলা", "গরম মসলা"],
    banglish: ["moshla", "masala", "gorom moshla", "garam masala", "mosla"],
    english: ["spice", "spices", "masala", "garam masala"],
    tags: ["spice", "grocery"],
  },
  {
    bangla: ["খেজুর", "মরিয়ম খেজুর", "আজওয়া খেজুর", "মেদজুল খেজুর"],
    banglish: ["khejur", "moriom khejur", "ajwa khejur", "medjool khejur", "khezoor"],
    english: ["dates", "date", "ajwa dates", "medjool dates"],
    tags: ["fruit", "healthy", "food"],
  },
  {
    bangla: ["বাদাম", "কাজুবাদাম", "কাঠবাদাম", "পেস্তাবাদাম", "চিনাবাদাম", "আখরোট"],
    banglish: ["badam", "kajubadam", "kathbadam", "pestabadam", "chinabadam", "kaju badam", "akhrot"],
    english: ["nut", "nuts", "almond", "almonds", "cashew", "cashews", "pistachio", "peanut", "walnut"],
    tags: ["dry fruit", "healthy"],
  },
  {
    bangla: ["কিসমিস", "কিশমিশ"],
    banglish: ["kismis", "kishmish", "keesmees"],
    english: ["raisin", "raisins"],
    tags: ["dry fruit", "sweet"],
  },
  {
    bangla: ["চিয়া সিড", "চিয়া বীজ", "চিয়া সীড"],
    banglish: ["chia seed", "chiaseed", "chia seeder", "chia beej"],
    english: ["chia seed", "chia seeds"],
    tags: ["superfood", "wellness"],
  },
  {
    bangla: ["কাসুন্দি", "সরিষার কাসুন্দি"],
    banglish: ["kasundi", "kashundi", "shorishar kasundi"],
    english: ["kasundi", "mustard sauce"],
    tags: ["sauce", "traditional"],
  },
  {
    bangla: ["আচার", "আমের আচার", "রসুন আচার", "জলপাই আচার", "বরই আচার"],
    banglish: ["achar", "amer achar", "roshun achar", "jolpai achar", "boroi achar"],
    english: ["pickle", "pickles", "mango pickle", "garlic pickle", "olive pickle"],
    tags: ["traditional", "food"],
  },
  {
    bangla: ["সিরকা", "ভিনেগার", "আপেল সিডার ভিনেগার"],
    banglish: ["sirka", "vinegar", "apple cider vinegar", "acv"],
    english: ["vinegar", "apple cider vinegar"],
    tags: ["wellness", "grocery"],
  },
  {
    bangla: ["আম"],
    banglish: ["aam", "am"],
    english: ["mango"],
    tags: ["fruit"],
  },
  {
    bangla: ["লেবু", "কাগজি লেবু"],
    banglish: ["lebu", "kagji lebu"],
    english: ["lemon", "lime"],
    tags: ["fruit"],
  },

  // ── Traditional Crafts & Attire ───────────────
  {
    bangla: ["নকশিকাঁথা", "নকশি কাঁথা", "কাঁথা", "হাতে বোনা নকশিকাঁথা"],
    banglish: ["nakshi kantha", "nokshi kantha", "nokshikantha", "nakshikantha", "kantha", "nokshi", "nakshi", "katha", "nakshi katha"],
    english: ["nakshi kantha", "quilt", "embroidered quilt", "handmade quilt", "traditional quilt"],
    tags: ["traditional", "craft", "textile"],
  },
  {
    bangla: ["পাঞ্জাবি", "পাঞ্জাবী", "কাতান পাঞ্জাবি", "সুতি পাঞ্জাবি"],
    banglish: ["panjabi", "punjabi", "panzabi", "suti panjabi", "katan panjabi"],
    english: ["panjabi", "punjabi", "kurta", "men kurta"],
    tags: ["clothing", "men", "traditional"],
  },
  {
    bangla: ["পায়জামা", "পায়জামা"],
    banglish: ["payjama", "pajama", "paizama"],
    english: ["pajama", "pyjama", "trousers"],
    tags: ["clothing"],
  },
  {
    bangla: ["কুর্তি"],
    banglish: ["kurti", "kurty"],
    english: ["kurti", "tunic"],
    tags: ["clothing", "women"],
  },
  {
    bangla: ["শাড়ি", "শাড়ি", "জামদানি", "কাতান", "সুতি শাড়ি"],
    banglish: ["saree", "sari", "shari", "jamdani", "katan", "suti shari"],
    english: ["saree", "sari", "jamdani saree"],
    tags: ["clothing", "women", "traditional"],
  },
  {
    bangla: ["শার্ট"],
    banglish: ["shirt", "shart"],
    english: ["shirt", "formal shirt", "casual shirt"],
    tags: ["clothing", "men"],
  },
  {
    bangla: ["টি-শার্ট", "টি শার্ট"],
    banglish: ["tshirt", "t-shirt", "ti shirt", "tee"],
    english: ["t-shirt", "tshirt", "tee"],
    tags: ["clothing"],
  },
  {
    bangla: ["জুতা", "জুতো", "চামড়ার জুতা"],
    banglish: ["juta", "juto", "chamrar juta", "leather juta"],
    english: ["shoe", "shoes", "leather shoes", "footwear"],
    tags: ["footwear"],
  },
  {
    bangla: ["স্যান্ডেল", "চটি"],
    banglish: ["sandel", "sandal", "choti"],
    english: ["sandal", "sandals", "slippers"],
    tags: ["footwear"],
  },
  {
    bangla: ["ব্যাগ", "পাটের ব্যাগ"],
    banglish: ["bag", "pater bag", "jute bag"],
    english: ["bag", "handbag", "jute bag", "tote bag"],
    tags: ["accessories"],
  },
  {
    bangla: ["হস্তশিল্প"],
    banglish: ["hastashilpa", "hostoshilpo", "hater kaj"],
    english: ["handicraft", "craft", "handmade"],
    tags: ["traditional", "craft"],
  },
  {
    bangla: ["পাট", "পাটের পণ্য"],
    banglish: ["pat", "pater", "pater ponno"],
    english: ["jute", "jute product", "jute crafts"],
    tags: ["traditional", "craft"],
  },
  {
    bangla: ["মাটির", "মাটির পাত্র", "পোড়ামাটির"],
    banglish: ["matir", "matir patro", "terracotta"],
    english: ["clay", "pottery", "terracotta"],
    tags: ["traditional", "craft"],
  },
  {
    bangla: ["আতর", "সুগন্ধি"],
    banglish: ["ator", "attar", "sugondhi"],
    english: ["attar", "perfume", "fragrance", "oud"],
    tags: ["fragrance", "traditional"],
  },
  {
    bangla: ["টুপি"],
    banglish: ["tupi", "namajer tupi"],
    english: ["cap", "prayer cap", "hat"],
    tags: ["clothing", "traditional"],
  },
  {
    bangla: ["জায়নামাজ", "জায়নামাজ"],
    banglish: ["jaynamaz", "jainamaz", "zaynamaz"],
    english: ["prayer mat", "rug", "prayer rug"],
    tags: ["traditional"],
  },

  // ── Herbal, Wellness & Ayurvedic ─────────────
  {
    bangla: ["হার্বাল", "ভেষজ"],
    banglish: ["herbal", "bheshoj", "bhesaj", "bheshojo"],
    english: ["herbal", "ayurvedic", "botanical"],
    tags: ["herbal", "natural"],
  },
  {
    bangla: ["অর্গানিক", "প্রাকৃতিক"],
    banglish: ["organic", "prakritik", "prokritik"],
    english: ["organic", "natural", "eco-friendly"],
    tags: ["organic", "natural"],
  },
  {
    bangla: ["খাঁটি", "খাটি"],
    banglish: ["khati", "khanti"],
    english: ["pure", "authentic", "genuine", "original"],
    tags: ["quality"],
  },
  {
    bangla: ["নিম", "নিমের পাতা", "নিম তেল", "নিম পাউডার"],
    banglish: ["neem", "nim", "nimer pata", "nim tel"],
    english: ["neem", "neem leaves", "neem oil", "neem powder"],
    tags: ["herbal", "wellness", "skincare"],
  },
  {
    bangla: ["আমলকী", "আমলকি", "আমলকীর গুঁড়া"],
    banglish: ["amla", "amloki", "amlocee", "amlokir gura"],
    english: ["amla", "indian gooseberry", "amla powder"],
    tags: ["herbal", "wellness", "hair"],
  },
  {
    bangla: ["হরিতকী", "হরিতকি"],
    banglish: ["horitoki", "haritaki", "horitokee"],
    english: ["haritaki", "chebulic myrobalan"],
    tags: ["herbal", "wellness"],
  },
  {
    bangla: ["বহেরা"],
    banglish: ["bohera", "bahera"],
    english: ["bahera", "belleric myrobalan"],
    tags: ["herbal", "wellness"],
  },
  {
    bangla: ["ত্রিফলা", "ত্রিফলা গুঁড়া"],
    banglish: ["triphala", "trifala", "triphalar gura"],
    english: ["triphala", "triphala powder"],
    tags: ["herbal", "wellness"],
  },
  {
    bangla: ["তুলসী", "তুলসি", "তুলসী পাতা"],
    banglish: ["tulsi", "tulsi pata", "tulsir pata"],
    english: ["tulsi", "holy basil", "basil leaves"],
    tags: ["herbal", "wellness"],
  },
  {
    bangla: ["ঘৃতকুমারী", "অ্যালোভেরা", "এলোভেরা"],
    banglish: ["ghritakumari", "aloe vera", "aloevera", "elovera", "alovera"],
    english: ["aloe vera", "aloe vera gel"],
    tags: ["herbal", "skincare"],
  },
  {
    bangla: ["স্পিরুলিনা"],
    banglish: ["spirulina"],
    english: ["spirulina", "spirulina powder"],
    tags: ["superfood", "wellness"],
  },
  {
    bangla: ["অশ্বগন্ধা", "অশ্বগন্ধা গুঁড়া"],
    banglish: ["ashwagandha", "aswagandha", "aswagondha"],
    english: ["ashwagandha", "ashwagandha powder"],
    tags: ["herbal", "wellness"],
  },
  {
    bangla: ["সজনে পাতা", "মরিঙ্গা", "মরিঙ্গা পাউডার"],
    banglish: ["sojne", "moringa", "shojne pata", "moringa powder"],
    english: ["moringa", "moringa powder", "drumstick leaves"],
    tags: ["superfood", "herbal"],
  },
  {
    bangla: ["মেথি", "মেথির গুঁড়া"],
    banglish: ["methi", "methir gura", "methee"],
    english: ["fenugreek", "fenugreek seeds", "fenugreek powder"],
    tags: ["herbal", "hair", "spice"],
  },
  {
    bangla: ["ইসবগুল", "ইসবগুলের ভুষি"],
    banglish: ["isabgol", "isobgul", "isobguler bhushi", "isabguler vushi"],
    english: ["psyllium husk", "isabgol", "psyllium"],
    tags: ["digestive", "wellness"],
  },
  {
    bangla: ["তোকমা", "তোকমা দানা"],
    banglish: ["tokma", "tokma dana"],
    english: ["basil seeds", "sabja seeds", "tokma"],
    tags: ["wellness", "beverage"],
  },
  {
    bangla: ["মেহেদি", "মেহেদী", "মেহেদি পাতা"],
    banglish: ["mehedi", "mehendi", "mehedir pata", "henna"],
    english: ["henna", "mehendi", "henna powder"],
    tags: ["hair", "beauty"],
  },

  // ── Personal Care & Beauty ────────────────────
  {
    bangla: ["সাবান", "অর্গানিক সাবান", "নিম সাবান", "মধু সাবান"],
    banglish: ["sabun", "shabun", "shaban", "organic sabun", "nim sabun"],
    english: ["soap", "handmade soap", "organic soap", "neem soap", "body bar"],
    tags: ["skincare", "bath"],
  },
  {
    bangla: ["শ্যাম্পু", "হার্বাল শ্যাম্পু"],
    banglish: ["shampoo", "shampu", "herbal shampoo"],
    english: ["shampoo", "herbal shampoo", "hair cleanser"],
    tags: ["hair", "bath"],
  },
  {
    bangla: ["কন্ডিশনার"],
    banglish: ["conditioner", "hair conditioner"],
    english: ["conditioner", "hair conditioner"],
    tags: ["hair"],
  },
  {
    bangla: ["চুলের তেল", "হার্বাল চুলের তেল"],
    banglish: ["chuler tel", "hair oil", "herbal chuler tel"],
    english: ["hair oil", "herbal hair oil"],
    tags: ["hair", "oil"],
  },
  {
    bangla: ["ফেসওয়াশ", "ফেসওয়াশ"],
    banglish: ["facewash", "face wash", "feswash"],
    english: ["face wash", "facial cleanser", "facewash"],
    tags: ["skincare", "face"],
  },
  {
    bangla: ["ক্রিম", "নাইট ক্রিম", "ডে ক্রিম"],
    banglish: ["cream", "krim", "night cream", "day cream"],
    english: ["cream", "moisturizer", "face cream", "night cream"],
    tags: ["skincare"],
  },
  {
    bangla: ["লোশন", "বডি লোশন"],
    banglish: ["lotion", "body lotion"],
    english: ["lotion", "body lotion", "moisturizing lotion"],
    tags: ["skincare"],
  },
  {
    bangla: ["স্ক্রাব", "বডি স্ক্রাব", "ফেস স্ক্রাব"],
    banglish: ["scrub", "body scrub", "face scrub"],
    english: ["scrub", "exfoliator", "face scrub"],
    tags: ["skincare"],
  },
  {
    bangla: ["লিপ বাম"],
    banglish: ["lip balm", "lipbalm"],
    english: ["lip balm", "lip care"],
    tags: ["skincare", "lips"],
  },
  {
    bangla: ["সিরাম", "ফেস সিরাম"],
    banglish: ["serum", "face serum"],
    english: ["serum", "face serum", "vitamin c serum"],
    tags: ["skincare"],
  },
  {
    bangla: ["সানস্ক্রিন", "সানব্লক"],
    banglish: ["sunscreen", "sunblock", "sun lotion"],
    english: ["sunscreen", "sunblock", "sun protection"],
    tags: ["skincare"],
  },
  {
    bangla: ["চুল", "চুলের যত্ন"],
    banglish: ["chul", "chuler", "chuler jotno"],
    english: ["hair", "hair care"],
    tags: ["category"],
  },
  {
    bangla: ["মুখ", "মুখের যত্ন"],
    banglish: ["mukh", "mukher", "mukher jotno"],
    english: ["face", "facial", "face care"],
    tags: ["category"],
  },
  {
    bangla: ["ত্বক", "ত্বকের যত্ন"],
    banglish: ["tok", "toker", "twak", "toker jotno"],
    english: ["skin", "skincare"],
    tags: ["category"],
  },
  {
    bangla: ["শরীর"],
    banglish: ["shorir", "shorirer"],
    english: ["body", "body care"],
    tags: ["category"],
  },
];

// Helper to determine if a string looks like Banglish
function isLikelyBanglish(text: string): boolean {
  // If text contains common Banglish character combos or words
  const banglishIndicators = [
    "modhu", "shorisha", "sorisha", "kalo", "jira", "ghee", "kantha",
    "nokshi", "nakshi", "khati", "tel", "cha", "bhat", "chal", "chinigura",
    "roshun", "holud", "morich", "peyaj", "lobon", "chul", "mukh", "tok",
    "bheshoj", "prakritik", "juta", "panjabi", "shari", "achar", "badam",
  ];
  return banglishIndicators.some((word) => text.includes(word));
}

// ── 4. Avro-Style Phonetic Transliteration (Banglish -> Bengali) ─────────────

interface PhoneticRule {
  pattern: RegExp;
  replacement: string;
}

// Order matters: longer multi-character sequences must match first
const BANGLISH_CONSONANT_RULES: PhoneticRule[] = [
  // Consonant clusters & digraphs
  { pattern: /^kkhy/i, replacement: "ক্ষ্য" },
  { pattern: /^kkh/i, replacement: "ক্ষ" },
  { pattern: /^cch/i, replacement: "চ্ছ" },
  { pattern: /^chh/i, replacement: "ছ" },
  { pattern: /^ch/i, replacement: "চ" },
  { pattern: /^kh/i, replacement: "খ" },
  { pattern: /^gh/i, replacement: "ঘ" },
  { pattern: /^ng/i, replacement: "ঙ" },
  { pattern: /^jh/i, replacement: "ঝ" },
  { pattern: /^th/i, replacement: "থ" },
  { pattern: /^dh/i, replacement: "ধ" },
  { pattern: /^bh/i, replacement: "ভ" },
  { pattern: /^ph/i, replacement: "ফ" },
  { pattern: /^sh/i, replacement: "শ" },
  { pattern: /^zh/i, replacement: "ঝ" },
  // Single consonants
  { pattern: /^k/i, replacement: "ক" },
  { pattern: /^g/i, replacement: "গ" },
  { pattern: /^j/i, replacement: "জ" },
  { pattern: /^t/i, replacement: "ট" },
  { pattern: /^d/i, replacement: "ড" },
  { pattern: /^n/i, replacement: "ন" },
  { pattern: /^p/i, replacement: "প" },
  { pattern: /^f/i, replacement: "ফ" },
  { pattern: /^b/i, replacement: "ব" },
  { pattern: /^v/i, replacement: "ভ" },
  { pattern: /^m/i, replacement: "ম" },
  { pattern: /^r/i, replacement: "র" },
  { pattern: /^l/i, replacement: "ল" },
  { pattern: /^s/i, replacement: "স" },
  { pattern: /^h/i, replacement: "হ" },
  { pattern: /^y/i, replacement: "য়" },
  { pattern: /^w/i, replacement: "ও" },
  { pattern: /^z/i, replacement: "জ" },
  { pattern: /^q/i, replacement: "ক" },
  { pattern: /^x/i, replacement: "ক্স" },
  { pattern: /^c/i, replacement: "ক" },
];

const BANGLISH_VOWELS: { [key: string]: { independent: string; kar: string } } = {
  aa: { independent: "আ", kar: "া" },
  ee: { independent: "ঈ", kar: "ী" },
  oo: { independent: "ঊ", kar: "ূ" },
  oi: { independent: "ঐ", kar: "ৈ" },
  ou: { independent: "ঔ", kar: "ৌ" },
  au: { independent: "ঔ", kar: "ৌ" },
  ai: { independent: "আই", kar: "াই" },
  a: { independent: "আ", kar: "া" },
  e: { independent: "এ", kar: "ে" },
  i: { independent: "ই", kar: "ি" },
  o: { independent: "ও", kar: "ো" },
  u: { independent: "উ", kar: "ু" },
};

/**
 * Phonetically transliterates a Romanized Banglish word into Bengali characters.
 * E.g. "modhu" -> "মধু", "chador" -> "চাদর", "khelna" -> "খেলনা"
 */
export function transliterateBanglishToBangla(word: string): string {
  let remaining = word.toLowerCase().trim();
  let result = "";
  let lastWasConsonant = false;

  while (remaining.length > 0) {
    // 1. Try multi-character vowels first
    let vowelMatch: { length: number; independent: string; kar: string } | null = null;
    for (const vKey of ["aa", "ee", "oo", "oi", "ou", "au", "ai", "a", "e", "i", "o", "u"]) {
      if (remaining.startsWith(vKey)) {
        vowelMatch = {
          length: vKey.length,
          independent: BANGLISH_VOWELS[vKey].independent,
          kar: BANGLISH_VOWELS[vKey].kar,
        };
        break;
      }
    }

    if (vowelMatch) {
      if (lastWasConsonant) {
        // If 'a' or 'o' follows a consonant, in Bengali default inherent vowel is often omitted or marked with kar
        result += vowelMatch.kar;
      } else {
        result += vowelMatch.independent;
      }
      remaining = remaining.slice(vowelMatch.length);
      lastWasConsonant = false;
      continue;
    }

    // 2. Try consonants
    let consonantMatched = false;
    for (const rule of BANGLISH_CONSONANT_RULES) {
      const match = remaining.match(rule.pattern);
      if (match) {
        result += rule.replacement;
        remaining = remaining.slice(match[0].length);
        lastWasConsonant = true;
        consonantMatched = true;
        break;
      }
    }

    if (consonantMatched) continue;

    // 3. Fallback for spaces, numbers, symbols
    result += remaining[0];
    remaining = remaining.slice(1);
    lastWasConsonant = false;
  }

  return result;
}

// ── 5. Reverse Transliteration (Bengali -> Banglish) ──────────────────────────

const BANGLA_TO_ROMAN_MAP: { [key: string]: string } = {
  // Independent vowels
  অ: "o",
  আ: "a",
  ই: "i",
  ঈ: "ee",
  উ: "u",
  ঊ: "oo",
  ঋ: "ri",
  এ: "e",
  ঐ: "oi",
  ও: "o",
  ঔ: "ou",
  // Kar signs
  "া": "a",
  "ি": "i",
  "ী": "i",
  "ু": "u",
  "ূ": "u",
  "ৃ": "ri",
  "ে": "e",
  "ৈ": "oi",
  "ো": "o",
  "ৌ": "ou",
  // Consonants
  ক: "k",
  খ: "kh",
  গ: "g",
  ঘ: "gh",
  ঙ: "ng",
  চ: "ch",
  ছ: "chh",
  জ: "j",
  ঝ: "jh",
  ঞ: "n",
  ট: "t",
  ঠ: "th",
  ড: "d",
  ঢ: "dh",
  ণ: "n",
  ত: "t",
  থ: "th",
  দ: "d",
  ধ: "dh",
  ন: "n",
  প: "p",
  ফ: "f",
  ব: "b",
  ভ: "bh",
  ম: "m",
  য: "j",
  র: "r",
  ল: "l",
  শ: "sh",
  ষ: "sh",
  স: "s",
  হ: "h",
  ড়: "r",
  ঢ়: "rh",
  য়: "y",
  ৎ: "t",
  // Diacritics
  "ং": "ng",
  "ঃ": "h",
  "ঁ": "",
  "্": "",
};

export function romanizeBanglaToLatin(banglaText: string): string {
  let roman = "";
  for (let i = 0; i < banglaText.length; i++) {
    const ch = banglaText[i];
    if (BANGLA_TO_ROMAN_MAP[ch] !== undefined) {
      roman += BANGLA_TO_ROMAN_MAP[ch];
    } else if (/[a-zA-Z0-9\s]/.test(ch)) {
      roman += ch;
    }
  }
  return roman.toLowerCase().trim();
}

// ── 6. Query Expansion & Full Engine ──────────────────────────────────────────

/**
 * Given any search string (Bangla, Banglish, or English),
 * returns all expanded keywords, synonyms, and transliterated terms.
 */
export function expandSearchTerms(rawQuery: string): ExpandedSearch {
  const query = rawQuery.trim();
  if (!query) {
    return { original: "", detectedType: "english", terms: [] };
  }

  const detectedType = detectScriptType(query);
  const termsSet = new Set<string>();
  const lowerQuery = query.toLowerCase();

  // Always include the original trimmed query
  termsSet.add(query);
  if (lowerQuery !== query) {
    termsSet.add(lowerQuery);
  }

  // Tokenize words
  const words = query
    .split(/[\s,+/_-]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);

  let primaryHint: TranslationHint | undefined;

  // ── Step A: Dictionary Matching (Full query & individual phrases) ────────
  for (const entry of TRILINGUAL_DICTIONARY) {
    let matched = false;

    // Check if query matches or is matched by entry's lists
    const matchesBangla = entry.bangla.some(
      (b) => lowerQuery.includes(b.toLowerCase()) || b.toLowerCase().includes(lowerQuery)
    );
    const matchesBanglish = entry.banglish.some(
      (bg) => lowerQuery.includes(bg) || bg.includes(lowerQuery)
    );
    const matchesEnglish = entry.english.some(
      (en) => lowerQuery.includes(en.toLowerCase()) || en.toLowerCase().includes(lowerQuery)
    );

    if (matchesBangla || matchesBanglish || matchesEnglish) {
      matched = true;
    } else {
      // Check if individual tokens match
      for (const token of words) {
        if (token.length < 2) continue;
        const tokenLower = token.toLowerCase();
        if (
          entry.bangla.some((b) => b.includes(token)) ||
          entry.banglish.some((bg) => bg === tokenLower || bg.includes(tokenLower)) ||
          entry.english.some((en) => en.toLowerCase() === tokenLower || en.toLowerCase().includes(tokenLower))
        ) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      // Add all equivalents from this dictionary entry
      entry.bangla.forEach((b) => {
        termsSet.add(b);
        getBanglaVariants(b).forEach((v) => termsSet.add(v));
      });
      entry.banglish.forEach((bg) => termsSet.add(bg));
      entry.english.forEach((en) => termsSet.add(en));

      // Record first matched entry as display hint
      if (!primaryHint) {
        primaryHint = {
          bangla: entry.bangla[0],
          english: entry.english[0],
          banglish: entry.banglish[0],
        };
      }
    }
  }

  // ── Step B: Algorithmic Transliterations ─────────────────────────────────
  if (detectedType === "banglish" || detectedType === "english" || detectedType === "mixed") {
    // 1. Whole query transliteration
    const wholeTranslit = transliterateBanglishToBangla(query);
    if (wholeTranslit && isBanglaText(wholeTranslit)) {
      termsSet.add(wholeTranslit);
      getBanglaVariants(wholeTranslit).forEach((v) => termsSet.add(v));
    }

    // 2. Individual word transliteration
    for (const w of words) {
      if (w.length >= 2 && !isBanglaText(w)) {
        const wordTranslit = transliterateBanglishToBangla(w);
        if (wordTranslit && isBanglaText(wordTranslit)) {
          termsSet.add(wordTranslit);
          getBanglaVariants(wordTranslit).forEach((v) => termsSet.add(v));
        }
      }
    }
  }

  if (detectedType === "bangla" || detectedType === "mixed") {
    // 1. Whole query romanization
    const wholeRoman = romanizeBanglaToLatin(query);
    if (wholeRoman && wholeRoman.length >= 2) {
      termsSet.add(wholeRoman);
    }

    // 2. Individual word romanization & variants
    for (const w of words) {
      if (isBanglaText(w)) {
        const roman = romanizeBanglaToLatin(w);
        if (roman && roman.length >= 2) {
          termsSet.add(roman);
        }
        getBanglaVariants(w).forEach((v) => termsSet.add(v));
      }
    }
  }

  // ── Step C: Normalization Cleanup & Final Terms ──────────────────────────
  const finalTerms: string[] = [];
  termsSet.forEach((t) => {
    const trimmed = t.trim();
    if (trimmed.length > 0 && !finalTerms.includes(trimmed)) {
      finalTerms.push(trimmed);
    }
  });

  return {
    original: query,
    detectedType,
    terms: finalTerms,
    primaryHint,
  };
}
