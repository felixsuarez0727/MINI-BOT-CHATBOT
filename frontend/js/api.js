/**
 * API Service for XumtechBot
 * Handles all communication with the backend API
 */

class ApiService {
    constructor() {
        this.baseURL = window.location.origin;
        this.apiURL = `${this.baseURL}/api`;
        this.sessionId = this.generateSessionId();
    }

    /**
     * Generate a unique session ID for tracking conversations
     */
    generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Make HTTP requests with error handling
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.apiURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        try {
            const response = await fetch(url, defaultOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Send a message to the chatbot
     */
    async sendMessage(message) {
        try {
            const response = await this.makeRequest('/chatbot/message', {
                method: 'POST',
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId
                })
            });

            return response;
        } catch (error) {
            throw new Error('Could not send message. Please try again.');
        }
    }

    /**
     * Get bot configuration
     */
    async getBotConfig() {
        try {
            const response = await this.makeRequest('/chatbot/config');
            return response;
        } catch (error) {
            throw new Error('Could not load bot configuration.');
        }
    }

    /**
     * Check chatbot health
     */
    async checkHealth() {
        try {
            const response = await this.makeRequest('/chatbot/health');
            return response;
        } catch (error) {
            throw new Error('Could not verify service status.');
        }
    }

    /**
     * Check server health
     */
    async checkServerHealth() {
        try {
            const response = await this.makeRequest('/health');
            return response;
        } catch (error) {
            throw new Error('Could not verify server status.');
        }
    }

    /**
     * Login user (for admin features)
     */
    async login(username, password) {
        try {
            const response = await this.makeRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (response.success && response.data.token) {
                // Store token in localStorage
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response;
        } catch (error) {
            throw new Error('Login error.');
        }
    }

    /**
     * Verify authentication token
     */
    async verifyToken() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return { success: false, message: 'No token found' };
        }

        try {
            const response = await this.makeRequest('/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (error) {
            // Clear invalid token
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            return { success: false, message: 'Invalid token' };
        }
    }

    /**
     * Get current user info
     */
    async getCurrentUser() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return null;
        }

        try {
            const response = await this.makeRequest('/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.success ? response.data.user : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Get conversation statistics (admin only)
     */
    async getStats() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Authentication required');
        }

        try {
            const response = await this.makeRequest('/chatbot/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (error) {
            throw new Error('Could not get statistics.');
        }
    }

    /**
     * Get recent conversations (admin only)
     */
    async getRecentConversations(limit = 10) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Authentication required');
        }

        try {
            const response = await this.makeRequest(`/chatbot/conversations?limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (error) {
            throw new Error('Could not get conversations.');
        }
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return { success: true, message: 'Logged out successfully' };
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    /**
     * Get stored user data
     */
    getStoredUser() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Get authentication token
     */
    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    /**
     * Validate message before sending
     */
    validateMessage(message) {
        if (!message || typeof message !== 'string') {
            return { valid: false, error: 'Message must be a valid string.' };
        }

        const trimmedMessage = message.trim();
        if (trimmedMessage.length === 0) {
            return { valid: false, error: 'Message cannot be empty.' };
        }

        if (trimmedMessage.length > 500) {
            return { valid: false, error: 'Message cannot exceed 500 characters.' };
        }

        return { valid: true, message: trimmedMessage };
    }

    /**
     * Format timestamp for display
     */
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) {
            return 'Now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} min ago`;
        } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    /**
     * Debounce function for API calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Retry mechanism for failed requests
     */
    async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await requestFn();
            } catch (error) {
                if (i === maxRetries - 1) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }
}

// Create and export API service instance
const apiService = new ApiService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
} 