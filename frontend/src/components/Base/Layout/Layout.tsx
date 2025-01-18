import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
    <div>
        <header>Pin App</header>
        <main>
            {children}
        </main>
    </div>
);

export default Layout;