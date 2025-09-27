import type { ReactNode } from "react"

interface messageProps{
    children: ReactNode
    orientation: "left" | "right"
}

const messageOrientation = {
    left: "justify-start",
    right: "justify-end "
}

const messageColor = {
    left: "bg-gray-100 text-gray-800",
    right: "bg-primary text-white"
}



export default function Message({children, orientation}: messageProps){
    return(
        <div className={`w-full flex ${messageOrientation[orientation]} mb-4`}>
            <div className={`${messageColor[orientation]} min-w-16 max-w-xs p-3 rounded-lg break-words`}>
                {children}
            </div>
        </div>
    )
}