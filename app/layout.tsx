import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gestão Acadêmica',
  description: 'Sistema de Gestão Acadêmica para Coordenação do Curso de Educação Física da UFC',
  creator: 'Arthur Vinicius Carneiro Nunes'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="./brasao.ico" />
        <style>{`
html {
  font-family:${GeistSans.style.fontFamily};
  --font-sans:${GeistSans.variable};
  --font-mono:${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
