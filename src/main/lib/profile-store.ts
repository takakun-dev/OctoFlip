import Store from 'electron-store'
import { Profile, ProfileCreate } from '@shared/types'
import { randomUUID } from 'crypto'

interface StoreSchema {
  profiles: Profile[]
  activeProfileId: string | null
}

export class ProfileStore {
  private store: Store<StoreSchema>

  constructor() {
    this.store = new Store<StoreSchema>({
      defaults: {
        profiles: [],
        activeProfileId: null
      }
    })
  }

  getProfiles(): Profile[] {
    return this.store.get('profiles')
  }

  getProfile(id: string): Profile | undefined {
    return this.getProfiles().find((p) => p.id === id)
  }

  createProfile(profile: ProfileCreate): Profile {
    const profiles = this.getProfiles()
    const newProfile: Profile = {
      ...profile,
      id: randomUUID(),
      isActive: false
    }
    this.store.set('profiles', [...profiles, newProfile])
    return newProfile
  }

  updateProfile(profile: Profile): Profile {
    const profiles = this.getProfiles()
    const index = profiles.findIndex((p) => p.id === profile.id)
    if (index === -1) {
      throw new Error('Profile not found')
    }
    profiles[index] = profile
    this.store.set('profiles', profiles)
    return profile
  }

  deleteProfile(id: string): void {
    const profiles = this.getProfiles()
    this.store.set(
      'profiles',
      profiles.filter((p) => p.id !== id)
    )
    if (this.store.get('activeProfileId') === id) {
      this.store.set('activeProfileId', null)
    }
  }

  getActiveProfileId(): string | null {
    return this.store.get('activeProfileId')
  }

  setActiveProfileId(id: string | null): void {
    this.store.set('activeProfileId', id)
    // Update isActive flag in profiles for convenience
    const profiles = this.getProfiles().map((p) => ({
      ...p,
      isActive: p.id === id
    }))
    this.store.set('profiles', profiles)
  }
}
