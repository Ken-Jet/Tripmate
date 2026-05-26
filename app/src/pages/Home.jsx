import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { QuickBox } from '../component/QuickBox.jsx';
import { Overlay } from '../component/Overlay.jsx';
import { FormModel } from '../component/FormModel.jsx';
import { PhotoModal } from '../component/PhotoModal.jsx';
import { ActionButton } from '../component/ActionButton.jsx';
import { Calibri,CalibriBold } from '../../font/font.jsx';
import { FlexCenterCol,FlexCol,FlexFullCenter } from '../shortcut/Flex.jsx';
import { ShowPhoto } from '../component/ShowPhoto.jsx';
import { Side } from '../component/Side.jsx';
import { ShowDate } from '../component/ShowDate.jsx';

export function Home({userinfo}) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState(null)
  const [file, setFiles] = useState(null)
  const [date, setDate] = useState({start : '', end : ''})
  const [title, setTitle] = useState(null)
  const [getData, setGetData] = useState(null)
  const [isOpenPhoto, setOpenPhoto] = useState (false)
  const [overlayPhoto, setOverlayPhoto] = useState(null)
  const [id, setId] = useState(null)
  const [openDate, setOpenDate] = useState(false)
  const [dateData, setDateData] = useState({
    _id : null,
    Title : null,
    TanggalPergi : null,
    TanggalPulang : null,
    Color : null
  })

  async function reqData () {
      const res= await fetch(`http://localhost:3000/api/getData?username=${userinfo}`)

      if(res.status == 400){
        setGetData('error')
      }

      if(res.status == 200) {
        let dataArr = await res.json()

        setGetData(dataArr)

      }
  }

  useEffect(() => {
    reqData()
  },[userinfo])

  function handleClose() {
    URL.revokeObjectURL(preview)
    setIsOpen(false)
    setPreview(null)
    setFiles(null)
    setDate({start : '', end : ''})
    setOverlayPhoto(null)
    setOpenPhoto(false)
    setId(null)
  }

  async function sendFiles() {
    const formData = new FormData()

    if(!title || !date.start || !date.end){
      alert('tolong diisi semuanya');
      return
    }

    let Color = ['#ffe499','#99e9ff','#ffa299','#99ff9b','#ca99ff']
    const rand = Math.floor(Math.random() * Color.length);

    formData.append('Judul', title)
    formData.append('startDate', date.start)
    formData.append('endDate', date.end)
    formData.append('username', userinfo)
    formData.append('color', Color[rand])

    if(file){
      formData.append('image', file)
    }

    const res = await fetch(`http://localhost:3000/api/sendFiles?user=${userinfo}`,{
      body : formData,
      method : 'POST'
    })

    if(res.status === 200) {

      reqData()
      setIsOpen(false)
    }

  }

  async function removePhoto () {
    const res = await fetch(`http://localhost:3000/api/removePhoto?photo=${overlayPhoto}&id=${id}&user=${userinfo}`)

    if(res.status == 200) {
      await handleClose();
      reqData();
    }
  }

  return (
    <>
      <div className="w-full h-screen relative flex flex-row">
        {/* Side */}
        <div className="w-[25%] h-full relative flex flex-col gap-15 pl-5 pt-5">
          <Side />

          <div className="absolute bottom-5 flex flex-row items-center gap-3">
            <img src="./../Image/Profile.png" alt="" className='w-[60px]' />
            <p className={`${Calibri} text-[20px]`}>{userinfo? userinfo : 'Guest'}</p>
          </div>
        </div>

        {/* Main */}
        <div className="w-full relative flex flex-col items-center align-center pt-10">
          <p className={`${CalibriBold} font-bold text-[50px]`}>Apakah ada rencana ?</p>

          <div className="w-[30%] h-fit bg-[#75F94C] mt-5 rounded-[20px] relative flex flex-row items-center pt-1 pb-1 pl-3 pr-3 hover:cursor-pointer">
            <img src="./../Image/Plus.png" alt="" className='w-[50px] ml-10' />
            <button className={`${CalibriBold} font-bold text-[25px]`} onClick={() => setIsOpen(true)}>Buat Jadwal Baru</button>
          </div>

          <QuickBox title="Jadwal hari ini" getData={getData} mode={'date'} setOpenDate={setOpenDate} setDateData={setDateData}/>
          <QuickBox title="Foto Anda" getData={getData} mode={'file'} setOpenPhoto={setOpenPhoto} setOverlayPhoto={setOverlayPhoto} setId={setId} userInfo={userinfo}/>
        </div>
      </div>

      <Overlay isOpen={isOpen}>
        <p className={`${CalibriBold} text-[35px] mt-3`}>Mau Kemana?</p>
        <br />
        <FormModel activeColumn={1} title='Judul Trip' isCaption={'single'} setTitle={setTitle} type='judul' captionContent={'Ini Caption'}/>
        <br />
        <FormModel activeColumn={2} title='Waktu Berangkat' isCaption={'double'} setTitle={setTitle} setDate={setDate} />

        <PhotoModal preview={preview} setPreview={setPreview} setFiles={setFiles} />
        <br />
        <div className={`relative ${FlexFullCenter} w-full gap-15`}>
          <ActionButton action={'oke'} image={'./../Image/Checked.png'} actEvent={sendFiles} />
          <ActionButton action={'batal'} image={'./../Image/Cancel.png'} actEvent={handleClose} />
        </div>
      </Overlay>

      <ShowPhoto isOpenPhoto={isOpenPhoto}>
        <img src={`http://localhost:3000/upload/${userinfo}/${overlayPhoto}`} alt=""  className='w-[50%] h-[50%] object-contain'/>

        <div className={`relative ${FlexFullCenter} w-[50%] gap-5`}>
          <ActionButton  image={'./../Image/Cancel.png'} CustomContext={'Tutup'} action={'batal'} actEvent={handleClose}/>
          <ActionButton CustomContext={`Hapus`} customColor={'bg-[#89abfa]'} image={'./../Image/Remove.png'} actEvent={removePhoto}/>
        </div>
      </ShowPhoto>

      <ShowDate openDate={openDate}>
        <div className="w-full h-screen relative flex items-center justify-center">
          <div className="w-[45%] h-fit flex flex-col justify-center shadow-lg rounded-xl p-10" style={{ backgroundColor: dateData?.Color }}>
            <p className={`${CalibriBold} text-center text-[30px] mb-8`}>{dateData?.Title}</p>

            <div className="flex flex-row justify-center gap-15">
              <div className="flex flex-col items-center text-center">
                <p className={`${CalibriBold} text-[20px]`}>Tanggal Berangkat</p>
                <p className={`${Calibri} text-[16px] mt-1`}>
                  {dateData?.TanggalPergi ? new Date(dateData.TanggalPergi).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : ''}
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <p className={`${CalibriBold} text-[20px]`}>Tanggal Pulang</p>
                <p className={`${Calibri} text-[16px] mt-1`}>
                  {dateData?.TanggalPulang ? new Date(dateData.TanggalPulang).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-row justify-center items-center gap-10 mt-12 w-full">
              <ActionButton CustomContext="Edit" customColor="bg-[#75F94C]" CustomClass="shadow-md w-[20%] p-1 pb-2 pt-2 rounded-[20px] text-[20px]" actEvent={() => navigate('/edit/' + dateData?._id, { state: dateData })} />
              <ActionButton action="batal" actEvent={() => setOpenDate(false)} CustomClass="shadow-md w-[20%] p-1 pb-2 pt-2 rounded-[20px] text-[20px]" />
            </div>
          </div>
        </div>
      </ShowDate>
    </>
  )
}
