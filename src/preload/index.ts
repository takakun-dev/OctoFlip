import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { Profile, ProfileCreate } from '@shared/types'

// Custom APIs for renderer
const api = {
  getProfiles: (): Promise<Profile[]> => ipcRenderer.invoke('get-profiles'),
  createProfile: (profile: ProfileCreate): Promise<Profile> =>
    ipcRenderer.invoke('create-profile', profile),
  updateProfile: (profile: Profile): Promise<Profile> =>
    ipcRenderer.invoke('update-profile', profile),
  deleteProfile: (id: string): Promise<void> => ipcRenderer.invoke('delete-profile', id),
  setActiveProfile: (id: string): Promise<void> => ipcRenderer.invoke('set-active-profile', id),
  getCurrentProfile: (): Promise<Profile | null> => ipcRenderer.invoke('get-current-profile')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
