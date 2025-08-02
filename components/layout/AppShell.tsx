import React from 'react'

// layout wrapper for protected pages

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-gray-900">
      <header className="p-4 bg-primary text-white font-bold">
        MicroBank
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}