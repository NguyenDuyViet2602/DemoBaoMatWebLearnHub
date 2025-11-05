import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const withAuthorization = (allowedRoles) => (WrappedComponent) => {
    return (props) => {
        const token = localStorage.getItem('token');

        if (!token) {
            return <Navigate to="/" replace />;
        }

        const [userRole, setUserRole] = React.useState(null);
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
            const fetchRole = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/v1/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserRole(response.data.role);
                } catch (error) {
                    console.error('Error fetching role:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRole();
        }, [token]);

        if (loading) return <div>Loading...</div>;

        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/" replace />;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuthorization;