import 'react'
import Home from '../pages/Home/Home'
import Start from '../pages/Start/Start'
import ContentWriter from '../pages/ContentWriter/ContentWriter'
import RegisterPage from '../pages/RegisterPage/RegisterPage'
import OnboardingPage from '../pages/OnboardingPage/OnboardingPage'
import LoginPage from '../pages/LoginPage/LoginPage'
import Admin from '../pages/Admin/Admin'
import Dashboard from '../pages/Dashboard/Dashboard'
import DashboardForms from '../pages/DashboardForms/DashboardForms'

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
    
    // Content Routes
    {path: '/dashboard/overview', element: Dashboard, isProtected: true},
    {path: '/dashboard/forms', element: DashboardForms, isProtected: true},

    // Private Routes
    {path: '/admin', element: Admin ,isProtected:true},
] 