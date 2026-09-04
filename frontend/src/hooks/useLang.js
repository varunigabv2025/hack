import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { resolveLang, t as translate } from '../lib/i18n'

/** Current UI language + translator bound to it. */
export function useLang() {
  const { data } = useApp()
  const lang = resolveLang(data?.user)

  useEffect(() => {
    document.documentElement.lang = lang === 'ta' ? 'ta' : 'en'
  }, [lang])

  function t(key, vars) {
    return translate(lang, key, vars)
  }

  return { lang, t }
}
