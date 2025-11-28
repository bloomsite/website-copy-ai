import React from 'react'

// Lazy-loaded page components to avoid loading them all on first render
// ******* HOME PAGE *********
// const Home = React.lazy(() => import('../pages/Home/Home'))
// ******* HOME PAGE *********


// Authentication
const LoginPage = React.lazy(() => import('../pages/AuthenticationPages/LoginPage/LoginPage'))
const AuthenticationPage = React.lazy(() => import('../pages/AuthenticationPage/AuthenticationPage'))
const SetPasswordPage = React.lazy(() =>
    import('../pages/AuthenticationPages/SetPasswordPage/SetPasswordPage').then((mod) => ({
        default: (mod as any).SetPasswordPage || (mod as any).default,
    }))
)
const ResetPasswordPage = React.lazy(() =>
    import('../pages/AuthenticationPages/ResetPasswordPage/ResetPasswordPage').then((mod) => ({
        default: (mod as any).ResetPasswordPage || (mod as any).default,
    }))
)

// Admin 
const Admin = React.lazy(() => import('../pages/AdminPages/Admin/Admin'))
const AdminUsers = React.lazy(() => import('../pages/AdminPages/AdminUsers/AdminUsers'))
const InviteUser = React.lazy(() => import('../pages/AdminPages/InviteUsers/InviteUsers'))
const CreateUser = React.lazy(() => import('../pages/AdminPages/CreateUsers/CreateUsers'))
const AdminAgents = React.lazy(() => import('../pages/AdminPages/AdminAgents/AdminAgents'))
const AgentProfile = React.lazy(() => import('../pages/AdminPages/AgentProfilePage/AgentProfilePage'))
const AdminForms = React.lazy(() => import('../pages/AdminPages/AdminForms/AdminForms'))
const AdminSettings = React.lazy(() => import('../pages/AdminPages/AdminSettings/AdminSettings'))
const AdminWorkflows = React.lazy(() => import('../pages/AdminPages/AdminWorkflows/AdminWorkflows'))
const SubmissionOverview = React.lazy(() => import('../pages/AdminPages/AdminSubmissions/AdminSubmissions'))
const SpecialAgent = React.lazy(() => import("../pages/AdminPages/SpecialAgentProfilePage/SpecialAgentProfilePage"))
const WorkflowProfile = React.lazy(() => import("../pages/AdminPages/WorkflowProfilePage/WorkflowProfilePage"))

// Miscellaneous
const PageNotFoundPage = React.lazy(() => import('../pages/MiscellaneousPages/PageNotFoundPage/PageNotFoundPage'))

// Dashboard
const DashboardForms = React.lazy(() => import('../pages/DashboardPages/DashboardForms/DashboardForms'))
const FormDetailPage = React.lazy(() => import('../pages/DashboardPages/FormDetailPage/FormDetailPage'))
const FormConfirmPage = React.lazy(() => import('../pages/DashboardPages/FormConfirmPage/FormConfirmPage'))


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
    {path: '/', element: DashboardForms, isProtected: false},
    {path: '/login', element: LoginPage, isProtected: false},
    
    // Dashboard Routes
    {path: '/dashboard/forms', element: DashboardForms, isProtected: true},
    {path: '/forms/:formId/v/:version', element: FormDetailPage, isProtected: true},
    {path: '/confirm/:formId/v/:version', element: FormConfirmPage, isProtected: true},

    // Admin Routes
    {path: '/admin', element: Admin ,isProtected:true},
    {path: '/admin/users', element: AdminUsers ,isProtected:true},
    {path: '/admin/users/:userId', element: UserProfilePage ,isProtected:true},
    {path: '/admin/invite', element: InviteUser ,isProtected:true},
    {path: '/admin/create-user', element: CreateUser,isProtected:true},
    {path: '/admin/submissions', element: SubmissionOverview, isProtected: true},
    {path: '/admin/agents', element: AdminAgents, isProtected: true},
    {path: '/admin/agents/:agentName', element: AgentProfile, isProtected: true},
    {path: '/admin/special-agents/:agentName', element: SpecialAgent, isProtected: true},
    {path: '/admin/workflows', element: AdminWorkflows, isProtected: true},
    {path: '/admin/forms', element: AdminForms, isProtected: true},
    {path: '/admin/settings', element: AdminSettings, isProtected: true},
    {path: '/admin/workflows/:workflowName', element: WorkflowProfile, isProtected: true},

    // Authorization and Diagnostics 
    {path: '/me', element: AuthenticationPage, isProtected: false },
    {path: '/set-password/:token', element: SetPasswordPage, isProtected: false },
    {path: '/reset-password/:token', element: ResetPasswordPage, isProtected: false },
    {path: '/forgot-password', element: ResetPasswordPage, isProtected: false },
    
    // 404
    {path: '*', element: PageNotFoundPage, isProtected: false },
] 