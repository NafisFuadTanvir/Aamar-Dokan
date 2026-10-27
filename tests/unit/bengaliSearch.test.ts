import { describe, it, expect } from "vitest";
import {
  isBanglaText,
  isLatinText,
  detectScriptType,
  normalizeBangla,
  getBanglaVariants,
  transliterateBanglishToBangla,
  romanizeBanglaToLatin,
  expandSearchTerms,
} from "@/lib/search/bengaliSearch";

describe("Bengali, Banglish & English Search Engine", () => {
  describe("Script detection", () => {
    it("detects Bengali script properly", () => {
      expect(isBanglaText("মধু")).toBe(true);
      expect(isBanglaText("সরিষার তেল")).toBe(true);
      expect(isBanglaText("honey")).toBe(false);
      expect(isBanglaText("modhu")).toBe(false);
    });

    it("detects Latin text properly", () => {
      expect(isLatinText("honey")).toBe(true);
      expect(isLatinText("modhu")).toBe(true);
      expect(isLatinText("মধু")).toBe(false);
    });

    it("classifies query script types", () => {
      expect(detectScriptType("মধু")).toBe("bangla");
      expect(detectScriptType("honey")).toBe("english");
      expect(detectScriptType("modhu")).toBe("banglish");
      expect(detectScriptType("sundarban মধু")).toBe("mixed");
    });
  });

  describe("Spelling and diacritic normalization", () => {
    it("normalizes Bengali characters and handles variations", () => {
      expect(normalizeBangla("খাঁটি")).toBe("খাটি");
      expect(normalizeBangla("কালোজিড়া")).toBe("কালোজিরা");
      expect(normalizeBangla("নকশী")).toBe("নকশি");
    });

    it("generates variants for words with and without chandrabindu", () => {
      const khatiVariants = getBanglaVariants("খাটি");
      expect(khatiVariants).toContain("খাঁটি");
      expect(khatiVariants).toContain("খাটি");

      const kanthaVariants = getBanglaVariants("নকশিকাঁথা");
      expect(kanthaVariants).toContain("নকশিকাথা");
    });
  });

  describe("Banglish -> Bengali phonetic transliteration", () => {
    it("transliterates Banglish phonetic patterns to Bengali characters", () => {
      const res = transliterateBanglishToBangla("modhu");
      expect(res).toContain("মধু");

      const resChador = transliterateBanglishToBangla("chador");
      expect(resChador).toContain("চাদর");

      const resJuta = transliterateBanglishToBangla("juta");
      expect(resJuta).toContain("জুতা");
    });
  });

  describe("Bengali -> Banglish reverse romanization", () => {
    it("romanizes Bengali words to Latin characters", () => {
      expect(romanizeBanglaToLatin("মধু")).toBe("modhu");
      expect(romanizeBanglaToLatin("তেল")).toBe("tel");
      expect(romanizeBanglaToLatin("ঘি")).toBe("ghi");
    });
  });

  describe("Comprehensive Query Expansion", () => {
    it("expands Banglish 'modhu' to Bengali 'মধু' and English 'honey'", () => {
      const expanded = expandSearchTerms("modhu");
      expect(expanded.terms).toContain("মধু");
      expect(expanded.terms).toContain("honey");
      expect(expanded.primaryHint?.bangla).toBe("মধু");
      expect(expanded.primaryHint?.english).toBe("honey");
    });

    it("expands English 'honey' to Bengali 'মধু' and Banglish 'modhu'", () => {
      const expanded = expandSearchTerms("honey");
      expect(expanded.terms).toContain("মধু");
      expect(expanded.terms).toContain("modhu");
    });

    it("expands Bengali 'মধু' to English 'honey' and Banglish 'modhu'", () => {
      const expanded = expandSearchTerms("মধু");
      expect(expanded.terms).toContain("honey");
      expect(expanded.terms).toContain("modhu");
    });

    it("handles 'mustard oil' and 'shorisha tel'", () => {
      const expandedEnglish = expandSearchTerms("mustard oil");
      expect(expandedEnglish.terms).toContain("সরিষার তেল");
      expect(expandedEnglish.terms).toContain("shorishar tel");

      const expandedBanglish = expandSearchTerms("sorisha");
      expect(expandedBanglish.terms).toContain("সরিষা");
      expect(expandedBanglish.terms).toContain("mustard");
    });

    it("handles 'nakshi kantha' in Bengali, Banglish and English", () => {
      const expandedBanglish = expandSearchTerms("nokshi kantha");
      expect(expandedBanglish.terms).toContain("নকশিকাঁথা");
      expect(expandedBanglish.terms).toContain("quilt");

      const expandedEnglish = expandSearchTerms("quilt");
      expect(expandedEnglish.terms).toContain("নকশিকাঁথা");

      const expandedBangla = expandSearchTerms("নকশিকাঁথা");
      expect(expandedBangla.terms).toContain("nakshi kantha");
    });

    it("handles 'kalo jira' / 'black seed'", () => {
      const expanded = expandSearchTerms("kalo jira");
      expect(expanded.terms).toContain("কালোজিরা");
      expect(expanded.terms).toContain("black seed");
    });

    it("handles 'ghee' / 'ঘি'", () => {
      const expanded = expandSearchTerms("ghee");
      expect(expanded.terms).toContain("ঘি");
    });

    it("handles 'panjabi' / 'পাঞ্জাবি'", () => {
      const expanded = expandSearchTerms("panjabi");
      expect(expanded.terms).toContain("পাঞ্জাবি");
    });

    it("handles 'juta' / 'shoe'", () => {
      const expanded = expandSearchTerms("juta");
      expect(expanded.terms).toContain("জুতা");
      expect(expanded.terms).toContain("shoe");
    });
  });
});
