/**
 * The API names places in English (and sometimes misspells them). These are their Persian names.
 * Keys are lower-case; unknown places fall back to the name the API sent.
 */
const persianPlaceNames: Record<string, string> = {
  tehran: "تهران",
  sanandaj: "سنندج",
  sananndaj: "سنندج",
  madrid: "مادرید",
  isfahan: "اصفهان",
  esfahan: "اصفهان",
  sulaymaniyah: "سلیمانیه",
  hewler: "اربیل",
  erbil: "اربیل",
  mazandaran: "مازندران",
  gilan: "گیلان",
  italy: "ایتالیا",
  yazd: "یزد",
  shiraz: "شیراز",
  kish: "کیش",
  mashhad: "مشهد",
  istanbul: "استانبول",
};

export function toPersianPlaceName(name: string) {
  return persianPlaceNames[name.trim().toLowerCase()] ?? name;
}
