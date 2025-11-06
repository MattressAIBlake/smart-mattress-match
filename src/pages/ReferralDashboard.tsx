import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ReferralCard } from "@/components/ReferralCard";
import { toast } from "sonner";
import { generateReferralCode } from "@/lib/referralUtils";

export default function ReferralDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    loadReferralData();
  }, []);
  
  const loadReferralData = async () => {
    try {
      // For demo purposes, using email from localStorage or creating new profile
      const userEmail = localStorage.getItem('user_email') || prompt("Enter your email to access referral dashboard:");
      if (!userEmail) return;
      
      setEmail(userEmail);
      localStorage.setItem('user_email', userEmail);
      
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', userEmail)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      if (!existingProfile) {
        // Create new profile
        const referralCode = generateReferralCode(userEmail);
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            email: userEmail,
            referral_code: referralCode,
            reward_balance: 0,
            total_referrals: 0
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        setProfile(newProfile);
      } else {
        setProfile(existingProfile);
        
        // Load transactions
        const { data: txData } = await supabase
          .from('referral_transactions')
          .select('*')
          .eq('referrer_code', existingProfile.referral_code)
          .order('created_at', { ascending: false });
        
        setTransactions(txData || []);
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading your referral dashboard...</p>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Failed to load profile. Please try again.</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Referral Dashboard</h1>
            <p className="text-muted-foreground">Share the love and earn rewards</p>
          </div>
          
          <ReferralCard
            referralCode={profile.referral_code}
            rewardBalance={profile.reward_balance}
            totalReferrals={profile.total_referrals}
          />
          
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile.total_referrals}</p>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${profile.reward_balance.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-500/10">
                  <Gift className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{transactions.filter(t => t.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">Pending Rewards</p>
                </div>
              </div>
            </Card>
          </div>
          
          {transactions.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Referral History</h2>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{tx.referee_email}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                        {tx.status}
                      </Badge>
                      <p className="font-semibold">${tx.reward_amount.toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          <Card className="p-6 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5">
            <h3 className="text-lg font-semibold mb-2">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Share your unique referral code with friends</li>
              <li>They save $100 on their first mattress purchase</li>
              <li>You receive $100 credit when they complete their order</li>
              <li>Use your credits on any future purchase</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
