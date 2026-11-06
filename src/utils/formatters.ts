import { InstallmentItem } from '../types';

/**
 * Format currency into readable Pakistani denomination (Crore, Lakh, Thousand)
 */
export function formatPKR(amount: number, lang: 'en' | 'ur' = 'en'): string {
  if (isNaN(amount)) return lang === 'ur' ? '0 روپے' : 'Rs 0';
  
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (lang === 'ur') {
    if (abs >= 10000000) {
      const crore = (abs / 10000000).toFixed(2).replace(/\.?0+$/, '');
      return `${sign}${crore} کروڑ روپے`;
    }
    if (abs >= 100000) {
      const lakh = (abs / 100000).toFixed(2).replace(/\.?0+$/, '');
      return `${sign}${lakh} لاکھ روپے`;
    }
    if (abs >= 1000) {
      const thousand = (abs / 1000).toFixed(1).replace(/\.?0+$/, '');
      return `${sign}${thousand} ہزار روپے`;
    }
    return `${sign}${abs.toLocaleString()} روپے`;
  }

  // English format
  if (abs >= 10000000) {
    const crore = (abs / 10000000).toFixed(2).replace(/\.?0+$/, '');
    return `${sign}Rs ${crore} Crore`;
  }
  if (abs >= 100000) {
    const lakh = (abs / 100000).toFixed(2).replace(/\.?0+$/, '');
    return `${sign}Rs ${lakh} Lakh`;
  }
  return `${sign}Rs ${abs.toLocaleString()}`;
}

/**
 * Convert number into English words standard for Pakistani receipts
 */
export function numberToWordsPKR(amount: number): string {
  if (amount === 0) return 'Rupees Zero Only';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertHundreds(n: number): string {
    let str = '';
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      str += teens[n - 10] + ' ';
    } else if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      if (n % 10 > 0) {
        str += units[n % 10] + ' ';
      }
    } else if (n > 0) {
      str += units[n] + ' ';
    }
    return str.trim();
  }

  let crore = Math.floor(amount / 10000000);
  let remainder = amount % 10000000;

  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  let thousand = Math.floor(remainder / 1000);
  let hundreds = remainder % 1000;

  const parts: string[] = [];

  if (crore > 0) {
    parts.push(`${convertHundreds(crore)} Crore`);
  }
  if (lakh > 0) {
    parts.push(`${convertHundreds(lakh)} Lakh`);
  }
  if (thousand > 0) {
    parts.push(`${convertHundreds(thousand)} Thousand`);
  }
  if (hundreds > 0) {
    parts.push(convertHundreds(hundreds));
  }

  return `Rupees ${parts.join(' ')} Only`.replace(/\s+/g, ' ');
}

/**
 * Calculate automated installment schedule from total, advance, count and frequency
 */
export function calculateInstallmentSchedule(
  totalPricePkr: number,
  advancePkr: number,
  installmentsCount: number,
  frequency: 'monthly' | 'quarterly',
  startDateStr: string
): InstallmentItem[] {
  if (installmentsCount <= 0) return [];
  const remaining = Math.max(0, totalPricePkr - advancePkr);
  const installmentAmount = Math.round(remaining / installmentsCount);
  const items: InstallmentItem[] = [];

  const baseDate = new Date(startDateStr || new Date().toISOString().split('T')[0]);
  const monthStep = frequency === 'quarterly' ? 3 : 1;

  for (let i = 1; i <= installmentsCount; i++) {
    const dueDate = new Date(baseDate);
    dueDate.setMonth(baseDate.getMonth() + i * monthStep);

    items.push({
      installmentNumber: i,
      dueDate: dueDate.toISOString().split('T')[0],
      amountPkr: installmentAmount,
      status: 'pending',
    });
  }

  return items;
}

/**
 * Calculate KYC verification percentage (0 - 100%)
 */
export function calculateKycProgress(kyc: {
  cnicVerified: boolean;
  photoVerified: boolean;
  sourceOfFundsVerified: boolean;
}): number {
  let score = 0;
  if (kyc.cnicVerified) score += 40;
  if (kyc.photoVerified) score += 30;
  if (kyc.sourceOfFundsVerified) score += 30;
  return score;
}

/**
 * Calculate commission split
 */
export function calculateCommissionSplit(
  dealAmount: number,
  commissionRatePercent: number,
  agentSharePercent: number
): { totalCommission: number; agentAmount: number; companyAmount: number } {
  const totalCommission = Math.round(dealAmount * (commissionRatePercent / 100));
  const agentAmount = Math.round(totalCommission * (agentSharePercent / 100));
  const companyAmount = totalCommission - agentAmount;
  return { totalCommission, agentAmount, companyAmount };
}

/**
 * Area converter for Marla / Kanal / Sq Ft
 * In Pakistan, 1 Kanal = 20 Marla, 1 Marla ≈ 225 or 272 sq ft (standard 225 in modern housing schemes like DHA)
 */
export function formatArea(sizeMarla: number, unit: 'marla' | 'kanal' | 'sqft' = 'marla', lang: 'en' | 'ur' = 'en'): string {
  if (unit === 'kanal') {
    const kanal = (sizeMarla / 20).toFixed(2).replace(/\.00$/, '');
    return lang === 'ur' ? `${kanal} کنال` : `${kanal} Kanal`;
  }
  if (unit === 'sqft') {
    const sqft = Math.round(sizeMarla * 225).toLocaleString();
    return lang === 'ur' ? `${sqft} مربع فٹ` : `${sqft} Sq Ft`;
  }
  return lang === 'ur' ? `${sizeMarla} مرلہ` : `${sizeMarla} Marla`;
}
