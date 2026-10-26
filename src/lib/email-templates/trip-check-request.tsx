import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  email?: string
  tripDetails?: string
}

const Email = ({ name, email, tripDetails }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Someone wants a free trip sanity check</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>JET SET TRAVEL CO.</Text>
        <Heading style={heading} as="h1">
          Trip sanity check request
        </Heading>
        <Text style={body}>
          {name ? `${name}` : 'A visitor'} asked you to look over a trip they already have in mind.
        </Text>
        <Section style={card}>
          <Text style={label}>NAME</Text>
          <Text style={value}>{name || '—'}</Text>
          <Text style={{ ...label, marginTop: '18px' }}>EMAIL</Text>
          <Text style={value}>{email || '—'}</Text>
          <Text style={{ ...label, marginTop: '18px' }}>THE TRIP</Text>
          <Text style={value}>{tripDetails || '—'}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={note}>
          Reply to this email to answer them. The trip is also stored in your database under{' '}
          <code style={code}>trip_check_requests</code>.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Trip sanity check request',
  displayName: 'Trip sanity check request',
  previewData: {
    name: 'Ascha W.',
    email: 'ascha@example.com',
    tripDetails: 'Four nights in Maui at the Sheraton, arriving Sunday, honeymoon.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const eyebrow = {
  margin: '0 0 10px',
  fontSize: '11px',
  letterSpacing: '0.18em',
  color: '#c9a24d',
  fontWeight: 'bold',
}
const heading = { margin: '0 0 16px', fontSize: '24px', lineHeight: '30px', color: '#2e2013' }
const body = { margin: '0 0 22px', fontSize: '15px', lineHeight: '24px', color: '#2e2013' }
const card = {
  margin: '0 0 24px',
  padding: '20px 22px',
  backgroundColor: '#f5ede1',
  border: '1px solid #e4d5b8',
  borderRadius: '4px',
}
const label = { margin: '0', fontSize: '11px', letterSpacing: '0.14em', color: '#8a7355' }
const value = { margin: '6px 0 0', fontSize: '15px', lineHeight: '24px', color: '#2e2013', whiteSpace: 'pre-wrap' }
const hr = { border: 'none', borderTop: '1px solid #e4d5b8', margin: '0 0 18px' }
const note = { margin: '0', fontSize: '13px', lineHeight: '20px', color: '#5d4a34' }
const code = { fontSize: '13px', color: '#2e2013' }
