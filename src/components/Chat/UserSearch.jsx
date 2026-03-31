import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { Search, X, MessageCircle, Building, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserSearch = ({ onClose, onUserSelect }) => {
  const { searchUsers, startChat, error, loadChatMessages } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const currentUser = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  // Search users
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await searchUsers(searchQuery, selectedRole);
      if (response.success) {
        let users = response.users || [];
        // Prevent employer -> employer messaging
        if (currentUser?.role === 'employer' && !selectedRole) {
          users = users.filter(u => u.role !== 'employer');
        }
        // Prevent job_seeker -> job_seeker messaging
        if (currentUser?.role === 'job_seeker' && !selectedRole) {
          users = users.filter(u => u.role !== 'job_seeker');
        }
        setSearchResults(users);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Load all users on mount
  useEffect(() => {
    handleLoadAllUsers();
  }, [selectedRole]);

  const handleLoadAllUsers = async () => {
    try {
      setLoading(true);
      const response = await searchUsers('', selectedRole);
      if (response.success) {
        let users = response.users || [];
        // Prevent employer -> employer messaging
        if (currentUser?.role === 'employer' && !selectedRole) {
          users = users.filter(u => u.role !== 'employer');
        }
        // Prevent job_seeker -> job_seeker messaging
        if (currentUser?.role === 'job_seeker' && !selectedRole) {
          users = users.filter(u => u.role !== 'job_seeker');
        }
        setSearchResults(users);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        handleLoadAllUsers();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedRole]);

  const handleUserClick = async (user) => {
    // block employer -> employer
    if (currentUser?.role === 'employer' && user.role === 'employer') {
      console.warn('Employers cannot message other employers');
      return;
    }
    
    // block job_seeker -> job_seeker
    if (currentUser?.role === 'job_seeker' && user.role === 'job_seeker') {
      console.warn('Job seekers cannot message other job seekers');
      return;
    }

    try {
      await startChat(user.id);
      await loadChatMessages(user.id);
      // navigate to chat and load that partner
      navigate(`/chat?partner=${user.id}`);
      onUserSelect();
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  return (
    <div className="msg-user-search-overlay">
      <div className="msg-user-search-modal">
        {/* Header */}
        <div className="msg-modal-header">
          <h2>Start New Chat</h2>
          <button className="msg-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Search Form */}
        <div className="msg-search-form">
          <div className="msg-search-input-wrapper">
            <Search size={20} className="msg-search-icon" />
            <input
              type="text"
              placeholder="Search by name or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="msg-search-input"
              autoFocus
            />
          </div>
          
          <div className="msg-role-filter">
            <label>Filter by role:</label>
            <select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              className="msg-role-select"
            >
              <option value="">All Users</option>
              <option value="employer">Employers</option>
              <option value="job_seeker">Job Seekers</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="msg-error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="msg-search-results">
          {loading ? (
            <div className="msg-loading-results">
              <div className="msg-loading-spinner"></div>
              <p>Searching users...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="msg-empty-results">
              <MessageCircle size={48} className="msg-empty-icon" />
              <p>
                {searchQuery ? 
                  'No users found matching your search.' : 
                  'No users available to chat with.'
                }
              </p>
            </div>
          ) : (
            <div className="msg-results-list">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="msg-user-result-item"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="msg-user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="msg-user-info">
                    <div className="msg-user-header">
                      <h4 className="msg-user-name">{user.name}</h4>
                      <span className={`msg-user-role ${user.role}`}>
                        {user.role === 'employer' ? (
                          <Building size={14} />
                        ) : (
                          <User size={14} />
                        )}
                        {user.role === 'employer' ? 'Employer' : 'Job Seeker'}
                      </span>
                    </div>
                    
                    <div className="msg-user-details">
                      {user.company && (
                        <p className="msg-user-company">{user.company}</p>
                      )}
                      <p className="msg-user-email">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="msg-chat-action">
                    <MessageCircle size={20} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;