// src/services/auth.service.js

const { users } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');
require('dotenv').config();

exports.loginService = async (email, password, options = {}) => {
    try {
        console.log('Login input:', { email, password }); // Debug input
        const mode = options.mode || 'secure';

        // Vulnerable path (raw SQL concatenation, bypass password)
        if (mode === 'vuln') {
            // Vulnerable login: raw SQL concatenation (single line).
            // Payload like: a@b.c' OR 1=1 --  (password anything) will bypass.
            const sql = `SELECT userid, fullname, email, role, passwordhash FROM users WHERE email = '${email}' AND passwordhash = '${password}' LIMIT 1`;
            console.log('🔴 VULN LOGIN SQL:', sql);
            const results = await users.sequelize.query(sql, { type: QueryTypes.SELECT });
            console.log('🔴 VULN LOGIN results:', results.length);
            if (results.length > 0) {
                const u = results[0];
                const token = jwt.sign(
                    { id: u.userid, role: u.role },
                    process.env.JWT_SECRET || 'default_secret',
                    { expiresIn: '1h' }
                );
                return {
                    token,
                    user: {
                        id: u.userid,
                        email: u.email,
                        full_name: u.fullname,
                        role: u.role,
                        profilepicture: u.profilepicture,
                    },
                    streak: null,
                };
            }
            // Fallback: allow normal login with bcrypt (so users vẫn đăng nhập bình thường ở chế độ vuln)
            const userFallback = await users.findOne({ where: { email } });
            if (!userFallback) throw new Error('Email hoặc mật khẩu không đúng');
            const isMatchFallback = await bcrypt.compare(password, userFallback.passwordhash);
            if (!isMatchFallback) throw new Error('Email hoặc mật khẩu không đúng');
            const token = jwt.sign(
                { id: userFallback.userid, role: userFallback.role },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '1h' }
            );
            return {
                token,
                user: {
                    id: userFallback.userid,
                    email: userFallback.email,
                    full_name: userFallback.fullname,
                    role: userFallback.role,
                    profilepicture: userFallback.profilepicture,
                },
                streak: null,
            };
        }

        // Secure path (default)
        const user = await users.findOne({ where: { email } });
        if (!user) {
            throw new Error('Email không tồn tại');
        }

        console.log('User found:', user); // Debug user data
        const isMatch = await bcrypt.compare(password, user.passwordhash);
        if (!isMatch) {
            throw new Error('Mật khẩu không đúng');
        }

        // Kiểm tra trước khi tạo token
        if (!user.userid || !user.role) {
            throw new Error('Dữ liệu user không hợp lệ');
        }

        const token = jwt.sign(
            { id: user.userid, role: user.role },
            process.env.JWT_SECRET || 'default_secret', // Fallback nếu JWT_SECRET undefined
            { expiresIn: '1h' }
        );

        return {
            token,
            user: {
                id: user.userid,
                email: user.email,
                full_name: user.fullname,
                role: user.role,
                profilepicture: user.profilepicture,
            },
        };
    } catch (error) {
        console.error('Login error:', error); // Debug lỗi
        throw error;
    }
};

exports.registerService = async (email, password, fullName, role = 'Student') => {
    try {
        console.log('Register input:', { email, password, fullName });
        const existingUser = await users.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email đã tồn tại');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await users.create({
            email,
            passwordhash: hashedPassword,
            fullname: fullName,
            role,
            profilepicture: null,
        });

        const token = jwt.sign(
            { id: user.userid, role: user.role },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '1h' }
        );

        return {
            token,
            user: {
                id: user.userid,
                email: user.email,
                full_name: user.fullname,
                role: user.role,
                profilepicture: user.profilepicture,
            },
        };
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};