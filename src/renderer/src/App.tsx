import React, { useEffect, useState } from 'react'
import { Profile, ProfileCreate } from '@shared/types'
import { ProfileCard } from './components/ProfileCard'
import { ProfileForm } from './components/ProfileForm'

function App(): React.ReactElement {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = async (): Promise<void> => {
    try {
      const [allProfiles, active] = await Promise.all([
        window.api.getProfiles(),
        window.api.getCurrentProfile()
      ])
      setProfiles(allProfiles)
      setCurrentProfile(active)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreate = async (data: ProfileCreate): Promise<void> => {
    try {
      await window.api.createProfile(data)
      setIsCreating(false)
      await loadData()
    } catch (error) {
      console.error('Failed to create profile:', error)
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    if (confirm('このプロファイルを削除してもよろしいですか？')) {
      try {
        await window.api.deleteProfile(id)
        await loadData()
      } catch (error) {
        console.error('Failed to delete profile:', error)
      }
    }
  }

  const handleSelect = async (id: string): Promise<void> => {
    try {
      setLoading(true)
      await window.api.setActiveProfile(id)
      await loadData()
    } catch (error) {
      console.error('Failed to set active profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              OctoFlip
            </h1>
            <p className="text-gray-400 mt-1">Githubアカウントをワンクリックで切り替え</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2"
          >
            <span className="text-xl leading-none">+</span> 新規プロファイル
          </button>
        </header>

        {/* Current Status */}
        <section className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            現在のステータス
          </h2>
          {currentProfile ? (
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-500/20">
                {currentProfile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">{currentProfile.gitName}</div>
                <div className="text-gray-400 font-mono text-sm bg-gray-900/50 px-3 py-1 rounded-md inline-block">
                  {currentProfile.gitEmail}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic">アクティブなプロファイルが選択されていません</div>
          )}
        </section>

        {/* Profile Form */}
        {isCreating && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <ProfileForm onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
          </div>
        )}

        {/* Profiles Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isCurrent={currentProfile?.id === profile.id}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
          ))}

          {profiles.length === 0 && !isCreating && (
            <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
              <p>プロファイルが見つかりません。作成して始めましょう。</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
