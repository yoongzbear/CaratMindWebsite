import { Helpline } from '../types/helpline';

export const HELPLINES: Helpline[] = [
  {
    name: 'Emergency Services',
    description:
      'If you or someone else is in immediate danger, call emergency services right away.',
    contact: '999',
    href: 'tel:999',
    // region: 'Malaysia / Singapore',
    available: 'Available 24/7',
  },
  {
    name: 'Talian Kasih',
    description:
      'National helpline for emotional support, counselling, and crisis reporting.',
    contact: '15999 (Malaysia)',
    href: 'tel:15999',
    // region: 'Malaysia',
    available: '24/7',
  },
  {
    name: 'Befrienders KL',
    description:
      'Confidential emotional support for those in distress or despair.',
    contact: '03-7627 2929',
    href: 'tel:+60376272929',
    // region: 'Malaysia',
    available: '24/7',
  },
  {
    name: 'Samaritans of Singapore (SOS)',
    description:
      'Confidential support for anyone in crisis or feeling suicidal.',
    contact: '1767',
    href: 'tel:1767',
    // region: 'Singapore',
    available: '24/7',
  },
  {
    name: 'IMH Mental Health Helpline',
    description:
      'Professional mental health support from the Institute of Mental Health Singapore.',
    contact: '6389 2222',
    href: 'tel:+6563892222',
    // region: 'Singapore',
    available: '24/7',
  },
  {
    name: '988 Suicide & Crisis Lifeline',
    description: 'Free, confidential support for people in distress (US).',
    contact: '988',
    href: 'tel:988',
    // region: 'United States',
    available: '24/7',
  },
  {
    name: 'Samaritans (UK & ROI)',
    description:
      'Whatever you are going through, you can call for free support.',
    contact: '116 123',
    href: 'tel:116123',
    // region: 'United Kingdom',
    available: '24/7',
  },
  {
    name: 'Lifeline Australia',
    description: 'Crisis support and suicide prevention services.',
    contact: '13 11 14',
    href: 'tel:131114',
    // region: 'Australia',
    available: '24/7',
  },
];
