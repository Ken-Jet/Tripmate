import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Side } from '../component/Side.jsx';
import { ActionButton } from '../component/ActionButton.jsx';
import { Calibri, CalibriBold } from '../../font/font.jsx';

export function EditTrip({ userinfo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  
  // Dummy data for timeline blocks
  const [blocks, setBlocks] = useState([]);

  // if blocks already exist 
  // const [existblock, getBlock] = useState(null)

  // Trip details from Home.jsx state, or fallback if accessed directly
  const [tripData, setTripData] = useState({
    Title: state?.Title || 'Loading...',
    TanggalPergi: state?.TanggalPergi ? new Date(state.TanggalPergi) : new Date(),
    TanggalPulang: state?.TanggalPulang ? new Date(state.TanggalPulang) : new Date()
  });

  useEffect(() => {

    // Jika suatu saat user mengakses halaman ini langsung dari URL (tanpa lewat Home),
    // state dari useLocation akan kosong. Di sinilah Anda butuh fetch ke backend.
    if (!state) {
      // fetch(`/api/trip/${id}`).then(...)
    }
  }, [id, state]);

  // Efek jika user sudah ada datanya di dalam database (ini yang masuknya tetap dari home)
  useEffect(() => {
    async function fetchBlock () {
        const res = await fetch(`http://localhost:3000/api/getBlock?id=${id}`)

        if(res.status == 200) {
          let dataJSON = await res.json()

          setBlocks(dataJSON)
        }
    }

    fetchBlock()
  },[])

  const addBlock = () => {
    const newBlock = {
      id: Date.now(),
      time: '12:00',
      activity: '',
      description: '',
      photo: null
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (blockId, field, value) => {
    const updatedBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, [field]: value } : block
    );
    setBlocks(updatedBlocks);
  };

  const removeBlock = async (blockId) => {
    
    const res = await fetch(`http://localhost:3000/api/removeBlock?trip_id=${id}&id=${blockId}`)

    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const handlePhotoChange = (blockId, file) => {
    if (file) {
      // console.log('file type:', typeof file, file)
      updateBlock(blockId, 'photo', file);
    }
  };

  const saveSchedule = async () => {
    try {

      // blocks.forEach(b => {
      //   console.log(`block ${b.id} photo:`, b.photo, b.photo instanceof File)
      // })

      const formData = new FormData();
      formData.append('tripId', id);
      
      // Kita kirim data teks blok dalam bentuk JSON string
      const blocksData = blocks.map(b => ({
        id: b.id,
        time: b.time,
        activity: b.activity,
        description: b.description
      }));
      formData.append('blocks', JSON.stringify(blocksData));

      // Jika ada file foto, kita append ke formData
      blocks.forEach((block) => {
        if (block.photo && block.photo instanceof File) {
          // Namakan field sesuai id blok agar backend tahu foto ini untuk blok mana
          formData.append(`photo_${block.id}`, block.photo);
        }
      });

      const res = await fetch(`http://localhost:3000/api/saveBlock?user=${userinfo}`, {
        method: 'POST',
        body: formData
      });

      if (res.status === 200) {
        navigate('/home');
      } else {
        alert('Gagal menyimpan jadwal');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan jadwal');
    }
  };

  const goBack = () => {
    // getBlock(null)
    navigate(-1)
  }

  return (
    <div className="w-full h-screen relative flex flex-row bg-[#f8f9fa] overflow-hidden">
      {/* Side Navigation */}
      <div className="w-[25%] h-full relative flex flex-col gap-15 pl-5 pt-5 bg-white shadow-md z-10">
        <Side />
        <div className="absolute bottom-5 flex flex-row items-center gap-3">
          <img src="./../Image/Profile.png" alt="" className="w-[60px]" />
          <p className={`${Calibri} text-[20px]`}>{userinfo ? userinfo : 'Guest'}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[75%] h-full relative flex flex-col pt-10 px-10 overflow-y-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-8">
          <div className="flex flex-row items-center gap-5">
            <div 
              className="w-[50px] h-[50px] bg-white shadow-md rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100"
              onClick={goBack}
            >
              <img src="./../Image/Left.png" alt="Back" className="w-[25px]" onError={(e) => e.target.style.display = 'none'} />
              {/* Fallback if Back.png doesn't exist */}
              <span className={`${CalibriBold} text-[20px]`} style={{ display: 'none' }}>{'<'}</span>
            </div>
            <div>
              <p className={`${CalibriBold} text-[40px]`}>{tripData.Title}</p>
              <p className={`${Calibri} text-[18px] text-gray-500`}>
                {tripData.TanggalPergi.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} - {tripData.TanggalPulang.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="w-[200px]">
            <ActionButton CustomContext="Simpan Jadwal" customColor="bg-[#75F94C]" CustomClass="shadow-md w-full p-1 pb-2 pt-2 rounded-[20px] text-[20px]" actEvent={saveSchedule} />
          </div>
        </div>

        {/* Timeline Editor */}
        <div className="w-full bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-6">
          <p className={`${CalibriBold} text-[25px] mb-4`}>Itinerary Planner</p>
          
          {blocks.map((block, index) => (
            <div key={block.id} className="relative flex flex-row gap-6 p-5 border-l-4 border-[#75F94C] bg-gray-50 rounded-r-xl shadow-sm hover:shadow-md transition-shadow">
              
              {/* Time Column */}
              <div className="flex flex-col w-[15%]">
                <p className={`${CalibriBold} text-[16px] text-gray-500 mb-1`}>Waktu</p>
                <input 
                  type="time" 
                  value={block.time} 
                  onChange={(e) => updateBlock(block.id, 'time', e.target.value)}
                  className={`${CalibriBold} text-[22px] bg-transparent border-b-2 border-gray-300 focus:border-[#75F94C] outline-none w-full pb-1`}
                />
              </div>

              {/* Detail Column */}
              <div className="flex flex-col w-[60%] gap-3">
                <input 
                  type="text" 
                  placeholder="Nama Kegiatan (mis: Sarapan)"
                  value={block.activity}
                  onChange={(e) => updateBlock(block.id, 'activity', e.target.value)}
                  className={`${CalibriBold} text-[24px] bg-transparent border-none outline-none w-full`}
                />
                <textarea 
                  placeholder="Tambahkan catatan atau deskripsi..."
                  value={block.description}
                  onChange={(e) => updateBlock(block.id, 'description', e.target.value)}
                  className={`${Calibri} text-[18px] bg-white p-3 rounded-lg border border-gray-200 outline-none focus:border-[#75F94C] w-full resize-none h-[80px]`}
                />
              </div>

              {/* Photo & Actions Column */}
              <div className="flex flex-col w-[25%] items-center justify-center gap-4 border-l border-gray-200 pl-6">
                {block.photo ? (
                   <>
                    <label htmlFor={`gambar-${block.id}`}>
                      <img
                        src={typeof block.photo === 'string' ? block.photo : URL.createObjectURL(block.photo)}
                        alt="block"
                        className="w-[100px] h-[100px] object-cover rounded-xl shadow-sm cursor-pointer"
                      />
                    </label>

                    <input
                      id={`gambar-${block.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handlePhotoChange(block.id, e.target.files[0])
                      }
                    />
                  </>
                ) : (
                  <label className="w-[100px] h-[100px] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <p className={`${CalibriBold} text-[30px] text-gray-400`}>+</p>
                    <p className={`${Calibri} text-[14px] text-gray-500`}>Foto</p>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => handlePhotoChange(block.id, e.target.files[0])} 
                    />
                  </label>
                )}
                <button 
                  onClick={() => removeBlock(block.id)}
                  className={`${CalibriBold} text-[14px] text-red-500 hover:text-red-700 underline`}
                >
                  Hapus Blok
                </button>
              </div>
            </div>
          ))}

          {/* Add Block Button */}
          <div 
            className="w-full h-[80px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#75F94C] transition-all mt-4"
            onClick={addBlock}
          >
            <p className={`${CalibriBold} text-[22px] text-gray-400`}>+ Tambah Kegiatan Baru</p>
          </div>

        </div>
      </div>
    </div>
  );
}
