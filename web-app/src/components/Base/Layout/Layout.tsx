import { ReactNode } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Container from '../Container';

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => (
    <div>
        <Header />
        <main>
            <Container>
                {children}
            </Container>
        </main>
        <Footer />
    </div>
);

export default Layout;