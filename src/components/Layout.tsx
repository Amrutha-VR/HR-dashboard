import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, Network, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../hooks';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/org-chart', label: 'Org Chart', icon: Network },
];

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/70">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
              <Users size={16} className="text-amber-100" />
            </div>
            <div>
              <span className="text-sm font-bold text-neutral-800 tracking-tight">CoreHR</span>
              <span className="text-[10px] text-neutral-400 ml-1.5 font-medium">HRIS</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-neutral-800 text-amber-50 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800 hover:bg-stone-100'
                  }`
                }
              >
                <item.icon size={15} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side — user badge + logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-neutral-700">HR Admin</p>
              <p className="text-[10px] text-neutral-400">People Operations</p>
            </div>

            <div className="relative group">
              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-amber-100 text-xs font-bold cursor-pointer">
                HR
              </div>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg border border-neutral-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.08)] py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right scale-95 group-hover:scale-100 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-neutral-600 hover:bg-stone-50 hover:text-neutral-900 transition-colors"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
