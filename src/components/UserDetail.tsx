import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, Clock } from 'lucide-react';
import { fetchUsers } from '../utils/userService';
import type { User } from '../type/User';

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        setError('User ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const users = await fetchUsers();
        const foundUser = users.find((u) => u.id === parseInt(id));

        if (foundUser) {
          setUser(foundUser);
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Error loading user details');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading user details...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-600 text-lg mb-4">
            {error || 'User not found'}
          </div>
          <Link
            to="/users"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Users
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/users"
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Users
          </Link>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-4">
              {/* <User size={48} className="text-white" /> */}
              User
            </div>
            <div className="text-white">
              <h2 className="text-3xl font-bold">{user?.name}</h2>
              <p className="text-blue-100 text-lg">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Basic Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {/* <User size={18} className="text-gray-500" />
                   */}
                  User
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <p className="text-gray-900">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-500" />
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-[18px] h-[18px] bg-blue-500 rounded text-white flex items-center justify-center text-xs font-bold">
                    ID
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      User ID
                    </label>
                    <p className="text-gray-900">#{user?.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Timeline
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-green-500" />
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Created At
                    </label>
                    <p className="text-gray-900">
                      {formatDate(user?.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-orange-500" />
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {user.updatedAt && user.updatedAt !== user.createdAt
                        ? formatDate(user?.updatedAt)
                        : 'Never updated'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-[18px] h-[18px] bg-purple-500 rounded text-white flex items-center justify-center text-xs">
                    ⚡
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {user.updatedAt && user.updatedAt !== user.createdAt && (
            <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-orange-600" />
                <h4 className="font-medium text-orange-800">Recent Update</h4>
              </div>
              <p className="text-sm text-orange-700">
                This user was last updated on {formatDate(user?.updatedAt)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
