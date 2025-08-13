import type { OrganizationRole, User } from '@/@types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: User | null;
  selectedOrganization: OrganizationRole | null;
  setSelectedOrganization: (organization: OrganizationRole | null) => void;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      selectedOrganization: null,
      setSelectedOrganization: (organization) => set({ selectedOrganization: organization }),
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-store', // nome da chave no localStorage
    }
  )
);
