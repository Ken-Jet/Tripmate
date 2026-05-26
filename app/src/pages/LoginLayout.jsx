import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoxForm } from '../component/BoxForm.jsx';
import { FormModel } from '../component/FormModel.jsx';
import { ActionButton } from '../component/ActionButton.jsx';
import { Calibri, CalibriBold } from '../../font/font.jsx';
import { FlexFullCenter } from '../shortcut/Flex.jsx';

export function LoginLayout ({setLogStatus, setUserInfo}) {

  const [username , setUser] = useState(null);
  const [password , setPass] = useState(null);
  const [error, setErr] = useState({
    'user' : null,
    'password' : null
  })
  
  const navigate = useNavigate();

  async function LoginCheck () { 
    let newErr = {
      'user' : null,
      'password' : null
    }

    if(!username){
      newErr.user = 'User wajib diisi'
    }

    if(!password){
      newErr.password = 'Password wajib diisi'
    }

    await setErr(newErr)

    const userData = new FormData()

    userData.append('username', username)
    userData.append('password', password)

    const checkLogin = await fetch('http://localhost:3000/api/isLogin',{
      method : 'POST',
      body : userData
    })

    if(checkLogin.status == 400) {
      alert('Username / Password salah')
    }

    if(checkLogin.status == 200) {
      setLogStatus(true)
      setUserInfo(username)
      navigate('/home')
    }

  }

  return (
    <>
      <div className={`relative flex flex-row size-screen`}>
        <div className={`bg-[#75F94C] h-screen w-[55%] relative ${FlexFullCenter} flex-col leading-[1.3]`}>
          <p className={`${CalibriBold} text-white text-[80px] font-bold`}>Tripmate</p>
          <p className={`${Calibri} text-white text-[25px] font-bold`}>Enjoy your trip</p>
        </div>

        <div className={`w-[45%] h-screen relative ${FlexFullCenter}`}>
          <BoxForm>
            <FormModel activeColumn={1} title={'Username'} noMargin={true} columnFull={true} setUser={setUser} type={'user'} errCaption={error.user} isCaption={'single'}/>
            <FormModel activeColumn={1} title={'Password'} noMargin={true} columnFull={true} setPass={setPass} type={'password'} errCaption={error.password} isCaption={'single'} customClass={'bottom-1'}/>
            <ActionButton CustomContext={'Login'} customColor={'bg-[#75F94C]'}  CustomClass={'relative pb-1 pt-1 rounded-[20px] text-[20px] mt-3 bottom-2 w-full'} actEvent={LoginCheck}/>

            <p className={`${Calibri}`}>Don't have account? just <span className={`underline decoration-solid text-blue-500 hover:cursor-pointer`} onClick={() => navigate('/signup')}>Sign up</span></p>
          </BoxForm>
        </div>
      </div>
    </>
  )
} 
