import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const Navbar = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-20 glass-panel border-b border-blue-500/30 backdrop-blur-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <Link
              to="/dashboard"
              className="text-2xl font-black bg-gradient-to-r from-[#f59e0b] via-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent hover:drop-shadow-lg transition-all duration-200"
            >
              Prep Buddy
            </Link>
          </motion.div>
          <div className="flex items-center space-x-6">
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/dsa', label: 'DSA' },
              { to: '/core', label: 'Core' },
              { to: '/aptitude', label: 'Aptitude' },
              { to: '/jobs', label: 'Jobs' },
              { to: '/chat', label: 'Chat' },
            ].map((item) => (
              <motion.div key={item.to} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={item.to}
                  className="text-[#ffffff] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#f59e0b] hover:to-[#06b6d4] font-semibold transition-all duration-200 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#f59e0b] to-[#06b6d4] group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
            {user ? (
              <div className="relative ml-4" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-[#ffffff] transition-all duration-200 hover:drop-shadow-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f59e0b] via-[#8b5cf6] to-[#06b6d4] text-white font-bold flex items-center justify-center shadow-lg shadow-amber-500/40 border border-white/30 hover:border-white/60 transition-all duration-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <motion.span
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm"
                  >
                    ▼
                  </motion.span>
                </motion.button>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: dropdownOpen ? 1 : 0, y: dropdownOpen ? 0 : -10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-44 glass-card rounded-xl shadow-2xl shadow-amber-500/30 z-20 ${
                    dropdownOpen ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-[#ffffff] hover:bg-white/20 rounded-xl transition-all duration-200 font-semibold group"
                  >
                    <span className="bg-gradient-to-r from-[#f59e0b] to-[#06b6d4] bg-clip-text text-transparent">
                      Logout
                    </span>
                  </button>
                </motion.div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
