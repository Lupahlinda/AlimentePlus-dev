/**
 * Configuração de Rotas da Aplicação
 * 
 * Este arquivo define todas as rotas da aplicação usando React Router.
 * 
 * Características:
 * - Code-splitting com lazy loading para melhor performance
 * - Rotas protegidas para autenticação
 * - Layout consistente com cabeçalho
 * - Scroll automático para o topo nas mudanças de rota
 * - Feedback de carregamento durante o lazy loading
 */

import { BrowserRouter, Routes as RRDRoutes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from '@/components/Header';
import ProtectedRoute from './protected';
import ScrollToTop from '@/components/ScrollToTop';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const DonateForm = lazy(() => import('../pages/DonateForm'));
const MapView = lazy(() => import('../pages/MapView'));
const DonationDetails = lazy(() => import('../pages/DonationDetails'));
const History = lazy(() => import('../pages/History'));
const Events = lazy(() => import('../pages/Events'));
const RequestHelp = lazy(() => import('../pages/RequestHelp'));
const ReviewRequests = lazy(() => import('../pages/ReviewRequests'));
const NotFound = lazy(() => import('../pages/NotFound'));

const Routes = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Header />
    <Suspense fallback={<div className="section"><div className="card"><p>Carregando...</p></div></div>}>
      <RRDRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doar" element={<ProtectedRoute element={<DonateForm />} />} />
        <Route path="/mapa" element={<MapView />} />
        <Route path="/doacao/:id" element={<ProtectedRoute element={<DonationDetails />} />} />
        <Route path="/historico" element={<ProtectedRoute element={<History />} />} />
        <Route path="/eventos" element={<Events />} />
        <Route path="/solicitar" element={<RequestHelp />} />
        <Route path="/moderacao" element={<ReviewRequests />} />
        <Route path="*" element={<NotFound />} />
      </RRDRoutes>
    </Suspense>
  </BrowserRouter>
);

export default Routes;
