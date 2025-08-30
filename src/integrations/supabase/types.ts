export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      challenge_progress: {
        Row: {
          amount: number
          challenge_id: string
          created_at: string
          date: string
          id: string
          notes: string | null
        }
        Insert: {
          amount: number
          challenge_id: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
        }
        Update: {
          amount?: number
          challenge_id?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "savings_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      extra_income: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          notes: string | null
          source: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          source: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          auto_allocation_percentage: number | null
          created_at: string
          current_savings: number
          deadline: string | null
          frequency: string
          goal_type: string | null
          id: string
          is_emergency_fund: boolean
          name: string
          target_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_allocation_percentage?: number | null
          created_at?: string
          current_savings?: number
          deadline?: string | null
          frequency?: string
          goal_type?: string | null
          id?: string
          is_emergency_fund?: boolean
          name: string
          target_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_allocation_percentage?: number | null
          created_at?: string
          current_savings?: number
          deadline?: string | null
          frequency?: string
          goal_type?: string | null
          id?: string
          is_emergency_fund?: boolean
          name?: string
          target_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investment_preferences: {
        Row: {
          created_at: string
          emergency_fund_months: number | null
          id: string
          investment_horizon: number | null
          preferred_categories: string[] | null
          risk_tolerance: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emergency_fund_months?: number | null
          id?: string
          investment_horizon?: number | null
          preferred_categories?: string[] | null
          risk_tolerance?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emergency_fund_months?: number | null
          id?: string
          investment_horizon?: number | null
          preferred_categories?: string[] | null
          risk_tolerance?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          priority: string
          scheduled_for: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          priority?: string
          scheduled_for?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          priority?: string
          scheduled_for?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          emergency_fund_target: number | null
          employment_category: string
          id: string
          life_stage: string | null
          monthly_income: number | null
          name: string
          scholarship_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          emergency_fund_target?: number | null
          employment_category: string
          id: string
          life_stage?: string | null
          monthly_income?: number | null
          name: string
          scholarship_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          emergency_fund_target?: number | null
          employment_category?: string
          id?: string
          life_stage?: string | null
          monthly_income?: number | null
          name?: string
          scholarship_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          amount: number | null
          created_at: string
          due_date: string
          frequency: string | null
          id: string
          is_recurring: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          due_date: string
          frequency?: string | null
          id?: string
          is_recurring?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          due_date?: string
          frequency?: string | null
          id?: string
          is_recurring?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      savings_challenges: {
        Row: {
          completed: boolean
          created_at: string
          current_streak: number
          duration_weeks: number
          end_date: string | null
          frequency: string
          id: string
          start_date: string
          target_amount: number
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          current_streak?: number
          duration_weeks?: number
          end_date?: string | null
          frequency: string
          id?: string
          start_date?: string
          target_amount: number
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          current_streak?: number
          duration_weeks?: number
          end_date?: string | null
          frequency?: string
          id?: string
          start_date?: string
          target_amount?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      utility_payments: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          payment_date: string
          provider_name: string
          razorpay_payment_id: string | null
          status: string
          user_id: string
          utility_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          provider_name: string
          razorpay_payment_id?: string | null
          status?: string
          user_id: string
          utility_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          provider_name?: string
          razorpay_payment_id?: string | null
          status?: string
          user_id?: string
          utility_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
