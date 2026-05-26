import { MenuRow } from './MenuRow';
import { useNavigate } from 'react-router-dom';

export function Side() {
  const navigate = useNavigate();

  return (
    <>
      <MenuRow text="Home" image="./../Image/Home-Page.png" onClick={() => navigate('/home')} />
      <MenuRow text="Trip" image="./../Image/Airport.png" />
      <MenuRow text="Community" image="./../Image/People.png" />
      <MenuRow text="Settings" image="./../Image/Gear.png" onClick={() => navigate('/settings')} />
    </>
  )
}
