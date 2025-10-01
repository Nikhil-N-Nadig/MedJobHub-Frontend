import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { Search, X, MessageCircle, Building, User } from 'lucide-react';

const UserSearch = ({ onClose, onUserSelect }) => {
  const { searchUsers, startChat, error } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

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
        setSearchResults(response.users);
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
        setSearchResults(response.users);
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
    try {
      await startChat(user.id);
      onUserSelect();
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  return (
    <div className="user-search-overlay">
      <div className="user-search-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Start New Chat</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Search Form */}
        <div className="search-form">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
          </div>
          
          <div className="role-filter">
            <label>Filter by role:</label>
            <select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              className="role-select"
            >
              <option value="">All Users</option>
              <option value="employer">Employers</option>
              <option value="job_seeker">Job Seekers</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="search-results">
          {loading ? (
            <div className="loading-results">
              <div className="loading-spinner"></div>
              <p>Searching users...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="empty-results">
              <MessageCircle size={48} className="empty-icon" />
              <p>
                {searchQuery ? 
                  'No users found matching your search.' : 
                  'No users available to chat with.'
                }
              </p>
            </div>
          ) : (
            <div className="results-list">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="user-result-item"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="user-info">
                    <div className="user-header">
                      <h4 className="user-name">{user.name}</h4>
                      <span className={`user-role ${user.role}`}>
                        {user.role === 'employer' ? (
                          <Building size={14} />
                        ) : (
                          <User size={14} />
                        )}
                        {user.role === 'employer' ? 'Employer' : 'Job Seeker'}
                      </span>
                    </div>
                    
                    <div className="user-details">
                      {user.company && (
                        <p className="user-company">{user.company}</p>
                      )}
                      <p className="user-email">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="chat-action">
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