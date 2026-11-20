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
import { render, screen } from '@testing-library/react'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { expect, it, vi } from 'vitest'

import { useSystemConfig } from '@/hooks/use-system-config'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'
import { DEFAULT_CURRENCY_CONFIG } from '@/stores/system-config-store'

import { Footer } from '../footer'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))
vi.mock('@/hooks/use-status', () => ({ useStatus: () => ({ status: null }) }))
vi.mock('@/hooks/use-system-config', () => ({ useSystemConfig: vi.fn() }))

it.each([
  { footerHtml: '', lng: 'en', label: 'Source code' },
  { footerHtml: '<p>Custom footer</p>', lng: 'zhCN', label: '源码' },
])(
  'keeps both source and attribution links in the $lng footer',
  async (testCase) => {
    vi.mocked(useSystemConfig).mockReturnValue({
      systemName: 'Example',
      logo: '/logo.png',
      footerHtml: testCase.footerHtml,
      currency: DEFAULT_CURRENCY_CONFIG,
      loading: false,
      logoLoaded: false,
    })
    const i18n = createInstance()
    await i18n.init({ lng: testCase.lng, resources: { en, zhCN: zh } })

    render(
      <I18nextProvider i18n={i18n}>
        <Footer />
      </I18nextProvider>
    )

    const source = screen.getByRole('link', { name: testCase.label })
    const attribution = screen.getByRole('link', { name: 'New API' })
    expect(source).toBeVisible()
    expect(source).toHaveClass('text-foreground', 'underline')
    expect(source).toHaveAttribute(
      'href',
      'https://github.com/1260215278/new-api-sanran'
    )
    expect(source).toHaveAttribute('target', '_blank')
    expect(source).toHaveAttribute('rel', 'noopener noreferrer')
    expect(attribution).toHaveAttribute(
      'href',
      'https://github.com/QuantumNous/new-api'
    )
    expect(source.parentElement).toHaveTextContent(
      i18n.t('footer.frontendAttribution')
    )
  }
)
