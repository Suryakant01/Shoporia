import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = ({ handleLogout }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header handleLogout={handleLogout} />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;