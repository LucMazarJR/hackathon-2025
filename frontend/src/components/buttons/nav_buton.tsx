import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"

interface navButtonProps {
    children: ReactNode
    path: string
    className?: string
}

export default function NavButton({ children, path, className }: navButtonProps) {
    const navigate = useNavigate()

    return (
        <button onClick={() => navigate(path)} className={className}>
            {children}
        </button>
    )
}