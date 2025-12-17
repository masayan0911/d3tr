export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          target_weight: number | null;
          target_distance: number;
          start_weight: number | null;
          start_distance: number | null;
          start_date: string | null;
          target_calories: number;
          kg_to_yd_ratio: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          target_weight?: number | null;
          target_distance?: number;
          start_weight?: number | null;
          start_distance?: number | null;
          start_date?: string | null;
          target_calories?: number;
          kg_to_yd_ratio?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          target_weight?: number | null;
          target_distance?: number;
          start_weight?: number | null;
          start_distance?: number | null;
          start_date?: string | null;
          target_calories?: number;
          kg_to_yd_ratio?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      weight_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          weight: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          weight: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          weight?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          food_name: string;
          calories: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          food_name: string;
          calories: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          food_name?: string;
          calories?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      food_templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          calories: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          calories: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          calories?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type User = Database['public']['Tables']['users']['Row'];
export type WeightLog = Database['public']['Tables']['weight_logs']['Row'];
export type Meal = Database['public']['Tables']['meals']['Row'];
export type FoodTemplate = Database['public']['Tables']['food_templates']['Row'];
export type MealType = Meal['meal_type'];
