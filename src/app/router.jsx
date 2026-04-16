import { createBrowserRouter, Navigate } from 'react-router-dom'

import AuthLayout from '../components/layout/AuthLayout'
import DoctorLayout from '../components/layout/DoctorLayout'
import AdminLayout from '../components/layout/AdminLayout'

import LoginPage from '../features/auth/LoginPage'
import DoctorDashboard from '../features/doctor/DoctorDashboard'
import CreatePrescriptionPage from '../features/doctor/CreatePrescriptionPage'
import PrescriptionDetailPage from '../features/doctor/PrescriptionDetailPage'
import AdminDashboard from '../features/admin/AdminDashboard'
import MedicineManagementPage from '../features/admin/MedicineManagementPage'
import StockManagementPage from '../features/admin/StockManagement'
import IncomingRequestPage from '../features/admin/IncomingRequestPage'
import CreateTransferRequestPage from '../features/admin/CreateTransferRequestPage'

// import AddPatientPage from '../features/doctor/AddPatientPage'


const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },

  {
    path: '/doctor',
    element: <DoctorLayout />,
    children: [
      { path: 'dashboard', element: <DoctorDashboard /> },
      { path: 'prescription/create', element: <CreatePrescriptionPage /> },
      { path: 'prescription/:id', element: <PrescriptionDetailPage /> },
      // { path: 'patient/add', element: <AddPatientPage /> },
    ],
  },

  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'medicine', element: <MedicineManagementPage /> },
      { path: 'stock', element: <StockManagementPage /> },
      { path: 'incoming-request', element: <IncomingRequestPage /> },
      { path: 'request/create', element: <CreateTransferRequestPage /> },
      { path: 'prescription/:id', element: <PrescriptionDetailPage /> },
      
    ],
  },

  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])

export default router
