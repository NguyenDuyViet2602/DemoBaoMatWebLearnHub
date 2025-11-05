// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LoginPopup from './LoginPopup';
import SignupPopup from './SignupPopup';

function Header() {
  const [openBrowse, setOpenBrowse] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const browseRef = useRef(null);
  const accountRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (browseRef.current && !browseRef.current.contains(e.target)) setOpenBrowse(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setOpenAccount(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setOpenAccount(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setOpenAccount(false);
  };

  const handleInfoClick = () => {
    navigate('/profile');
    setOpenAccount(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container px-6 flex h-16 items-center gap-4">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-white font-extrabold">m</span>
          <span className="font-bold text-lg tracking-tight">MyCourse.io</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-500">
          <div ref={browseRef} className="relative">
            <button onClick={() => setOpenBrowse((v) => !v)} className="hover:text-gray-900 transition-colors flex items-center gap-1">
              Duyệt
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M7 10l5 5 5-5z" /></svg>
            </button>
            {openBrowse && (
              <div className="absolute left-0 mt-2 w-48 rounded-lg border bg-white p-2 shadow-lg z-50">
                <a className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50" href="#">Lập trình</a>
                <a className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50" href="#">Thiết kế</a>
                <a className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50" href="#">Kinh doanh</a>
                <a className="block rounded-md px-3 py-2 text-sm hover:bg-gray-50" href="#">Marketing</a>
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block">
            <SearchInput className="w-[280px] md:w-[360px]" />
          </div>
          <IconButton ariaLabel="Giỏ hàng">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-5"><path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6l-2 0" /><circle cx="9" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></svg>
          </IconButton>
          <IconButton ariaLabel="Thông báo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-5"><path d="M6 8a6 6 0 1112 0c0 7 2 5 2 7H4c0-2 2 0 2-7" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
          </IconButton>
          <div ref={accountRef} className="relative">
            <IconButton ariaLabel="Tài khoản" onClick={() => setOpenAccount((v) => !v)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-5"><circle cx="12" cy="8" r="4" /><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
            </IconButton>
            {openAccount && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border bg-white p-2 shadow-lg z-50">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        setShowLoginPopup(true);
                        setOpenAccount(false);
                      }}
                      className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => {
                        setShowSignupPopup(true);
                        setOpenAccount(false);
                      }}
                      className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Đăng ký
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleProfileClick}
                      className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <FaUser className="inline mr-2" /> Profile
                    </button>
                    <button
                      onClick={handleInfoClick}
                      className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <FaInfoCircle className="inline mr-2" /> Thông tin
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <FaSignOutAlt className="inline mr-2" /> Đăng xuất
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="sm:hidden border-t p-3">
        <SearchInput />
      </div>

      {showLoginPopup && (
        <LoginPopup
          onClose={() => {
            setShowLoginPopup(false);
            setIsLoggedIn(!!localStorage.getItem('token'));
          }}
        />
      )}

      {showSignupPopup && (
        <SignupPopup
          onClose={() => {
            setShowSignupPopup(false);
            setIsLoggedIn(!!localStorage.getItem('token'));
          }}
        />
      )}
    </header>
  );
}

function SearchInput({ className }) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className || ''}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        aria-label="Tìm kiếm khóa học"
        placeholder="Tìm kiếm khóa học"
        className="w-full rounded-full border bg-white pl-9 pr-4 h-10 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />
    </form>
  );
}

function IconButton({ children, ariaLabel, onClick }) {
  return (
    <button onClick={onClick} aria-label={ariaLabel} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
      {children}
    </button>
  );
}

export default Header;
