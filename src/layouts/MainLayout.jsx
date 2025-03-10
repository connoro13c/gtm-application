import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import SideDrawer from '../components/Navigation/SideDrawer';

function MainLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const handleDrawerStateChange = (isOpen) => {
    setIsDrawerOpen(isOpen);
  };

  return (
    <div className="flex h-screen bg-greyscale-3">
      {/* Sidebar */}
      <SideDrawer onDrawerStateChange={handleDrawerStateChange} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isDrawerOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Page header */}
        <div className="bg-greyscale-2 p-4 shadow-sm border-b border-greyscale-4 h-[57px] flex items-center">
          <h1 className="text-xl font-semibold text-white">GTM Application</h1>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-greyscale-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;