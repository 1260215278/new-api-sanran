/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { render, screen, within } from '@testing-library/react'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { expect, it, vi } from 'vitest'

import { useSystemConfig } from '@/hooks/use-system-config'
import en from '@/i18n/locales/en.json'
import { DEFAULT_CURRENCY_CONFIG } from '@/stores/system-config-store'

import { useHomePageContent } from '../hooks'
import { Home } from '../index'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))
vi.mock('@/components/layout/components/public-header', () => ({
  PublicHeader: () => null,
}))
vi.mock('@/context/theme-provider', () => ({
  useTheme: () => ({ resolvedTheme: 'light' }),
}))
vi.mock('@/hooks/use-status', () => ({ useStatus: () => ({ status: null }) }))
vi.mock('@/hooks/use-system-config', () => ({ useSystemConfig: vi.fn() }))
vi.mock('../components', () => ({}))
vi.mock('../hooks', () => ({ useHomePageContent: vi.fn() }))

it.each([
  { mode: 'HTML', content: '<h1>Custom home</h1>', isUrl: false },
  { mode: 'Markdown', content: '# Custom home', isUrl: false },
  { mode: 'iframe', content: 'https://example.com', isUrl: true },
])(
  'shows both project links below $mode content',
  async ({ mode, content, isUrl }) => {
    vi.mocked(useHomePageContent).mockReturnValue({
      content,
      isLoaded: true,
      isUrl,
    })
    vi.mocked(useSystemConfig).mockReturnValue({
      systemName: 'Example',
      logo: '/logo.png',
      footerHtml: '',
      currency: DEFAULT_CURRENCY_CONFIG,
      loading: false,
      logoLoaded: false,
    })
    const i18n = createInstance()
    await i18n.init({ lng: 'en', resources: { en } })

    const { container } = render(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>
    )

    const footer = screen.getByRole('contentinfo')
    const customContent = isUrl
      ? screen.getByTitle('Custom Home Page')
      : container.querySelector('.custom-home-content')
    expect(customContent).toBeInTheDocument()
    if (isUrl) {
      expect(customContent).toHaveAttribute('src', content)
    } else if (mode === 'HTML') {
      expect(customContent?.shadowRoot?.querySelector('h1')).toHaveTextContent(
        'Custom home'
      )
    } else {
      expect(screen.getByRole('heading', { name: 'Custom home' })).toBeVisible()
    }
    expect(
      (customContent?.compareDocumentPosition(footer) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(
      within(footer).getByRole('link', { name: 'New API' })
    ).toHaveAttribute('href', 'https://github.com/QuantumNous/new-api')
    expect(
      within(footer).getByRole('link', { name: 'Source code' })
    ).toHaveAttribute('href', 'https://github.com/1260215278/new-api-sanran')
  }
)
