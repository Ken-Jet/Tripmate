import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoxForm } from '../component/BoxForm.jsx';
import { FormModel } from '../component/FormModel.jsx';
import { ActionButton } from '../component/ActionButton.jsx';
import { Calibri, CalibriBold } from '../../font/font.jsx';

export function SignUp() {

  const [username, getUsername] = useState(null)
  const [password, getPassword] = useState(null)
  const navigate = useNavigate();

  async function createUser () {
    const formData = new FormData()
    
    if(!username || !password){
      alert('harus diisi')
    }

    formData.append('getusername' , username)
    formData.append('getpassword', password)

    const res = await fetch('http://localhost:3000/api/createUser', {
      method : 'POST',
      body : formData
    })

    if(res.status == 400){
      let data = await res.json()

      alert(data.message)
    }

    if(res.status == 200){
      alert('akun berhasil dibuat')
      navigate('/login')
    }

  }

  return (
    <div className="bg-[#75F94C] flex justify-center items-center flex-col w-full h-screen">
      <p className={`${CalibriBold} text-white font-bold text-[70px] relative`}>Tripmate</p>
      <p className={`${Calibri} text-white text-[35px] relative bottom-3`}>Every Trip has a moment</p>

      <BoxForm customWidth={'w-[45%]'} customClass={'top-5 items-center'}>
        <FormModel noMargin={true} activeColumn={1} title={'Username'} customClass={'pr-10 pl-10'} columnFull={true} getUsername={getUsername} type={'getUser'}/>
        <FormModel noMargin={true} activeColumn={1} title={'Password'} customClass={'pr-10 pl-10 bottom-2'} columnFull={true} getPasword={getPassword} type={'getPass'}/>

        <ActionButton CustomContext={'Sign Up'} customColor={'bg-[#75F94C]'}  CustomClass={'pb-1 pt-1 rounded-[20px] text-[20px] mt-3 bottom-2 w-[70%]'} actEvent={createUser}/>

        <p className={`${Calibri}`}>Have an account? just <span className={`underline decoration-solid text-blue-500 hover:cursor-pointer`} onClick={() => navigate('/login')}>Log in</span></p>
      </BoxForm>
    </div>
  )
}
