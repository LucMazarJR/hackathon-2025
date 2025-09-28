import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"

interface navButtonProps {
    children: ReactNode
    path: string
}

export default function NavButton({ children, path }: navButtonProps) {
    const navigate = useNavigate()

    return (
        <button onClick={() => navigate(path)}>
            {children}
        </button>
    )
}