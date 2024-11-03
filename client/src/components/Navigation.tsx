import {
  Bell,
  Calendar,
  Home,
  BarChart,
  Users,
  Settings,
  Target,
  BookOpen,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
        isActive
          ? 'bg-blue-100 text-blue-600'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </Link>
  );
};

const Navigation = () => {
  return (
    <nav className="h-full w-64 border-r bg-white p-4">
      <div className="space-y-4">
        <div className="px-4 py-2">
          <h2 className="text-xl font-bold text-gray-800">Campus Tracker</h2>
        </div>

        <div className="space-y-1">
          <NavLink to="/" icon={Home} label="Dashboard" />
          <NavLink to="/schedule" icon={Calendar} label="Schedule" />
          <NavLink to="/assignments" icon={BookOpen} label="Assignments" />
          <NavLink to="/progress" icon={BarChart} label="Progress" />
          <NavLink to="/goals" icon={Target} label="Academic Goals" />
          <NavLink to="/groups" icon={Users} label="Study Groups" />
          <NavLink to="/notifications" icon={Bell} label="Notifications" />
          <NavLink to="/settings" icon={Settings} label="Settings" />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
