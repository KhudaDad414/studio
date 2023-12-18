import React from 'react'
import Head from 'next/head'
import 'reactflow/dist/style.css';
import './globals.css'
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';
import '@asyncapi/react-component/styles/default.min.css';
import { Metadata } from 'next';

const title = 'AsyncAPI Studio'
const description = 'Studio for AsyncAPI specification, where you can validate, view preview documentation, and generate templates from AsyncAPI document.'
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    url: 'https://studio.asyncapi.com/',
    title,
    description,
    images: [
      {
        url: '/img/meta-studio-og-image.jpeg',
        width: 800,
        height: 600,
        alt: 'Og Image Alt',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AsyncAPISpec',
    creator: '@AsyncAPISpec',
    title,
    description,
    images: [
      {
        url: '/img/meta-studio-og-image.jpeg',
        alt: 'Twitter Image Alt',
        width: 800,
        height: 600,
        type: 'image/jpeg',
      }
    ]
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/favicon-194x194.png" />
      </Head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {children}
      </body>
    </html>)
}