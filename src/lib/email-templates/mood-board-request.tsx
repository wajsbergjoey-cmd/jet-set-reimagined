import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  email?: string
  phone?: string
  picks?: { title: string; value: string }[]
  suggestion?: string
}

const Email = ({ name, email, phone, picks = [], suggestion }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New dream trip mood board from {name || 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>JET SET TRAVEL CO.</Text>
        <Heading style={h1}>New dream trip mood board</Heading>
        <Section style={card}>
          <Text style={row}><b>Name:</b> {name || '—'}</Text>
          <Text style={row}><b>Email:</b> {email || '—'}</Text>
          <Text style={row}><b>Phone:</b> {phone || '—'}</Text>
        </Section>
        <Hr style={hr} />
        {picks.map((p) => (
          <Text key={p.title} style={row}><b>{p.title}:</b> {p.value || '—'}</Text>
        ))}
        {suggestion ? <Text style={idea}>{suggestion}</Text> : null}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `New mood board — ${d['name'] || 'Website visitor'}`,
  displayName: 'Mood board request',
  to: 'jetsettravelco1@gmail.com',
  previewData: {
    name: 'Jane Doe', email: 'jane@email.com', phone: '(555) 123-4567',
    picks: [{ title: 'Vibe', value: 'Beach' }, { title: 'Budget', value: '$6k–$12k' }],
    suggestion: 'Barefoot, adults-only and beach-first — sounds like Turks & Caicos.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif' }
const container = { padding: '28px 25px', maxWidth: '560px' }
const eyebrow = { color: '#c9a24d', fontSize: '12px', letterSpacing: '3px', margin: 0 }
const h1 = { color: '#2e2013', fontSize: '26px', margin: '8px 0 20px' }
const card = { backgroundColor: '#f5ede1', padding: '12px 18px', borderRadius: '4px' }
const row = { color: '#2e2013', fontSize: '15px', margin: '6px 0', fontFamily: 'Arial, sans-serif' }
const hr = { borderColor: '#e6dccb', margin: '20px 0' }
const idea = { color: '#c9a24d', fontStyle: 'italic', fontSize: '17px', marginTop: '18px' }
