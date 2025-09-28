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
    left: "bg-gray-200 text-gray-900",
    right: "bg-primary text-white"
}



export default function Message({children, orientation}: messageProps){
    return(
        <div className={`w-full flex ${messageOrientation[orientation]} mb-4`}>
            <div className={`${messageColor[orientation]} min-w-16 max-w-sm sm:max-w-md md:max-w-xl lg:max-w-4xl xl:max-w-5xl p-3 rounded-lg break-words`}>
                {children}
            </div>
        </div>
    )
}