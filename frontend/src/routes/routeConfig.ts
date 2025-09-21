import React from 'react'

// Lazy-loaded page components to avoid loading them all on first render
const Home = React.lazy(() => import('../pages/Home/Home'))
const Start = React.lazy(() => import('../pages/Start/Start'))
const ContentWriter = React.lazy(() => import('../pages/ContentWriter/ContentWriter'))

// Authentication
const RegisterPage = React.lazy(() => import('../pages/RegisterPage/RegisterPage'))
const OnboardingPage = React.lazy(() => import('../pages/OnboardingPage/OnboardingPage'))
const LoginPage = React.lazy(() => import('../pages/LoginPage/LoginPage'))

// Admin 
const Admin = React.lazy(() => import('../pages/AdminPages/Admin/Admin'))
const AdminUsers = React.lazy(() => import('../pages/AdminPages/AdminUsers/AdminUsers'))
const InviteUser = React.lazy(() => import('../pages/AdminPages/InviteUsers/InviteUsers'))

// Dashboard
const Dashboard = React.lazy(() => import('../pages/DashboardPages/DashboardOverview/Dashboard'))
const DashboardForms = React.lazy(() => import('../pages/DashboardPages/DashboardForms/DashboardForms'))
const FormDetailPage = React.lazy(() => import('../pages/DashboardPages/FormDetailPage/FormDetailPage'))


// UserProfilePage is a named export; map it to default for React.lazy
const UserProfilePage = React.lazy(() =>
    import('../pages/AdminPages/UserProfilePage/UserProfilePage').then((mod) => ({
        default: (mod as any).UserProfilePage || (mod as any).default,
    }))
)


interface RouteConfig {
    path: string,
    // using LazyExoticComponent so TS knows these are lazy components
    // allow any ComponentType to be safe for both function and class components
    element: React.LazyExoticComponent<React.ComponentType<any>>,
    isProtected: boolean,
}

export const routes: RouteConfig[]  = [
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