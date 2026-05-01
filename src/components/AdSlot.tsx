import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slot: 'header' | 'sidebar' | 'in-content' | 'footer'
  adCode?: string
  width?: number
  height?: number
  className?: string
}

export function AdSlot({ slot, adCode, width, height, className }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!adCode || !containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''
    const range = document.createRange()
    const fragment = range.createContextualFragment(adCode)
    container.appendChild(fragment)
    
    // Re-execute any script tags
    container.querySelectorAll('script').forEach(oldScript => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach(attr =>
        newScript.setAttribute(attr.name, attr.value)
      )
      newScript.textContent = oldScript.textContent
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [adCode])

  if (!adCode) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-zinc-300 bg-zinc-50 text-xs text-zinc-400 ${className}`}
        style={{ width: width || '100%', height: height || 90 }}
      >
        Advertisement ({slot})
      </div>
    )
  }

  return <div ref={containerRef} className={className} />
}
