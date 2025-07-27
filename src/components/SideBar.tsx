import { useEffect, useState } from 'react';
import { fetchUsers } from '../utils/userService';
import type { User } from '../type/User';
import { Users, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const SideBar = () => {
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const users = await fetchUsers();
        const sorted = [...users].sort((a, b) => a.name.localeCompare(b.name));
        setTopUsers(sorted.slice(0, 3));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">User Management</h1>
      </div>
      <nav className="space-y-2">
        <Link to="/">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-700 cursor-pointer ${
              currentView === 'dashboard' ? 'bg-gray-700' : ''
            }`}
          >
            <Home size={20} />
            Dashboard
          </button>
        </Link>
        <Link to="/users">
          <button
            onClick={() => setCurrentView('users')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-700 cursor-pointer ${
              currentView === 'users' ? 'bg-gray-700' : ''
            }`}
          >
            <Users size={20} />
            Users
          </button>
        </Link>

        <div className="ml-4">
          <div className="text-sm text-gray-400 mb-2">User List</div>
          {loading ? (
            <div className="text-sm text-gray-500 px-3 py-1">Loading...</div>
          ) : topUsers.length > 0 ? (
            topUsers.map((user) => (
              <Link
                key={user.id}
                to={`/users/${user?.id}`}
                className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-700 rounded truncate cursor-pointer transition-colors duration-200"
              >
                {user?.name}
              </Link>
            ))
          ) : (
            <div className="text-sm text-gray-500 px-3 py-1">
              No users found
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
