// src/pages/Properties.tsx
import React, { useState } from 'react';
import { Search, Filter, Eye, Edit3, Shield, Clock, CheckCircle, AlertTriangle, MapPin, User, Home, Calendar } from 'lucide-react';

interface Property {
  id: string;
  titleNumber: string;
  owner: string;
  ownerAddress: string;
  location: string;
  coordinates: string;
  area: string;
  propertyType: 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial';
  registrationDate: string;
  lastTransfer: string;
  status: 'Verified' | 'Pending' | 'Under Review' | 'Disputed' | 'Transferred';
  blockchainHash: string;
  surveyNumber: string;
  marketValue: string;
  encumbrances: string[];
}

const mockProperties: Property[] = [
  {
    id: 'PROP-001',
    titleNumber: 'TN-2024-001234',
    owner: 'Ahmad bin Abdullah',
    ownerAddress: 'No. 12, Jalan Merdeka, 50100 Kuala Lumpur',
    location: 'Lot 123, Seksyen 7, Shah Alam, Selangor',
    coordinates: '3.0738° N, 101.5183° E',
    area: '1,500 sqft (139.35 m²)',
    propertyType: 'Residential',
    registrationDate: '2024-03-15',
    lastTransfer: '2024-03-15',
    status: 'Verified',
    blockchainHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
    surveyNumber: 'SN-SHA-2024-001',
    marketValue: 'RM 450,000',
    encumbrances: []
  },
  {
    id: 'PROP-002',
    titleNumber: 'TN-2024-001235',
    owner: 'Siti Nurhaliza binti Rahman',
    ownerAddress: 'No. 45, Jalan Bangsar, 59100 Kuala Lumpur',
    location: 'Lot 456, Seksyen 12, Petaling Jaya, Selangor',
    coordinates: '3.1319° N, 101.6841° E',
    area: '2,100 sqft (195.10 m²)',
    propertyType: 'Commercial',
    registrationDate: '2024-02-28',
    lastTransfer: '2024-01-10',
    status: 'Pending',
    blockchainHash: '0x8a0bfcde2d1e68b8c77bc9bd4bad4cf03efd0dd9cdd5dcf',
    surveyNumber: 'SN-PJ-2024-002',
    marketValue: 'RM 780,000',
    encumbrances: ['Bank Mortgage - CIMB Bank']
  },
  {
    id: 'PROP-003',
    titleNumber: 'TN-2024-001236',
    owner: 'Lim Wei Ming',
    ownerAddress: 'No. 78, Jalan Sultan, 46000 Petaling Jaya',
    location: 'Lot 789, Seksyen 3, Subang Jaya, Selangor',
    coordinates: '3.1478° N, 101.5870° E',
    area: '3,200 sqft (297.29 m²)',
    propertyType: 'Agricultural',
    registrationDate: '2024-01-20',
    lastTransfer: '2023-11-15',
    status: 'Under Review',
    blockchainHash: '0x9b1cfdcf3e2f79c9d88cd0ce5cbe5df04fge1ee0dee6edf',
    surveyNumber: 'SN-SJ-2024-003',
    marketValue: 'RM 320,000',
    encumbrances: ['Caveat - Land Office']
  },
  {
    id: 'PROP-004',
    titleNumber: 'TN-2024-001237',
    owner: 'Rajesh Kumar s/o Krishnan',
    ownerAddress: 'No. 23, Jalan Klang Lama, 58000 Kuala Lumpur',
    location: 'Lot 321, Seksyen 9, Klang, Selangor',
    coordinates: '3.0369° N, 101.4416° E',
    area: '1,800 sqft (167.23 m²)',
    propertyType: 'Industrial',
    registrationDate: '2024-04-05',
    lastTransfer: '2024-04-05',
    status: 'Disputed',
    blockchainHash: '0xac2dgeef4f3g80d0e99de1df6dcf6eg05hgh2ff1eff7feh',
    surveyNumber: 'SN-KL-2024-004',
    marketValue: 'RM 650,000',
    encumbrances: ['Legal Dispute - Case #2024-001']
  }
];

const statusConfig = {
  'Verified': { 
    color: 'bg-green-100 text-green-800 border-green-200', 
    icon: CheckCircle,
    description: 'Property verified and registered on blockchain'
  },
  'Pending': { 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    icon: Clock,
    description: 'Awaiting verification and blockchain registration'
  },
  'Under Review': { 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: Eye,
    description: 'Under review by land registration authorities'
  },
  'Disputed': { 
    color: 'bg-red-100 text-red-800 border-red-200', 
    icon: AlertTriangle,
    description: 'Property ownership or boundaries under dispute'
  },
  'Transferred': { 
    color: 'bg-purple-100 text-purple-800 border-purple-200', 
    icon: Shield,
    description: 'Property transferred to new owner'
  }
};

const propertyTypeConfig = {
  'Residential': { color: 'text-blue-600', icon: Home },
  'Commercial': { color: 'text-green-600', icon: Shield },
  'Agricultural': { color: 'text-yellow-600', icon: MapPin },
  'Industrial': { color: 'text-purple-600', icon: Shield }
};

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = 
      property.titleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || property.status === statusFilter;
    const matchesType = typeFilter === 'All' || property.propertyType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const PropertyModal = ({ property, onClose }: { property: Property; onClose: () => void }) => {
    const StatusIcon = statusConfig[property.status].icon;
    const TypeIcon = propertyTypeConfig[property.propertyType].icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Property Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${statusConfig[property.status].color}`}>
                <StatusIcon className="w-4 h-4 mr-2" />
                {property.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${propertyTypeConfig[property.propertyType].color}`}>
                <TypeIcon className="w-4 h-4 mr-2" />
                {property.propertyType}
              </span>
            </div>

            {/* Property Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Title Number</label>
                  <p className="text-lg font-mono text-gray-800">{property.titleNumber}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Property Owner</label>
                  <p className="text-gray-800">{property.owner}</p>
                  <p className="text-sm text-gray-600">{property.ownerAddress}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                  <p className="text-gray-800">{property.location}</p>
                  <p className="text-sm text-gray-600">{property.coordinates}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Area</label>
                  <p className="text-gray-800">{property.area}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Survey Number</label>
                  <p className="text-gray-800 font-mono">{property.surveyNumber}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Market Value</label>
                  <p className="text-lg font-semibold text-green-600">{property.marketValue}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Registration Date</label>
                  <p className="text-gray-800">{new Date(property.registrationDate).toLocaleDateString('en-MY')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Transfer</label>
                  <p className="text-gray-800">{new Date(property.lastTransfer).toLocaleDateString('en-MY')}</p>
                </div>
              </div>
            </div>

            {/* Blockchain Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Blockchain Information</h3>
              <p className="text-xs font-mono text-gray-800 break-all">{property.blockchainHash}</p>
            </div>

            {/* Encumbrances */}
            {property.encumbrances.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Encumbrances</h3>
                <ul className="space-y-1">
                  {property.encumbrances.map((enc, index) => (
                    <li key={index} className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                      {enc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
                <Edit3 className="w-4 h-4" />
                <span>Edit Property</span>
              </button>
              {property.status === 'Pending' && (
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Verify & Register</span>
                </button>
              )}
              <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Land Registration System</h1>
        <p className="text-gray-600">Government of Malaysia - Digital Land Registry</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title number, owner, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Disputed">Disputed</option>
              <option value="Transferred">Transferred</option>
            </select>
          </div>

          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified Properties</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockProperties.filter(p => p.status === 'Verified').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockProperties.filter(p => p.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockProperties.filter(p => p.status === 'Under Review').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disputed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockProperties.filter(p => p.status === 'Disputed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location & Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.map((property) => {
                const StatusIcon = statusConfig[property.status].icon;
                const TypeIcon = propertyTypeConfig[property.propertyType].icon;
                
                return (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${propertyTypeConfig[property.propertyType].color} bg-opacity-10`}>
                          <TypeIcon className={`h-5 w-5 ${propertyTypeConfig[property.propertyType].color}`} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {property.titleNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.propertyType}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {property.owner}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {property.ownerAddress}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {property.location}
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.area}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[property.status].color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {property.status}
                      </span>
                      {property.encumbrances.length > 0 && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Encumbered
                          </span>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {property.marketValue}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(property.registrationDate).toLocaleDateString('en-MY')}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleViewProperty(property)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 inline-flex items-center">
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      {property.status === 'Pending' && (
                        <button className="text-green-600 hover:text-green-900 inline-flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property Modal */}
      {selectedProperty && (
        <PropertyModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </div>
  );
}