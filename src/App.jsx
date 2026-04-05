import { Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MasterHome from './pages/MasterHome';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import Items from './pages/Items';
import AddItem from './pages/AddItem';
import Billing from './pages/Billing';
import InvoicePage from './pages/InvoicePage';

function MainLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main-col">
        <Header />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<MasterHome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/items" element={<Items />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/invoice/:invoiceRef" element={<InvoicePage />} />
      </Route>
    </Routes>
  );
}
