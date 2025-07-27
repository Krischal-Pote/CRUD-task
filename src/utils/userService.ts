import type { User } from '../type/User';

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch('/user.json');
    if (!response.ok) {
      throw new Error(
        `Failed to fetch users: ${response.status} ${response.statusText}`
      );
    }
    const users: User[] = await response.json();

    localStorage.setItem('users', JSON.stringify(users));

    return users;
  } catch (error) {
    console.warn(
      'Network request failed, trying localStorage fallback:',
      error
    );
    const local = localStorage.getItem('users');
    if (local) {
      return JSON.parse(local);
    }
    throw error;
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem('users', JSON.stringify(users));
}

export async function addUser(
  user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
): Promise<User> {
  const users = await fetchUsers();
  const newUser: User = {
    ...user,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}
export async function updateUser(id: number, updates: Partial<User>) {
  const users = await fetchUsers();
  const updated = users.map((u) =>
    u.id === id ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u
  );
  saveUsers(updated);
}

export async function deleteUserById(id: number) {
  const users = await fetchUsers();
  const filtered = users.filter((u) => u.id !== id);
  saveUsers(filtered);
}
