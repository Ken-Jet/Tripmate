import {CalibriBold, Calibri} from './../../font/font.jsx';
import { FlexCenterCol,FlexCol,FlexFullCenter, FlexFullCenterCol } from '../shortcut/Flex.jsx';

export function QuickBox({ title, getData, setOpenPhoto , mode, setOverlayPhoto, setId, setOpenDate, setDateData, userInfo}) {

  let hasData;
  let isCentered;
  let number;

  if(getData){

    if(Array.isArray(getData)){
      isCentered = false

    } else {
      isCentered = true
      hasData = <p className={`${CalibriBold}`}>Belum Ada Jadwal</p>
    }
  }

  function openOverlay (photo, id) {
    setOpenPhoto(true)
    setOverlayPhoto(photo)
    setId(id)
  }

  function openDate (id, Judul , startDate , enddate, warna){
    setOpenDate(true)
    setDateData({
      _id: id,
      Title : Judul,
      TanggalPergi : startDate,
      TanggalPulang : enddate,
      Color : warna
    })
  }

  return (
    <>
      <div className="w-full relative flex flex-col pl-15 mt-10">
        <p className={`${Calibri} text-[22px]`}>{title}</p>

        <div className={`w-[95%] h-[175px] inset-shadow-sm/25 ${isCentered ? FlexFullCenter : 'relative flex flex-row items-center pr-2 pl-2' }`}>
          {mode == 'date' ? Array.isArray(getData) ? getData.map((item, index) => (
            <div className={`relative h-[90%] w-[15%] ${FlexCol} p-3 cursor-pointer`} style={{backgroundColor : item.Warna}} key={index} onClick={() => openDate(item._id, item.Judul, item.TanggalBerangkat, item.TanggalPulang, item.Warna)}>
              <p className={`${CalibriBold} text-[18px]`}>{item.Judul}</p>
              <p className={`${Calibri} text-[15px]`}>Tanggal Berangkat :  <br /> {new Date (item.TanggalBerangkat).toLocaleDateString('id-ID', {
                day : 'numeric',
                month : 'long',
                year : 'numeric'
              })}</p>
              <p className={`${Calibri} text-[15px]`}>Tanggal Pulang :  <br /> {new Date (item.TanggalPulang).toLocaleDateString('id-ID', {
                day : 'numeric',
                month : 'long',
                year : 'numeric'
              })}</p>
            </div>
          )) : hasData : null}

          {mode =='file' ? Array.isArray(getData) ? getData.map((item, index) => (
            item.LinkFoto == null ? null : <img src={`http://localhost:3000/upload/${userInfo}/${item.LinkFoto}`} alt="" className='p-3 w-[20%] h-full object-contain' key={index} onClick={() => openOverlay(item.LinkFoto,item._id)}/>
          )) : <p className={`${CalibriBold}`}>Tidak Ada Foto</p> : null}
        </div>
      </div>
    </>
  )
}

