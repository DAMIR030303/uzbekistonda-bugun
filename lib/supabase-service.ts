import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type Branch = Database["public"]["Tables"]["branches"]["Row"];
type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
type Plan = Database["public"]["Tables"]["plans"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];

export class SupabaseService {
  // Helper method to check if Supabase is available
  private static checkSupabase() {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error("Supabase not configured");
    }
    return supabase;
  }

  // Organizations
  static async getOrganizations() {
    if (!isSupabaseConfigured() || !supabase) {
      console.warn("Supabase not configured - returning empty organizations");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("name");

      if (error) {
        console.warn("Supabase organizations table not found or error:", error.message);
        return [];
      }

      return (data as Organization[]) || [];
    } catch (error) {
      console.warn("Failed to fetch organizations:", error);
      return [];
    }
  }

  static async getOrganizationBySlug(slug: string) {
    const supabaseClient = this.checkSupabase();
    const { data, error } = await supabaseClient
      .from("organizations")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data as Organization;
  }

  // Branches
  static async getBranches(organizationId: string) {
    if (!isSupabaseConfigured() || !supabase) {
      console.warn("Supabase not configured - returning empty branches");
      return [];
    }

    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .eq("organization_id", organizationId)
      .order("name");

    if (error) {
      console.warn("Failed to fetch branches:", error.message);
      return [];
    }
    return data as Branch[];
  }

  static async getBranchBySlug(organizationId: string, slug: string) {
    const supabaseClient = this.checkSupabase();
    const { data, error } = await supabaseClient
      .from("branches")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data as Branch;
  }

  // User Profiles
  static async getUserProfile(userId: string) {
    const supabaseClient = this.checkSupabase();
    const { data, error } = await supabaseClient
      .from("user_profiles")
      .select(
        `
        *,
        organizations (*),
        branches (*)
      `
      )
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as UserProfile & {
      organizations: Organization;
      branches: Branch;
    };
  }

  static async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ) {
    const supabaseClient = this.checkSupabase();
    const { data, error } = await supabaseClient
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  }

  // Plans
  static async getPlans(organizationId: string, branchId?: string) {
    const supabaseClient = this.checkSupabase();
    let query = supabaseClient
      .from("plans")
      .select(
        `
        *,
        user_profiles!plans_assigned_to_fkey (first_name, last_name),
        user_profiles!plans_created_by_fkey (first_name, last_name)
      `
      )
      .eq("organization_id", organizationId);

    if (branchId) {
      query = query.eq("branch_id", branchId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data as (Plan & {
      user_profiles: { first_name: string; last_name: string } | null;
    })[];
  }

  static async createPlan(
    plan: Database["public"]["Tables"]["plans"]["Insert"]
  ) {
    const supabaseClient = this.checkSupabase();
    const { data, error } = await supabaseClient
      .from("plans")
      .insert(plan)
      .select()
      .single();

    if (error) throw error;
    return data as Plan;
  }

  static async updatePlan(planId: string, updates: Partial<Plan>) {
    const supabaseClient = this.checkSupabase();
    const { data, error } = await supabaseClient
      .from("plans")
      .update(updates)
      .eq("id", planId)
      .select()
      .single();

    if (error) throw error;
    return data as Plan;
  }

  static async deletePlan(planId: string) {
    const supabaseClient = this.checkSupabase();
    const { error } = await supabaseClient.from("plans").delete().eq("id", planId);

    if (error) throw error;
  }

  // Tasks
  static async getTasks(
    organizationId: string,
    branchId?: string,
    planId?: string
  ) {
    const supabaseClient = this.checkSupabase();
    let query = supabaseClient
      .from("tasks")
      .select(
        `
        *,
        user_profiles!tasks_assigned_to_fkey (first_name, last_name),
        user_profiles!tasks_created_by_fkey (first_name, last_name),
        plans (title)
      `
      )
      .eq("organization_id", organizationId);

    if (branchId) {
      query = query.eq("branch_id", branchId);
    }

    if (planId) {
      query = query.eq("plan_id", planId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data as (Task & {
      user_profiles: { first_name: string; last_name: string } | null;
      plans: { title: string };
    })[];
  }

  static async createTask(
    task: Database["public"]["Tables"]["tasks"]["Insert"]
  ) {
    const supabaseClient = this.checkSupabase();
    const { data, error } = await supabaseClient
      .from("tasks")
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  }

  static async updateTask(taskId: string, updates: Partial<Task>) {
    const supabaseClient = this.checkSupabase();
    const { data, error } = await supabaseClient
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  }

  static async deleteTask(taskId: string) {
    const supabaseClient = this.checkSupabase();
    const { error } = await supabaseClient.from("tasks").delete().eq("id", taskId);

    if (error) throw error;
  }

  // Auth
  static async signIn(email: string, password: string) {
    const supabaseClient = this.checkSupabase();
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  static async signUp(
    email: string,
    password: string,
    userData: {
      first_name: string;
      last_name: string;
      organization_id: string;
      branch_id?: string;
      role: string;
    }
  ) {
    const supabaseClient = this.checkSupabase();
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;
    return data;
  }

  static async signOut() {
    const supabaseClient = this.checkSupabase();
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser() {
    const supabaseClient = this.checkSupabase();
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return user;
  }

  // Realtime subscriptions
  static subscribeToPlans(
    organizationId: string,
    callback: (payload: any) => void
  ) {
    const supabaseClient = this.checkSupabase();
    return supabaseClient
      .channel("plans")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "plans",
          filter: `organization_id=eq.${organizationId}`,
        },
        callback
      )
      .subscribe();
  }

  static subscribeToTasks(
    organizationId: string,
    callback: (payload: any) => void
  ) {
    const supabaseClient = this.checkSupabase();
    return supabaseClient
      .channel("tasks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `organization_id=eq.${organizationId}`,
        },
        callback
      )
      .subscribe();
  }
}
