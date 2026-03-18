// Import vendor logos
import junaidtech from '../assets/vender_logos/junaidtech.avif';
import techarc from '../assets/vender_logos/techarcpk-logo.png';
import techmatched from '../assets/vender_logos/techmatched.svg';
import walistech from '../assets/vender_logos/walistech.png';
import zahcomputers from '../assets/vender_logos/Zahcomputers.png';

const vendorLogoMap: Record<string, string> = {
  'Junaid Tech': junaidtech,
  'Tech Arc PK': techarc,
  'Tech matched': techmatched,
  'Walis Tech': walistech,
  'Zah Computers': zahcomputers,
  // Add lowercase/slug variants for flexibility
  'junaidtech': junaidtech,
  'techarcpk': techarc,
  'techmatched': techmatched,
  'walistech': walistech,
  'zahcomputers': zahcomputers,
  // Add common database variations
  'junaid tech': junaidtech,
  'tech arc': techarc,
  'tech matched': techmatched,
  'walis tech': walistech,
  'zah computers': zahcomputers,
};

export function getVendorLogo(vendorName: string): string | null {
  if (!vendorName) return null;
  const normalized = vendorName.trim();
  
  // Try exact match
  if (vendorLogoMap[normalized]) return vendorLogoMap[normalized];
  
  // Try case-insensitive match
  const lower = normalized.toLowerCase();
  if (vendorLogoMap[lower]) return vendorLogoMap[lower];
  
  // Try partial matches for common variations
  if (lower.includes('junaid')) return junaidtech;
  if (lower.includes('arc')) return techarc;
  if (lower.includes('matched')) return techmatched;
  if (lower.includes('walis') || lower.includes('wali')) return walistech;
  if (lower.includes('zah')) return zahcomputers;

  return null;
}
