import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/api';
import Toast from '../components/Toast';
import { Inbox, Send, Check, X, RotateCcw, Loader2, BookOpen, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  PENDING: { label: 'Pending', class: 'status-pending' },
  APPROVED: { label: 'Approved', class: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rejected', class: 'bg-red-100 text-red-700' },
  BORROWED: { label: 'Borrowed', class: 'status-borrowed' },
  RETURNED: { label: 'Returned', class: 'bg-gray-100 text-gray-700' },
  CANCELLED: { label: 'Cancelled', class: 'bg-gray-100 text-gray-500' },
};

export default function Requests() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('incoming');
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadRequests(); }, [user]);

  const loadRequests = async () => {
    try {
      const [incoming, mine] = await Promise.all([
        requestService.getIncomingRequests(user?.id),
        requestService.getMyRequests(user?.id),
      ]);
      setIncomingRequests(incoming);
      setMyRequests(mine);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    setActionLoading(requestId);
    try {
      await requestService.approveRequest(requestId, user.id);
      setToast({ message: 'Request approved!', type: 'success' });
      loadRequests();
    } catch (error) {
      setToast({ message: 'Failed to approve request', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    try {
      await requestService.rejectRequest(requestId, user.id);
      setToast({ message: 'Request rejected', type: 'success' });
      loadRequests();
    } catch (error) {
      setToast({ message: 'Failed to reject request', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkReturned = async (requestId) => {
    setActionLoading(requestId);
    try {
      await requestService.markAsReturned(requestId, user.id);
      setToast({ message: 'Marked as returned!', type: 'success' });
      loadRequests();
    } catch (error) {
      setToast({ message: 'Failed to mark as returned', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const renderRequestCard = (request, isIncoming) => {
    const status = statusConfig[request.status] || statusConfig.PENDING;
    return (
      <div key={request.reqId} className="glass-card-solid p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{request.bookTitle}</h3>
              <p className="text-sm text-gray-500">{request.bookAuthor}</p>
            </div>
          </div>
          <span className={`status-badge ${status.class}`}>{status.label}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {isIncoming ? request.requesterName : request.ownerName}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {request.requestDate && format(new Date(request.requestDate), 'MMM d, yyyy')}
          </span>
        </div>
        {request.message && (
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-4">"{request.message}"</p>
        )}
        {isIncoming && request.status === 'PENDING' && (
          <div className="flex gap-2">
            <button onClick={() => handleApprove(request.reqId)} disabled={actionLoading === request.reqId}
              className="flex-1 ios-button bg-green-500 text-white hover:bg-green-600 py-2.5 text-sm flex items-center justify-center gap-1">
              {actionLoading === request.reqId ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Approve</>}
            </button>
            <button onClick={() => handleReject(request.reqId)} disabled={actionLoading === request.reqId}
              className="flex-1 ios-button bg-red-500 text-white hover:bg-red-600 py-2.5 text-sm flex items-center justify-center gap-1">
              <X className="w-4 h-4" /> Reject
            </button>
          </div>
        )}
        {isIncoming && request.status === 'BORROWED' && (
          <button onClick={() => handleMarkReturned(request.reqId)} disabled={actionLoading === request.reqId}
            className="w-full ios-button-primary py-2.5 text-sm flex items-center justify-center gap-1">
            {actionLoading === request.reqId ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RotateCcw className="w-4 h-4" /> Mark as Returned</>}
          </button>
        )}
      </div>
    );
  };

  const currentRequests = activeTab === 'incoming' ? incomingRequests : myRequests;

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Requests</h1>
        <p className="text-gray-500 mt-1">Manage your book exchange requests</p>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <button onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'incoming' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}>
          <Inbox className="w-4 h-4" /> Incoming
          {incomingRequests.filter(r => r.status === 'PENDING').length > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
              {incomingRequests.filter(r => r.status === 'PENDING').length}
            </span>
          )}
        </button>
        <button onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'sent' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}>
          <Send className="w-4 h-4" /> Sent
        </button>
      </div>
      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
      ) : currentRequests.length === 0 ? (
        <div className="text-center py-20 glass-card-solid">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            {activeTab === 'incoming' ? <Inbox className="w-8 h-8 text-gray-400" /> : <Send className="w-8 h-8 text-gray-400" />}
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No {activeTab} requests</h3>
          <p className="text-gray-500">{activeTab === 'incoming' ? "You haven't received any book requests yet" : "You haven't sent any book requests yet"}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentRequests.map(req => renderRequestCard(req, activeTab === 'incoming'))}
        </div>
      )}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

