export interface Profile {
  id: string
  name: string
  gitName: string
  gitEmail: string
  sshKeyPath?: string
  isActive: boolean
}

export type ProfileCreate = Omit<Profile, 'id' | 'isActive'>

export interface IProfileService {
  getProfiles: () => Promise<Profile[]>
  createProfile: (profile: ProfileCreate) => Promise<Profile>
  updateProfile: (profile: Profile) => Promise<Profile>
  deleteProfile: (id: string) => Promise<void>
  setActiveProfile: (id: string) => Promise<void>
  getCurrentProfile: () => Promise<Profile | null>
}
