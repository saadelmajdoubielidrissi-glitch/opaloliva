import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext';
import Home from './pages/Home';
import PaymentSuccess from './pages/PaymentSuccess';
import Admin from './pages/Admin';
import './index.css';

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
