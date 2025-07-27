import { Users, UserPlus, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { User } from '../type/User';
import { fetchUsers } from '../utils/userService';

const DashboardPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [report, setReport] = useState<'added' | 'updated' | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const getReportData = () => {
    if (report === 'added') {
      return users.map((user) => ({
        ...user,
        reportDate: user.createdAt,
      }));
    }
    if (report === 'updated') {
      return users
        .filter((user) => user.updatedAt && user.updatedAt !== user.createdAt)
        .map((user) => ({
          ...user,
          reportDate: user.updatedAt,
        }));
    }
    return [];
  };

  const getAddedUsersCount = () => {
    return users.length;
  };

  const getUpdatedUsersCount = () => {
    return users.filter(
      (user) => user.updatedAt && user.updatedAt !== user.createdAt
    ).length;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            </div>
            <Users className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Users Added</p>
              <p className="text-3xl font-bold text-green-600">
                {getAddedUsersCount()}
              </p>
            </div>
            <UserPlus className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Users Updated</p>
              <p className="text-3xl font-bold text-orange-600">
                {getUpdatedUsersCount()}
              </p>
            </div>
            <Edit className="h-12 w-12 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-4">Reports</h2>

        <div className="mb-4">
          <label
            htmlFor="report-select"
            className="block text-sm font-medium mb-2"
          >
            Select a report type:
          </label>
          <select
            id="report-select"
            value={report}
            onChange={(e) =>
              setReport(e.target.value as 'added' | 'updated' | '')
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Choose a report --</option>
            <option value="added">User Added Report</option>
            <option value="updated">User Updated Report</option>
          </select>
        </div>

        {report && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              {report === 'updated' ? (
                <Edit className="h-5 w-5 text-orange-600" />
              ) : (
                <UserPlus className="h-5 w-5 text-green-600" />
              )}
              <h3 className="font-medium text-lg">
                {report === 'updated'
                  ? 'Recently Updated Users'
                  : 'All Added Users'}
              </h3>
            </div>

            {getReportData().length > 0 ? (
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {report === 'updated' ? 'Updated At' : 'Added At'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getReportData().map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.reportDate
                              ? new Date(user.reportDate).toLocaleString()
                              : 'N/A'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 italic">
                  {report === 'updated'
                    ? 'No users have been updated yet.'
                    : 'No users found.'}
                </p>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
              <strong>
                Total {report === 'updated' ? 'updated' : 'added'} users:
              </strong>{' '}
              {getReportData().length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
