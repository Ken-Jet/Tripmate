import { FlexCenterCol,FlexCol,FlexFullCenter } from '../shortcut/Flex.jsx';
import {CalibriBold, Calibri} from './../../font/font.jsx';

export function PhotoModal({ preview, setPreview, setFiles }) {

  function PreviewFoto(e) {
    const file = e.target.files[0]

    if (file) {
      setFiles(file)
      const url = URL.createObjectURL(file)
      setPreview(url)
    }

  }

  return (
    <>
      <div className={`relative ${FlexCol} w-full ml-10 mt-5 h-[35%]`}>
        <p className={`${CalibriBold} text-[18px]`}>Foto</p>

        <div className={`w-[92%] h-full relative ${preview == null ? ' bg-[#bababa] opacity-[0.5] border-2 border-current border-dashed' : `opacity-[1]`} ${FlexFullCenter} flex-col`} htmlFor='Foto' style={preview != null ? { backgroundImage: `url(${preview})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } : {}}>
          <input type="file" name="" id="Foto" className='opacity-0 absolute inset-0' onChange={PreviewFoto} />

          {preview == null ? <>
            <p className={`${CalibriBold} text-[70px]`}>+</p>
            <p className={`${CalibriBold} text-[20px] relative bottom-5`}>Upload</p>
          </> : null}
        </div>
      </div>
    </>
  )
}