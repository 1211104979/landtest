import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  User,
  FileText,
  ArrowUpDown,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Hash,
  MapPin
} from 'lucide-react';
import TransactionRequest from '../modals/addTransactionModal'

// Enhanced mock data with more realistic transactions
const mockTransactions = [
  {
    id: 'TX-001',
    txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    type: 'Ownership Transfer',
    date: '2025-05-29T14:30:00Z',
    user: 'John Doe',
    userEmail: 'john.doe@landoffice.gov',
    propertyId: 'PROP-1234',
    propertyAddress: '123 Oak Street, Springfield, IL',
    status: 'Completed',
    amount: '2.5 ETH',
    gasUsed: '21,000',
    blockNumber: '18,234,567',
    fromAddress: '0xabc123...456def',
    toAddress: '0x789xyz...012abc',
    description: 'Transfer of residential property ownership from Jane Smith to John Doe'
  },
  {
    id: 'TX-002',
    txHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
    type: 'Land Registration',
    date: '2025-05-27T09:15:00Z',
    user: 'Alice Smith',
    userEmail: 'alice.smith@planning.gov',
    propertyId: 'PROP-5678',
    propertyAddress: '456 Maple Avenue, Denver, CO',
    status: 'Pending',
    amount: '1.8 ETH',
    gasUsed: '18,500',
    blockNumber: '18,233,890',
    fromAddress: '0xdef456...789ghi',
    toAddress: '0x321cba...654fed',
    description: 'Initial registration of commercial property in downtown district'
  },
  {
    id: 'TX-003',
    txHash: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
    type: 'Title Update',
    date: '2025-05-26T16:45:00Z',
    user: 'Bob Johnson',
    userEmail: 'bob.johnson@records.gov',
    propertyId: 'PROP-9012',
    propertyAddress: '789 Pine Road, Austin, TX',
    status: 'Failed',
    amount: '0.5 ETH',
    gasUsed: '15,200',
    blockNumber: '18,233,445',
    fromAddress: '0x456ghi...123jkl',
    toAddress: '0x987wvu...210tsr',
    description: 'Update property title information and zoning classification'
  },
  {
    id: 'TX-004',
    txHash: '0x4d5e6f7890abcdef1234567890abcdef12345678',
    type: 'Property Division',
    date: '2025-05-25T11:20:00Z',
    user: 'Carol Davis',
    userEmail: 'carol.davis@surveyor.gov',
    propertyId: 'PROP-3456',
    propertyAddress: '321 Elm Street, Phoenix, AZ',
    status: 'In Progress',
    amount: '3.2 ETH',
    gasUsed: '25,000',
    blockNumber: '18,232,998',
    fromAddress: '0x789jkl...456mno',
    toAddress: '0x654poi...987qwe',
    description: 'Division of large residential lot into two separate parcels'
  },
  {
    id: 'TX-005',
    txHash: '0x5e6f7890abcdef1234567890abcdef123456789a',
    type: 'Mortgage Record',
    date: '2025-05-24T13:10:00Z',
    user: 'David Wilson',
    userEmail: 'david.wilson@finance.gov',
    propertyId: 'PROP-7890',
    propertyAddress: '654 Cedar Lane, Seattle, WA',
    status: 'Completed',
    amount: '1.2 ETH',
    gasUsed: '19,800',
    blockNumber: '18,232,556',
    fromAddress: '0xabc890...345def',
    toAddress: '0x123rty...678uio',
    description: 'Recording of mortgage lien on residential property'
  }
];

type SortField = 'date' | 'type' | 'status' | 'amount';
type SortOrder = 'asc' | 'desc';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false)

  // Get unique transaction types and statuses for filters
  const transactionTypes = [...new Set(mockTransactions.map(tx => tx.type))];
  const transactionStatuses = [...new Set(mockTransactions.map(tx => tx.status))];

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = mockTransactions.filter(tx => {
      const matchesSearch = searchTerm === '' || 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.propertyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'amount':
          aValue = parseFloat(a.amount.replace(' ETH', ''));
          bValue = parseFloat(b.amount.replace(' ETH', ''));
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, statusFilter, typeFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'In Progress':
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const selectedTx = selectedTransaction ? 
    mockTransactions.find(tx => tx.id === selectedTransaction) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
              <p className="text-gray-600">Monitor and track all your blockchain transactions for land management operations here</p>
            </div>
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setTransactionModalOpen(true)}
            >
              <Download className="w-4 h-4 mr-2" />
            New Transaction
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{mockTransactions.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockTransactions.filter(tx => tx.status === 'Completed').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mockTransactions.filter(tx => tx.status === 'Pending' || tx.status === 'In Progress').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-purple-600">
                  {mockTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount.replace(' ETH', '')), 0).toFixed(1)} ETH
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Hash className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Statuses</option>
                {transactionStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <FileText className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Types</option>
                {transactionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="relative">
              <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Filter by date"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Date & Time
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('type')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Type
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User & Property
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('amount')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Amount
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Status
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedTransactions.map((tx) => {
                  const { date, time } = formatDate(tx.date);
                  
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{date}</span>
                          <span className="text-xs text-gray-500">{time}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{tx.id}</span>
                          <span className="text-xs text-gray-500 font-mono">
                            {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {tx.type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-sm font-medium text-gray-900">{tx.user}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{tx.propertyId}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{tx.amount}</span>
                          <span className="text-xs text-gray-500">Gas: {tx.gasUsed}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                          {getStatusIcon(tx.status)}
                          <span className="ml-1">{tx.status}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedTransaction(tx.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAndSortedTransactions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* New Transaction Modal */}
        <TransactionRequest
        isOpen={isTransactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSubmit={(formData) => {
          // Handle submission here (e.g., send to API or blockchain)
          console.log('Transaction request submitted:', formData)
        }}
      />
        {/* Transaction Detail Modal */}
        {selectedTx && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Transaction ID</label>
                    <p className="text-sm font-mono text-gray-900">{selectedTx.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedTx.status)}`}>
                      {getStatusIcon(selectedTx.status)}
                      <span className="ml-1">{selectedTx.status}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Transaction Hash</label>
                  <p className="text-sm font-mono text-gray-900 break-all bg-gray-50 p-2 rounded">
                    {selectedTx.txHash}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Block Number</label>
                    <p className="text-sm text-gray-900">{selectedTx.blockNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Gas Used</label>
                    <p className="text-sm text-gray-900">{selectedTx.gasUsed}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                  <p className="text-sm text-gray-900">{selectedTx.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">From Address</label>
                    <p className="text-sm font-mono text-gray-900">{selectedTx.fromAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">To Address</label>
                    <p className="text-sm font-mono text-gray-900">{selectedTx.toAddress}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Property Address</label>
                  <p className="text-sm text-gray-900">{selectedTx.propertyAddress}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}