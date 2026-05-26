import { FlexCenterCol,FlexCol,FlexFullCenter, FlexFullCenterCol } from '../shortcut/Flex.jsx';

export function BoxForm({ children , customWidth, customClass }) {
  return (
    <div className={`bg-white shadow-lg/50 rounded-xl ${customWidth ? customWidth : 'w-[70%]'} h-fit p-6 ${FlexCol} gap-5 relative ${customClass? customClass : null}`}>
      {children}
    </div>
  );
};


