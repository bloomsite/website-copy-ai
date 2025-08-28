import 'react'
import Home from '../pages/Home/Home'
import Start from '../pages/Start/Start'
import ContentWriter from '../pages/ContentWriter/ContentWriter'

// Authentication
import RegisterPage from '../pages/RegisterPage/RegisterPage'
import OnboardingPage from '../pages/OnboardingPage/OnboardingPage'
import LoginPage from '../pages/LoginPage/LoginPage'

// Admin 
import Admin from '../pages/AdminPages/Admin/Admin'

// Dashboard
import Dashboard from '../pages/DashboardPages/DashboardOverview/Dashboard'
import DashboardForms from '../pages/DashboardPages/DashboardForms/DashboardForms'
import FormDetailPage from '../pages/DashboardPages/FormDetailPage/FormDetailPage'
import AdminUsers from '../pages/AdminPages/AdminUsers/AdminUsers'
import { UserProfilePage } from '../pages/AdminPages/UserProfilePage/UserProfilePage'
import InviteUser from '../pages/AdminPages/InviteUsers/InviteUsers'


interface RouteConfig {
    path: string, 
    element: React.FC, 
    isProtected: Boolean, 
}

export const routes: RouteConfig[] = [
    // Public Routes
    {path: '/', element: Home, isProtected: false},
    {path: '/start', element: Start, isProtected: false},
    {path: '/content/:pageType', element: ContentWriter, isProtected: false},
    {path: '/register', element: RegisterPage, isProtected: false},
    {path: '/login', element: LoginPage, isProtected: false},
    {path: '/onboarding', element: OnboardingPage, isProtected: true},
    
    // Dashboard Routes
    {path: '/dashboard/overview', element: Dashboard, isProtected: true},
    {path: '/dashboard/forms', element: DashboardForms, isProtected: true},
    {path: '/forms/:formId/v/:version', element: FormDetailPage, isProtected: true},


    // Private Routes
    {path: '/admin', element: Admin ,isProtected:true},
    {path: '/admin/users', element: AdminUsers ,isProtected:true},
    {path: '/admin/users/:userId', element: UserProfilePage ,isProtected:true},
    {path: '/admin/invite', element: InviteUser ,isProtected:true},
] 