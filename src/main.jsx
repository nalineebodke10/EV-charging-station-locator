import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './views/user/Home'
import Contact from './views/user/Contact'
import About from './views/user/About'
import LoginRegister from './views/user/LoginRegister';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element= {<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<LoginRegister />} />
    </Routes>
  </BrowserRouter>
)
