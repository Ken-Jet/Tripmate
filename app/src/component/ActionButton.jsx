import {CalibriBold, Calibri} from './../../font/font.jsx'
import { FlexCenterCol,FlexCol,FlexFullCenter } from '../shortcut/Flex.jsx';

export function ActionButton({ action, image, CustomClass, CustomContext, actEvent, customColor}) {
  let Color = null;
  let Context = null;

  switch (action) {
    case 'oke': Color = 'bg-[#75F94C]'
      Context = 'Buat'
      break
    case 'batal': Color = 'bg-[#ff3e29]'
      Context = 'Batal'
      break
  }

  customColor ? Color = customColor : null

  let Classes = !CustomClass? `${Color} w-[20%] p-1 pb-2 pt-2 rounded-[20px] text-[20px] gap-3 ${CalibriBold} relative ${FlexFullCenter} hover:cursor-pointer` : `${CustomClass} ${Color} ${FlexFullCenter} ${CalibriBold}`

  return (
    <>
      <div className={Classes} onClick={actEvent}>
        {image ? <img src={image} alt="" className='w-[30%]' /> : null}
        <p>{CustomContext ? CustomContext : Context}</p>
      </div>
    </>
  )
}