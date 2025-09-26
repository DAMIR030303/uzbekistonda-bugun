import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          domain: string | null
          logo_url: string | null
          theme_colors: any
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          domain?: string | null
          logo_url?: string | null
          theme_colors?: any
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          domain?: string | null
          logo_url?: string | null
          theme_colors?: any
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      branches: {
        Row: {
          id: string
          organization_id: string
          name: string
          slug: string
          address: string | null
          phone: string | null
          email: string | null
          manager_id: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          slug: string
          address?: string | null
          phone?: string | null
          email?: string | null
          manager_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          slug?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          manager_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          organization_id: string
          branch_id: string | null
          first_name: string
          last_name: string
          avatar_url: string | null
          phone: string | null
          role: string
          permissions: any
          status: string
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id: string
          branch_id?: string | null
          first_name: string
          last_name: string
          avatar_url?: string | null
          phone?: string | null
          role: string
          permissions?: any
          status?: string
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          branch_id?: string | null
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          phone?: string | null
          role?: string
          permissions?: any
          status?: string
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          organization_id: string
          branch_id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          status: string
          priority: string
          assigned_to: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          branch_id: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          status?: string
          priority?: string
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          branch_id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          status?: string
          priority?: string
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          organization_id: string
          branch_id: string
          plan_id: string
          title: string
          description: string | null
          scenario: string | null
          status: string
          priority: string
          assigned_to: string | null
          due_date: string | null
          completed_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          branch_id: string
          plan_id: string
          title: string
          description?: string | null
          scenario?: string | null
          status?: string
          priority?: string
          assigned_to?: string | null
          due_date?: string | null
          completed_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          branch_id?: string
          plan_id?: string
          title?: string
          description?: string | null
          scenario?: string | null
          status?: string
          priority?: string
          assigned_to?: string | null
          due_date?: string | null
          completed_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
