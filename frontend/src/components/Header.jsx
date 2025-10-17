import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

const Header = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Candidate Referral System
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">
                            Welcome, {user?.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
