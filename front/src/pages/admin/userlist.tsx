import React, { useState } from 'react';
import { Users, Plus, Shield, MapPin, Calendar, Mail, Phone } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

interface NewStaff {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
}

const GovLandUserList: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: '001',
      name: 'Ahmad bin Abdullah',
      email: 'ahmad.abdullah@govland.gov.my',
      phone: '+60123456789',
      role: 'Land Officer',
      department: 'Land Management',
      joinDate: '2023-01-15',
      status: 'active'
    },
    {
      id: '002',
      name: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@govland.gov.my',
      phone: '+60123456790',
      role: 'Senior Surveyor',
      department: 'Survey & Mapping',
      joinDate: '2022-08-20',
      status: 'active'
    },
    {
      id: '003',
      name: 'Raj Kumar',
      email: 'raj.kumar@govland.gov.my',
      phone: '+60123456791',
      role: 'Data Analyst',
      department: 'IT Services',
      joinDate: '2023-03-10',
      status: 'active'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newStaff, setNewStaff] = useState<NewStaff>({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: ''
  });

  const departments: string[] = [
    'Land Management',
    'Survey & Mapping',
    'IT Services',
    'Legal Affairs',
    'Finance',
    'Administration'
  ];

  const roles: string[] = [
    'Land Officer',
    'Senior Land Officer',
    'Surveyor',
    'Senior Surveyor',
    'Data Analyst',
    'System Administrator',
    'Legal Advisor',
    'Finance Officer'
  ];

  const handleInputChange = (field: keyof NewStaff, value: string): void => {
    setNewStaff(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateId = (): string => {
    return String(staff.length + 1).padStart(3, '0');
  };

  const handleAddStaff = (): void => {
    if (!newStaff.name || !newStaff.email || !newStaff.role || !newStaff.department) {
      alert('Please fill in all required fields');
      return;
    }

    const staffToAdd: Staff = {
      id: generateId(),
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      role: newStaff.role,
      department: newStaff.department,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setStaff(prev => [...prev, staffToAdd]);
    setNewStaff({ name: '', email: '', phone: '', role: '', department: '' });
    setShowAddForm(false);
  };

  const getStatusColor = (status: string): string => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Staff Management Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Staff Management</h2>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Staff</span>
              </button>
            </div>
          </div>

          {/* Add Staff Form */}
          {showAddForm && (
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Staff Member</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newStaff.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="name@govland.gov.my"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newStaff.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+60123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={newStaff.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStaff}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Staff
                </button>
              </div>
            </div>
          )}

          {/* Staff List */}
          <div className="p-6">
            <div className="grid gap-4">
              {staff.map((member) => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                        <p className="text-blue-600 font-medium">{member.role}</p>
                        <p className="text-gray-600 text-sm">{member.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                      <p className="text-gray-500 text-sm mt-1">ID: {member.id}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total Staff: {staff.length}</span>
              <span>Active: {staff.filter(s => s.status === 'active').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovLandUserList;