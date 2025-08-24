import { User, ApiResponse } from '@/types';

// Mock data
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'John Teacher',
    email: 'john.teacher@example.com',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '6',
    name: 'David Brown',
    email: 'david.brown@example.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
  },
];

export const usersService = {
  async getUsers(): Promise<ApiResponse<User[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: MOCK_USERS,
      message: 'Users retrieved successfully',
      success: true,
    };
  },

  async updateUserRole(userId: string, role: 'admin' | 'teacher' | 'student'): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      role,
      updatedAt: new Date().toISOString(),
    };

    return {
      data: MOCK_USERS[userIndex],
      message: 'User role updated successfully',
      success: true,
    };
  },

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    MOCK_USERS.splice(userIndex, 1);

    return {
      data: undefined,
      message: 'User deleted successfully',
      success: true,
    };
  },
};
