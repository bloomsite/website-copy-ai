import 'react'
import Home from '../pages/Home/Home'
import Start from '../pages/Start/Start'
import ContentWriter from '../pages/ContentWriter/ContentWriter'

interface RouteConfig {
    path: string, 
    element: React.FC, 
    isProtected: Boolean, 
}

export const routes: RouteConfig[] = [
    {path: '/', element: Home, isProtected: false},
    {path: '/start', element: Start, isProtected: false},
    {path: '/content/:pageType', element: ContentWriter, isProtected: false},
] 