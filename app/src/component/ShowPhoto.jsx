import { createPortal } from "react-dom";

export function ShowPhoto ({isOpenPhoto, children}) {
    if(!isOpenPhoto) return null

    return createPortal(
        <>
            <div className="size-screen bg-black fixed inset-0 opacity-[0.5] flex items-center justify-center"></div>
            <div className="size-screen fixed inset-0 flex items-center justify-center z-3 flex-col gap-3">
                {children}
            </div>
        </>,document.body
    )
}