import { supabase } from "@/integrations/supabase/client";

export interface SleepProfile {
  sleepPosition: string;
  firmness: string;
  temperaturePreference: string;
  supportNeeds: string[];
  recommendedProducts: any[];
  profileIcon: string;
}

export function analyzeChatForProfile(messages: any[]): SleepProfile {
  const conversationText = messages.map(m => m.content).join(' ').toLowerCase();
  
  // Detect sleep position
  let sleepPosition = 'Side Sleeper';
  if (conversationText.includes('back sleeper') || conversationText.includes('sleep on my back')) {
    sleepPosition = 'Back Sleeper';
  } else if (conversationText.includes('stomach sleeper') || conversationText.includes('sleep on stomach')) {
    sleepPosition = 'Stomach Sleeper';
  } else if (conversationText.includes('combination sleeper') || conversationText.includes('all positions')) {
    sleepPosition = 'Combo Sleeper';
  }
  
  // Detect firmness preference
  let firmness = 'Medium';
  if (conversationText.includes('soft') || conversationText.includes('plush')) {
    firmness = 'Soft';
  } else if (conversationText.includes('firm') || conversationText.includes('hard')) {
    firmness = 'Firm';
  } else if (conversationText.includes('medium-firm')) {
    firmness = 'Medium-Firm';
  }
  
  // Detect temperature preference
  let temperaturePreference = 'Neutral';
  if (conversationText.includes('hot sleeper') || conversationText.includes('run hot') || conversationText.includes('overheat')) {
    temperaturePreference = 'Hot Sleeper';
  } else if (conversationText.includes('cold sleeper') || conversationText.includes('run cold')) {
    temperaturePreference = 'Cold Sleeper';
  }
  
  // Detect support needs
  const supportNeeds: string[] = [];
  if (conversationText.includes('back pain') || conversationText.includes('lower back')) {
    supportNeeds.push('Back Support');
  }
  if (conversationText.includes('pressure relief') || conversationText.includes('shoulder pain')) {
    supportNeeds.push('Pressure Relief');
  }
  if (conversationText.includes('motion isolation') || conversationText.includes('partner')) {
    supportNeeds.push('Motion Isolation');
  }
  if (conversationText.includes('edge support')) {
    supportNeeds.push('Edge Support');
  }
  
  // Choose icon based on sleep position
  const iconMap: { [key: string]: string } = {
    'Side Sleeper': '🛏️',
    'Back Sleeper': '😴',
    'Stomach Sleeper': '💤',
    'Combo Sleeper': '🔄'
  };
  
  return {
    sleepPosition,
    firmness,
    temperaturePreference,
    supportNeeds: supportNeeds.length > 0 ? supportNeeds : ['General Comfort'],
    recommendedProducts: [],
    profileIcon: iconMap[sleepPosition] || '🛏️'
  };
}

export async function saveSleepProfile(profile: SleepProfile, conversationSummary: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('sleep_profiles')
      .insert({
        profile_data: profile as any,
        conversation_summary: conversationSummary,
        recommended_products: profile.recommendedProducts as any
      } as any)
      .select('id')
      .single();
    
    if (error) throw error;
    return (data as any)?.id || null;
  } catch (error) {
    console.error('Failed to save sleep profile:', error);
    return null;
  }
}

export async function incrementShareCount(profileId: string) {
  try {
    await (supabase.rpc as any)('increment_share_count', { profile_id: profileId });
  } catch (error) {
    console.error('Failed to increment share count:', error);
  }
}
