import './App.css';
import Main from './pages/Main';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MainSignIn from './pages/MainSignIn';
import Dm from './pages/Dm';

import EditModal from './components/EditModal';
import DmModal from './components/DmModal';

import {Routes,Route,useNavigate,Outlet} from 'react-router-dom' //router사용


export default function App() {
  return (
    <div className="App">

      {/* router 페이지 정의 */}
      <Routes>
        <Route path="*" element={<div>error 잘못된 주소입니다 error</div>}></Route>
        <Route path="/" element={<Main></Main>}></Route>
        {/* ㅣ임시 */}
        <Route path="/EditModal" element={<EditModal></EditModal>}></Route>
        <Route path="/DmModal" element={<DmModal></DmModal>}></Route>
        
        <Route path="/SignIn" element={<SignIn></SignIn>}></Route>
        <Route path="/SignUp" element={<SignUp></SignUp>}></Route>
        <Route path="/MainSignIn" element={<MainSignIn></MainSignIn>}></Route>
        <Route path="/Dm" element={<Dm></Dm>}></Route>

      </Routes>
    </div>
  )
}


