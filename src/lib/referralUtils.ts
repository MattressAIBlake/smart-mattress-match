export function generateReferralCode(email: string): string {
  const username = email.split('@')[0].toUpperCase().slice(0, 6);
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SLEEP-${username}-${randomSuffix}`;
}

export function generateRedemptionCode(): string {
  return `REWARD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

export function validateReferralCode(code: string): boolean {
  // Validate format: SLEEP-XXX-XXX
  return /^SLEEP-[A-Z0-9]{1,6}-[A-Z0-9]{4}$/.test(code);
}

export function getShareableReferralLink(referralCode: string): string {
  return `${window.location.origin}?ref=${referralCode}`;
}

export const REFERRAL_REWARD_AMOUNT = 50;

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
