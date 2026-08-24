import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './component/page/Home'
import Login from './component/page/Login'
import PolicyAgreePage from './component/page/PolicyAgreePage'
import Scrap from './component/page/Scrap'
import MyPagePre from './component/page/mypage/MyPagePre'
import PostDetail from './component/page/PostDetail'
import MarketRegister from './component/page/MarketRegister'
import SettingAndActivity from './component/page/SettingAndActivity'
import MyPageBuyer from './component/page/mypage/MyPageBuyer'
import MyPageSeller from './component/page/mypage/MyPageSeller'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/policy-agree-page" element={<PolicyAgreePage />} />
        <Route path="/scrap" element={<Scrap />} />
        <Route path="/mypage-pre" element={<MyPagePre />} />
        <Route path="/post-detail" element={<PostDetail />} />
        <Route path="/market-register" element={<MarketRegister />} />
        <Route path="/setting-and-activity" element={<SettingAndActivity />} />
        <Route path="/mypage-buyer" element={<MyPageBuyer />} />
        <Route path="/mypage-seller" element={<MyPageSeller />} />
      </Routes>
    </div>
  )
}

export default App
