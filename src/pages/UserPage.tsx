import { useEffect, useState } from 'react';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import {
  addUser,
  deleteUserById,
  fetchUsers,
  updateUser,
} from '../utils/userService';
import type { User } from '../type/User';
import UserForm from '../components/UserForm';

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const refreshUsers = () => fetchUsers().then(setUsers);

  useEffect(() => {
    refreshUsers();
  }, []);

  // const handleUserClick = (user: User) => {
  //   setSelectedUser(user);
  //   setIsEditing(false);
  //   setShowUserForm(true);
  // };
  const handleSubmit = async (data: User) => {
    if (isEditing && selectedUser) {
      await updateUser(selectedUser.id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await addUser({
        name: data.name,
        email: data.email,
      });
    }

    await refreshUsers();
    setShowUserForm(false);
    setSelectedUser(null);
    setIsEditing(false);
  };
  const deleteUser = async (id: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user?'
    );
    if (!confirmed) return;

    await deleteUserById(id);
    const updatedUsers = await fetchUsers();
    setUsers(updatedUsers);
    window.location.reload();
    if (selectedUser?.id === id) {
      setSelectedUser(null);
    }
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={() => {
            setSelectedUser(null);
            setIsEditing(false);
            setShowUserForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user?.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap cursor-pointer text-blue-600 hover:text-blue-800">
                  {user?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {user?.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">{user?.createdAt}</div>
                </td>
                <td className="flex align-center px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditing(true);
                      setShowUserForm(true);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteUser(user?.id)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showUserForm && (
        <UserForm
          user={isEditing ? selectedUser : undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowUserForm(false);
            setSelectedUser(null);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default UserPage;
