import { createBrowserRouter, Navigate } from 'react-router-dom'

import AuthLayout from '../components/layout/AuthLayout'
import DoctorLayout from '../components/layout/DoctorLayout'
import AdminLayout from '../components/layout/AdminLayout'

import LoginPage from '../features/auth/LoginPage'
import DoctorDashboard from '../features/doctor/DoctorDashboard'
import CreatePrescriptionPage from '../features/doctor/CreatePrescriptionPage'
import AdminDashboard from '../features/admin/AdminDashboard'
import MedicineManagementPage from '../features/admin/MedicineManagementPage'
import StockManagementPage from '../features/admin/StockManagement'
import IncomingRequestPage from '../features/admin/IncomingRequestPage'

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
      
    ],
  },

  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])

export default router
