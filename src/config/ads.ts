export type AdNetwork = 'monetag' | 'adsterra' | 'propellerads' | 'custom'

export const ACTIVE_NETWORK: AdNetwork = 'monetag'

export const ADS_CONFIG: Record<AdNetwork, Record<string, string>> = {
  monetag: {
    header:     `<!-- MONETAG HEADER 728x90 CODE -->`,
    sidebar:    `<!-- MONETAG SIDEBAR 300x250 CODE -->`,
    inContent:  `<!-- MONETAG IN-CONTENT 468x60 CODE -->`,
    footer:     `<!-- MONETAG FOOTER 728x90 CODE -->`,
  },
  adsterra: {
    header:     `<!-- ADSTERRA HEADER CODE -->`,
    sidebar:    `<!-- ADSTERRA SIDEBAR CODE -->`,
    inContent:  `<!-- ADSTERRA IN-CONTENT CODE -->`,
    footer:     `<!-- ADSTERRA FOOTER CODE -->`,
  },
  propellerads: {
    header:     `<!-- PROPELLERADS HEADER CODE -->`,
    sidebar:    `<!-- PROPELLERADS SIDEBAR CODE -->`,
    inContent:  `<!-- PROPELLERADS IN-CONTENT CODE -->`,
    footer:     `<!-- PROPELLERADS FOOTER CODE -->`,
  },
  custom: {
    header:     ``,
    sidebar:    ``,
    inContent:  ``,
    footer:     ``,
  },
}

export function getAdCode(slot: 'header' | 'sidebar' | 'inContent' | 'footer'): string {
  return ADS_CONFIG[ACTIVE_NETWORK][slot] || ''
}
