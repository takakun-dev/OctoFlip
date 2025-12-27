import React, { useState } from 'react'
import { ProfileCreate } from '@shared/types'

interface ProfileFormProps {
  onSubmit: (data: ProfileCreate) => void
  onCancel: () => void
}

export function ProfileForm({ onSubmit, onCancel }: ProfileFormProps): React.ReactElement {
  const [formData, setFormData] = useState<ProfileCreate>({
    name: '',
    gitName: '',
    gitEmail: '',
    sshKeyPath: ''
  })

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-800 p-6 rounded-xl border border-gray-700"
    >
      <h3 className="text-xl font-bold text-white mb-4">新規プロファイル</h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">プロファイル名</label>
        <input
          type="text"
          required
          placeholder="例: 仕事用"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Git ユーザー名</label>
          <input
            type="text"
            required
            placeholder="john-dev"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white"
            value={formData.gitName}
            onChange={(e) => setFormData({ ...formData, gitName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Git メールアドレス</label>
          <input
            type="email"
            required
            placeholder="john@example.com"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white"
            value={formData.gitEmail}
            onChange={(e) => setFormData({ ...formData, gitEmail: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">SSHキーのパス (任意)</label>
        <input
          type="text"
          placeholder="~/.ssh/id_rsa_work"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white"
          value={formData.sshKeyPath || ''}
          onChange={(e) => setFormData({ ...formData, sshKeyPath: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-lg shadow-purple-900/20"
        >
          プロファイル作成
        </button>
      </div>
    </form>
  )
}
