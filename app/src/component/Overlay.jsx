import { FlexCenterCol,FlexCol,FlexFullCenter } from '../shortcut/Flex.jsx';
import { createPortal } from 'react-dom';

export function Overlay({ isOpen, children }) {
  if (!isOpen) return null


  return createPortal(
    <>
      <div className="size-screen bg-black fixed inset-0 opacity-[0.5] flex items-center justify-center"></div>
      <div className="size-screen fixed inset-0 flex items-center justify-center z-3">
        <div className={`w-[35%] h-[85%] bg-white rounded-[25px] relative ${FlexCenterCol}`}>
          {children}
        </div>
      </div>
    </>, document.body
  )
}