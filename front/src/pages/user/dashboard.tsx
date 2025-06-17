import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Shield, 
  MapPin, 
  FileText, 
  Users, 
  Settings, 
  Bell,
  Home,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Info,
  User,
  Building,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';

// TypeScript Interfaces
interface MetaMaskAccount {
  address: string;
  balance: string;
  isConnected: boolean;
}

interface LandRecord {
  id: string;
  title: string;
  location: string;
  area: string;
  status: 'Available' | 'Allocated' | 'Under Review' | 'Disputed';
  owner?: string;
  lastUpdated: string;
}

interface User {
  id: string;
  name: string;
  role: 'admin' | 'gov_staff' | 'user';
  walletAddress?: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

const GovernmentLandDashboard: React.FC = () => {
  // State Management
  const [account, setAccount] = useState<MetaMaskAccount>({
    address: '',
    balance: '',
    isConnected: false
  });
  
  const [currentUser] = useState<User>({
    id: '1',
    name: 'John Administrator',
    role: 'admin',
    walletAddress: '',
    joinDate: '2024-01-15',
    status: 'Active'
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample Data
  const [landRecords] = useState<LandRecord[]>([
    {
      id: '1',
      title: 'Commercial Plot A-101',
      location: 'Sector 15, New Town',
      area: '2.5 acres',
      status: 'Available',
      lastUpdated: '2024-12-15'
    },
    {
      id: '2',
      title: 'Residential Block B-205',
      location: 'Green Valley District',
      area: '1.8 acres',
      status: 'Allocated',
      owner: '0x1234...5678',
      lastUpdated: '2024-12-10'
    },
    {
      id: '3',
      title: 'Industrial Zone C-301',
      location: 'Economic Hub',
      area: '5.2 acres',
      status: 'Under Review',
      lastUpdated: '2024-12-12'
    }
  ]);


  // Status Badge Component
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Available': return 'bg-green-100 text-green-800 border-green-200';
        case 'Allocated': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Under Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Disputed': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  // Role Badge Component
  const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
    const getRoleColor = (role: string) => {
      switch (role) {
        case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'gov_staff': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'user': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const formatRole = (role: string) => {
      return role === 'gov_staff' ? 'Gov Staff' : role.charAt(0).toUpperCase() + role.slice(1);
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(role)}`}>
        {formatRole(role)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Security Notice */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Security Notice</h3>
              <p className="text-sm text-blue-700 mt-1">
                This system uses blockchain technology for secure land record management. 
                Always verify transactions before confirming.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Pending Applications', value: '23', icon: FileText, color: 'yellow' },
                { title: 'User Land Records', value: '1,247', icon: MapPin, color: 'blue' },
                { title: 'Total Land Records', value: '89', icon: Users, color: 'green' },
                { title: 'Monthly Revenue', value: '$12,450', icon: DollarSign, color: 'purple' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <div className={`bg-gradient-to-r from-${stat.color}-100 to-${stat.color}-200 p-3 rounded-lg`}>
                        <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { action: 'New land record created', user: 'Admin User', time: '2 hours ago', type: 'create' },
                    { action: 'Application approved', user: 'Gov Staff', time: '4 hours ago', type: 'approve' },
                    { action: 'User registered', user: 'New User', time: '6 hours ago', type: 'register' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'create' ? 'bg-blue-100' :
                        activity.type === 'approve' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'create' && <Plus className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'approve' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {activity.type === 'register' && <User className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">by {activity.user}</p>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Land Records Tab */}
        {activeTab === 'land-records' && (
          <div className="space-y-6">
            {/* Search and Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search land records..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                    <Plus className="h-4 w-4" />
                    <span>Add Record</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Land Records Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Land Records</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Area
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {landRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{record.title}</div>
                            <div className="text-sm text-gray-500">ID: {record.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.area}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={record.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.lastUpdated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Help Information */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-indigo-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-indigo-900">Need Help?</h3>
              <p className="text-sm text-indigo-700 mt-1">
                Contact our support team at support@govland.gov or check our documentation for more information 
                about using the land management system.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GovernmentLandDashboard;