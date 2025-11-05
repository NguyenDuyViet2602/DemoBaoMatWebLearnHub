import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Info = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/v1/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="container mx-auto p-4">Loading...</div>;
    if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>
            {user && (
                <>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Họ và tên:</strong> {user.fullname}</p>
                    <p><strong>Vai trò:</strong> {user.role}</p>
                    {user.userDetails && (
                        <>
                            <p><strong>Ngày sinh:</strong> {user.userDetails.dob || 'Chưa cập nhật'}</p>
                            <p><strong>Giới tính:</strong> {user.userDetails.gender || 'Chưa cập nhật'}</p>
                            <p><strong>Số điện thoại:</strong> {user.userDetails.phone || 'Chưa cập nhật'}</p>
                            <p><strong>Địa chỉ:</strong> {user.userDetails.address || 'Chưa cập nhật'}</p>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Info;