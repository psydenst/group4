import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Frontend App',
  description: 'Simple Next.js app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
