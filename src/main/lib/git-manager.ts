import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class GitManager {
  async setGlobalConfig(key: string, value: string): Promise<void> {
    try {
      await execAsync(`git config --global ${key} "${value}"`)
    } catch (error) {
      console.error(`Failed to set git config ${key}:`, error)
      throw error
    }
  }

  async unsetGlobalConfig(key: string): Promise<void> {
    try {
      await execAsync(`git config --global --unset ${key}`)
    } catch (error) {
      // Ignore error if key doesn't exist
      console.warn(`Failed to unset git config ${key}:`, error)
    }
  }

  async getGlobalConfig(key: string): Promise<string | null> {
    try {
      const { stdout } = await execAsync(`git config --global ${key}`)
      return stdout.trim()
    } catch {
      return null
    }
  }

  async setProfile(name: string, email: string, sshKeyPath?: string): Promise<void> {
    await this.setGlobalConfig('user.name', name)
    await this.setGlobalConfig('user.email', email)

    if (sshKeyPath) {
      // Use core.sshCommand to specify the ssh key
      // -i specifies the identity file
      // -o IdentitiesOnly=yes ensures only this key is used
      const sshCommand = `ssh -i ${sshKeyPath} -o IdentitiesOnly=yes`
      await this.setGlobalConfig('core.sshCommand', sshCommand)
    } else {
      // If no SSH key path is provided, we might want to unset it to revert to default
      // Or just leave it if the user wants to manage it manually.
      // For now, let's unset it if we are switching to a profile that doesn't have one,
      // to avoid using the wrong key from a previous profile.
      await this.unsetGlobalConfig('core.sshCommand')
    }
  }
}
