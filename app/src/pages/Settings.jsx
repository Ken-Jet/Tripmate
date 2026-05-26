import { useState } from 'react';
import { Side } from '../component/Side.jsx';
import { Calibri, CalibriBold } from '../../font/font.jsx';

export function Settings({ userinfo }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <>
      <div className="w-full h-screen relative flex flex-row">
        {/* Side */}
        <div className="w-[25%] h-full relative flex flex-col gap-15 pl-5 pt-5">
          <Side />

          <div className="absolute bottom-5 flex flex-row items-center gap-3">
            <img src="./../Image/Profile.png" alt="" className='w-[60px]' />
            <p className={`${Calibri} text-[20px]`}>{userinfo ? userinfo : 'Guest'}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full relative flex flex-col items-start align-center pt-10 pl-10">
          <p className={`${CalibriBold} font-bold text-[50px] mb-10`}>Personalisasi</p>

          <div className="flex flex-row items-center gap-5">
            <p className={`${Calibri} text-[25px]`}>Darkmode</p>
            
            {/* Switch Button */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#75F94C]"></div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
