import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCandidates,
    fetchStats,
    setSearchTerm,
    setStatusFilter,
    clearFilters,
} from "../store/slices/candidatesSlice";
import CandidateCard from "../components/CandidateCard";
import ReferralForm from "../components/ReferralForm";
import StatsDashboard from "../components/StatsDashboard";

const Dashboard = () => {
    const dispatch = useDispatch();
    const {
        items: candidates,
        loading,
        error,
        stats,
        searchTerm,
        statusFilter,
    } = useSelector((state) => state.candidates);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        dispatch(fetchCandidates({ search: searchTerm, status: statusFilter }));
        dispatch(fetchStats());
    }, [dispatch, searchTerm, statusFilter]);

    const handleSearch = (e) => {
        dispatch(setSearchTerm(e.target.value));
    };

    const handleStatusFilter = (e) => {
        dispatch(setStatusFilter(e.target.value));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    if (loading && candidates.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading candidates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Candidate Referral Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Manage and track your referred candidates
                    </p>
                </div>

                {/* Stats Dashboard */}
                <StatsDashboard stats={stats} />

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by name or job title..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full lg:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={handleStatusFilter}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Hired">Hired</option>
                            </select>

                            {(searchTerm || statusFilter) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            Refer Candidate
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="text-red-400">⚠️</span>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error
                                </h3>
                                <p className="text-sm text-red-700 mt-1">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Candidates Grid */}
                {candidates.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No candidates found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || statusFilter
                                ? "Try adjusting your search or filters"
                                : "Get started by referring your first candidate"}
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            Refer Candidate
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {candidates.map((candidate) => (
                            <CandidateCard
                                key={candidate._id}
                                candidate={candidate}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Referral Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Refer a Candidate
                                </h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <span className="text-2xl">×</span>
                                </button>
                            </div>
                            <ReferralForm onClose={() => setShowForm(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
