// Simple referral code validation
export function validateReferralCode(code: string): boolean {
  // Format: SLEEP-XXX (any 3+ characters after SLEEP-)
  const referralPattern = /^SLEEP-[A-Z0-9]{3,}$/;
  return referralPattern.test(code.toUpperCase());
}

export function generateReferralCode(name: string): string {
  // Generate a simple code from name
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `SLEEP-${cleanName || random}`;
}

export function getShareableReferralLink(referralCode: string): string {
  return `${window.location.origin}?ref=${referralCode}`;
}

export const REFERRAL_DISCOUNT_PERCENT = 10;
