import { useEffect, useState } from 'react'

// useState que persiste no localStorage (falha em silencio se o navegador bloquear).
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : JSON.parse(raw)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* sem persistencia */
    }
  }, [key, value])

  return [value, setValue]
}
