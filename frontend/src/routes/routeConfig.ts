import 'react'
import Home from '../pages/Home/Home'

interface RouteConfig {
    path: string, 
    element: React.FC, 
    isProtected: Boolean, 
}

export const routes: RouteConfig[] = [
    {path: '/', element: Home, isProtected: false},
] 