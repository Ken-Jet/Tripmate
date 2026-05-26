import {CalibriBold, Calibri} from './../../font/font.jsx'

export function MenuRow({ image, text, onClick }) {
  return (
    <>
      <div 
        className="size-fit relative flex flex-row gap-3 items-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onClick}
      >
        <img src={image} alt="" className='w-[50px]' />
        <p className={`${CalibriBold} text-[30px] font-bold`}>{text}</p>
      </div>
    </>
  )
}