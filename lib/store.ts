import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Database } from "@/lib/supabase";
import { SupabaseService } from "@/lib/supabase-service";
import { isSupabaseConfigured } from "@/lib/supabase";
import { PostgresService } from "@/lib/postgres-service";
import { isPostgresConfigured } from "@/lib/postgres";

type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type Branch = Database["public"]["Tables"]["branches"]["Row"];
type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
type Plan = Database["public"]["Tables"]["plans"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface AuthState {
  user: any | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

interface OrganizationState {
  organizations: Organization[];
  currentOrganization: Organization | null;
  branches: Branch[];
  currentBranch: Branch | null;
  isLoading: boolean;
  error: string | null;
}

interface DataState {
  plans: Plan[];
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

interface AppState extends AuthState, OrganizationState, DataState {
  // Auth actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  loadUserProfile: (userId: string) => Promise<void>;

  // Organization actions
  loadOrganizations: () => Promise<void>;
  setCurrentOrganization: (organization: Organization) => void;
  loadBranches: (organizationId: string) => Promise<void>;
  setCurrentBranch: (branch: Branch) => void;

  // Data actions
  loadPlans: (organizationId: string, branchId?: string) => Promise<void>;
  createPlan: (plan: any) => Promise<void>;
  updatePlan: (planId: string, updates: any) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;

  loadTasks: (
    organizationId: string,
    branchId?: string,
    planId?: string
  ) => Promise<void>;
  createTask: (task: any) => Promise<void>;
  updateTask: (taskId: string, updates: any) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;

  // Utility actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      userProfile: null,
      organizations: [],
      currentOrganization: null,
      branches: [],
      currentBranch: null,
      plans: [],
      tasks: [],
      isLoading: false,
      error: null,

      // Auth actions
      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await SupabaseService.signIn(email, password);
          set({ user });
          if (user) {
            await get().loadUserProfile(user.id);
          }
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      signUp: async (email: string, password: string, userData: any) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await SupabaseService.signUp(
            email,
            password,
            userData
          );
          set({ user });
          if (user) {
            await get().loadUserProfile(user.id);
          }
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await SupabaseService.signOut();
          set({
            user: null,
            userProfile: null,
            currentOrganization: null,
            currentBranch: null,
            plans: [],
            tasks: [],
          });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      loadUserProfile: async (userId: string) => {
        try {
          const userProfile = await SupabaseService.getUserProfile(userId);
          set({ userProfile });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      // Organization actions
      loadOrganizations: async () => {
        set({ isLoading: true, error: null });
        try {
          // Try Postgres first, then Supabase
          if (isPostgresConfigured()) {
            console.log("Using Postgres for organizations");
            const organizations = await PostgresService.getOrganizations();
            set({ organizations });
          } else if (isSupabaseConfigured()) {
            console.log("Using Supabase for organizations");
            const organizations = await SupabaseService.getOrganizations();
            set({ organizations });
          } else {
            console.warn("Neither Postgres nor Supabase configured - using empty organizations");
            set({ organizations: [] });
          }
        } catch (error: any) {
          console.warn("Failed to load organizations:", error.message);
          // Don't set error for missing organizations table - just use empty array
          set({ organizations: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      setCurrentOrganization: (organization: Organization) => {
        set({ currentOrganization: organization });
        // Load branches for the selected organization
        get().loadBranches(organization.id);
      },

      loadBranches: async (organizationId: string) => {
        set({ isLoading: true, error: null });
        try {
          const branches = await SupabaseService.getBranches(organizationId);
          set({ branches });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      setCurrentBranch: (branch: Branch) => {
        set({ currentBranch: branch });
        // Load plans and tasks for the selected branch
        const { currentOrganization } = get();
        if (currentOrganization) {
          get().loadPlans(currentOrganization.id, branch.id);
          get().loadTasks(currentOrganization.id, branch.id);
        }
      },

      // Data actions
      loadPlans: async (organizationId: string, branchId?: string) => {
        set({ isLoading: true, error: null });
        try {
          const plans = await SupabaseService.getPlans(
            organizationId,
            branchId
          );
          set({ plans });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      createPlan: async (plan: any) => {
        set({ isLoading: true, error: null });
        try {
          await SupabaseService.createPlan(plan);
          // Reload plans
          const { currentOrganization, currentBranch } = get();
          if (currentOrganization) {
            await get().loadPlans(currentOrganization.id, currentBranch?.id);
          }
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      updatePlan: async (planId: string, updates: any) => {
        set({ isLoading: true, error: null });
        try {
          await SupabaseService.updatePlan(planId, updates);
          // Reload plans
          const { currentOrganization, currentBranch } = get();
          if (currentOrganization) {
            await get().loadPlans(currentOrganization.id, currentBranch?.id);
          }
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      deletePlan: async (planId: string) => {
        set({ isLoading: true, error: null });
        try {
          await SupabaseService.deletePlan(planId);
          // Reload plans
          const { currentOrganization, currentBranch } = get();
          if (currentOrganization) {
            await get().loadPlans(currentOrganization.id, currentBranch?.id);
          }
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      loadTasks: async (
        organizationId: string,
        branchId?: string,
        planId?: string
      ) => {
        set({ isLoading: true, error: null });
        try {
          const tasks = await SupabaseService.getTasks(
            organizationId,
            branchId,
            planId
          );
          set({ tasks });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      createTask: async (task: any) => {
        set({ isLoading: true, error: null });
        try {
          await SupabaseService.createTask(task);
          // Reload tasks
          const { currentOrganization, currentBranch } = get();
          if (currentOrganization) {
            await get().loadTasks(currentOrganization.id, currentBranch?.id);
          }
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      updateTask: async (taskId: string, updates: any) => {
        set({ isLoading: true, error: null });
        try {
          await SupabaseService.updateTask(taskId, updates);
          // Reload tasks
          const { currentOrganization, currentBranch } = get();
          if (currentOrganization) {
            await get().loadTasks(currentOrganization.id, currentBranch?.id);
          }
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteTask: async (taskId: string) => {
        set({ isLoading: true, error: null });
        try {
          await SupabaseService.deleteTask(taskId);
          // Reload tasks
          const { currentOrganization, currentBranch } = get();
          if (currentOrganization) {
            await get().loadTasks(currentOrganization.id, currentBranch?.id);
          }
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      // Utility actions
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "boshqaruv-mobile-storage",
      partialize: (state) => ({
        user: state.user,
        userProfile: state.userProfile,
        currentOrganization: state.currentOrganization,
        currentBranch: state.currentBranch,
      }),
    }
  )
);
