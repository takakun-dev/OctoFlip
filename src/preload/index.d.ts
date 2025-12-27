import { ElectronAPI } from '@electron-toolkit/preload'
import { IProfileService } from '@shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: IProfileService
  }
}
