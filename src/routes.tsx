import MarinePlatformPage from './pages/MarinePlatformPage';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  /** Accessible without login. Routes without this flag require authentication. Has no effect when RouteGuard is not in use. */
  public?: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: 'Marine Intelligence Platform',
    path: '/',
    element: <MarinePlatformPage />,
    public: true,
  }
];
