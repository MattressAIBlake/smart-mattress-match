export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      mattress_comparisons: {
        Row: {
          compared_products: Json
          created_at: string | null
          id: string
          personal_note: string | null
          profile_data: Json
          sender_email: string | null
          sender_name: string | null
          views_count: number | null
        }
        Insert: {
          compared_products: Json
          created_at?: string | null
          id?: string
          personal_note?: string | null
          profile_data: Json
          sender_email?: string | null
          sender_name?: string | null
          views_count?: number | null
        }
        Update: {
          compared_products?: Json
          created_at?: string | null
          id?: string
          personal_note?: string | null
          profile_data?: Json
          sender_email?: string | null
          sender_name?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      referral_transactions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          order_id: string | null
          referee_email: string
          referrer_code: string
          reward_amount: number
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          referee_email: string
          referrer_code: string
          reward_amount: number
          status: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          referee_email?: string
          referrer_code?: string
          reward_amount?: number
          status?: string
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          amount: number
          created_at: string | null
          expires_at: string
          id: string
          redemption_code: string
          status: string
          used_at: string | null
          user_email: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          expires_at: string
          id?: string
          redemption_code: string
          status: string
          used_at?: string | null
          user_email: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          expires_at?: string
          id?: string
          redemption_code?: string
          status?: string
          used_at?: string | null
          user_email?: string
        }
        Relationships: []
      }
      sleep_profiles: {
        Row: {
          conversation_summary: string | null
          created_at: string | null
          id: string
          profile_data: Json
          recommended_products: Json | null
          share_count: number | null
        }
        Insert: {
          conversation_summary?: string | null
          created_at?: string | null
          id?: string
          profile_data: Json
          recommended_products?: Json | null
          share_count?: number | null
        }
        Update: {
          conversation_summary?: string | null
          created_at?: string | null
          id?: string
          profile_data?: Json
          recommended_products?: Json | null
          share_count?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          referral_code: string
          referred_by_code: string | null
          reward_balance: number | null
          total_referrals: number | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          referral_code: string
          referred_by_code?: string | null
          reward_balance?: number | null
          total_referrals?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          referral_code?: string
          referred_by_code?: string | null
          reward_balance?: number | null
          total_referrals?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      viral_metrics: {
        Row: {
          avg_referrals_per_user: number | null
          profiles_shared: number | null
          total_profiles_created: number | null
          total_referrals_completed: number | null
          total_referrers: number | null
          total_shares: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      increment_share_count: {
        Args: { profile_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
