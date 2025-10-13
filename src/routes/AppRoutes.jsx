import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MapView from '../pages/MapView';
import DonateForm from '../pages/DonateForm';
import DonationDetails from '../pages/DonationDetails';
import History from '../pages/History';
import Events from '../pages/Events';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/donate" element={<DonateForm />} />
      <Route path="/donations/:id" element={<DonationDetails />} />
      <Route path="/history" element={<History />} />
      <Route path="/events" element={<Events />} />
    </Routes>
  );
}
