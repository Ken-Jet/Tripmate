import {CalibriBold, Calibri} from './../../font/font.jsx';
import { FlexCenterCol,FlexCol,FlexFullCenter, FlexFullCenterCol } from '../shortcut/Flex.jsx';

export function FormModel({ title, isCaption, activeColumn, setTitle, setDate , noMargin, columnFull, setUser , setPass, type, errCaption, captionContent, customClass,getUsername, getPasword}) {
  var Column = null;
  var Caption = null;
  var contentCaption = captionContent

  const handlers = {
    'judul' : setTitle,
    'user' : setUser,
    'password' : setPass,
    'getUser' : getUsername,
    'getPass' : getPasword
  }

  const WhatFunction = (e) => {
    handlers[type]?.(e.target.value);
  }

  function dateChange(e) {
    const { name, value } = e.target
    
    setDate((prev) => ({
      ...prev,
      [name] : new Date(value)
    }))

  }

  switch (activeColumn) {
    case 1: Column = <input className={`${columnFull ? 'w-full' : 'w-[92%]'} bg-[#bababa] pb-1 pt-1 rounded-[20px] mt-1`} onChange={WhatFunction} />
      break
    case 2: Column = <div className='relative flex justify-between w-[92%] mt-1'><input type="date" name="start" id="" className='w-[40%] bg-[#bababa] rounded-[10px] p-1' onChange={dateChange} /><input type="date" name="end" id="" className='w-[40%] bg-[#bababa] rounded-[10px] p-1' onChange={dateChange} /></div>
      break
    default: Column = <input className='w-[92%] bg-[#bababa] pb-1 pt-1 rounded-[20px]' />
  }

  switch (isCaption) {
    case 'single': Caption = <p className={`${Calibri} text-[14px] mt-2`}>{errCaption ? errCaption : captionContent}</p>
      break
    case 'double': Caption = <div className='w-[92%] relative flex justify-center flex-row gap-50 pr-5'><p className={`${Calibri} text-[14px] mt-2`}>Tanggal Berangkat</p><p className={`${Calibri} text-[14px] mt-2`}>Tanggal Pulang</p></div>
      break
  }

  return (
    <>
      <div className={`relative ${FlexCol} w-full ${noMargin ? null : `ml-10`} ${customClass ? customClass : null}`}>
        <p className={`${CalibriBold} text-[18px]`}>{title}</p>
        <div className={`relative ${FlexCol}`}>
          {Column}
          {Caption}
        </div>
      </div>
    </>
  )
}