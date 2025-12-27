import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ProfileStore } from './lib/profile-store'
import { GitManager } from './lib/git-manager'

function createWindow(): void {
  // ブラウザウィンドウを作成
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // electron-vite cliに基づくレンダラーのHMR。
  // 開発用にはリモートURLをロードし、本番用にはローカルHTMLファイルをロードする。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Electronの初期化が完了し、ブラウザウィンドウを作成する準備ができた時に呼ばれる。
// 一部のAPIはこのイベントが発生した後にのみ使用できる。
app.whenReady().then(() => {
  // ウィンドウ用のアプリユーザーモデルIDを設定
  electronApp.setAppUserModelId('com.electron')

  // 開発中はF12でDevToolsの開閉をデフォルトにする。
  // 本番環境ではCommandOrControl + Rを無視する。
  // 参照: https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPCテスト
  ipcMain.on('ping', () => console.log('pong'))

  const profileStore = new ProfileStore()
  const gitManager = new GitManager()

  ipcMain.handle('get-profiles', () => {
    return profileStore.getProfiles()
  })

  ipcMain.handle('create-profile', (_, profile) => {
    return profileStore.createProfile(profile)
  })

  ipcMain.handle('update-profile', (_, profile) => {
    return profileStore.updateProfile(profile)
  })

  ipcMain.handle('delete-profile', (_, id) => {
    profileStore.deleteProfile(id)
  })

  ipcMain.handle('set-active-profile', async (_, id) => {
    const profile = profileStore.getProfile(id)
    if (profile) {
      await gitManager.setProfile(profile.gitName, profile.gitEmail, profile.sshKeyPath)
      profileStore.setActiveProfileId(id)
    }
  })

  ipcMain.handle('get-current-profile', () => {
    const id = profileStore.getActiveProfileId()
    return id ? profileStore.getProfile(id) : null
  })

  createWindow()

  app.on('activate', function () {
    // macOSでは、ドックアイコンがクリックされ、他に開いているウィンドウがない場合、
    // アプリでウィンドウを再作成するのが一般的です。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// macOSを除き、全ウィンドウが閉じられたら終了する。macOSでは、
// ユーザーが Cmd + Q で明示的に終了するまで、
// アプリケーションとメニューバーがアクティブなままになるのが一般的です。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// このファイルには、アプリ固有のメインプロセスの残りのコードを含めることができます。
// また、それらを別のファイルに分割してここでrequireすることもできます。
