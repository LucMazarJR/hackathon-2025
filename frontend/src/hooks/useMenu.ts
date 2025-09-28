import { useState, useEffect } from 'react'

export const useMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [isOpening, setIsOpening] = useState(false)

  useEffect(() => {
    if (isMenuOpen) {
      setShouldRender(true)
      setIsClosing(false)
      setIsOpening(true)
      const timer = setTimeout(() => setIsOpening(false), 50)
      return () => clearTimeout(timer)
    } else if (shouldRender) {
      setIsClosing(true)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isMenuOpen, shouldRender])

  const handleClose = () => {
    setIsMenuOpen(false)
  }

  const handleOpen = () => {
    setIsMenuOpen(true)
  }

  return {
    isMenuOpen,
    isClosing,
    shouldRender,
    isOpening,
    handleClose,
    handleOpen
  }
}