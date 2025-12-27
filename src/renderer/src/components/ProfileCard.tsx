import React from 'react'
import { Profile } from '@shared/types'
import { clsx } from 'clsx'

interface ProfileCardProps {
  profile: Profile
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  isCurrent: boolean
}

export function ProfileCard({
  profile,
  onSelect,
  onDelete,
  isCurrent
}: ProfileCardProps): React.ReactElement {
  return (
    <div
      className={clsx(
        'relative p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer group',
        isCurrent
          ? 'border-purple-600 bg-purple-500/10 shadow-lg shadow-purple-500/20'
          : 'border-gray-700 bg-gray-800 hover:border-gray-500 hover:bg-gray-750'
      )}
      onClick={() => onSelect(profile.id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{profile.name}</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <p className="flex items-center gap-2">
              <span className="w-4 h-4 i-lucide-user opacity-70" />
              {profile.gitName}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-4 h-4 i-lucide-mail opacity-70" />
              {profile.gitEmail}
            </p>
          </div>
        </div>

        {isCurrent && (
          <span className="px-2 py-1 text-xs font-bold text-purple-200 bg-purple-900/50 rounded-full border border-purple-500/30">
            使用中
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(profile.id)
        }}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-400 transition-opacity"
        title="プロファイルを削除"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
  )
}
