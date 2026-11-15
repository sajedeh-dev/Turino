/** Iranian national code (کد ملی): 10 digits with a mod-11 check digit. */
export function isValidNationalCode(value: string) {
  if (!/^\d{10}$/.test(value) || /^(\d)\1{9}$/.test(value)) return false;
  const digits = [...value].map(Number);
  const sum = digits.slice(0, 9).reduce((total, digit, index) => total + digit * (10 - index), 0);
  const remainder = sum % 11;
  const check = digits[9];
  return remainder < 2 ? check === remainder : check === 11 - remainder;
}

/** Iranian IBAN (شبا): "IR" + 24 digits, valid under ISO 13616 mod-97. */
export function isValidShaba(value: string) {
  const iban = value.replace(/\s/g, "").toUpperCase();
  if (!/^IR\d{24}$/.test(iban)) return false;
  // Move the country code and check digits to the end; I=18, R=27.
  const rearranged = `${iban.slice(4)}1827${iban.slice(2, 4)}`;
  let remainder = 0;
  for (const char of rearranged) remainder = (remainder * 10 + Number(char)) % 97;
  return remainder === 1;
}

/** Bank card number: 16 digits passing the Luhn check. */
export function isValidCardNumber(value: string) {
  const digits = value.replace(/[\s-]/g, "");
  if (!/^\d{16}$/.test(digits)) return false;
  let sum = 0;
  for (let index = 0; index < 16; index++) {
    let digit = Number(digits[index]);
    if (index % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}
