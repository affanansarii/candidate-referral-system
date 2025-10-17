import React from "react";
import { useDispatch } from "react-redux";
import {
    updateCandidateStatus,
    deleteCandidate,
} from "../store/slices/candidatesSlice";

const CandidateCard = ({ candidate }) => {
    const dispatch = useDispatch();

    const handleStatusChange = (newStatus) => {
        dispatch(
            updateCandidateStatus({
                id: candidate._id,
                status: newStatus,
            })
        );
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this candidate?")) {
            dispatch(deleteCandidate(candidate._id));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            case "Reviewed":
                return "bg-blue-100 text-blue-800";
            case "Hired":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {candidate.name}
                    </h3>
                    <p className="text-gray-600">{candidate.jobTitle}</p>
                    <p className="text-sm text-gray-500">{candidate.email}</p>
                    <p className="text-sm text-gray-500">{candidate.phone}</p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        candidate.status
                    )}`}
                >
                    {candidate.status}
                </span>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                    <select
                        value={candidate.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Hired">Hired</option>
                    </select>
                </div>

                <div className="flex space-x-2">
                    {candidate.resumeUrl && (
                        <a
                            href={`http://localhost:5000${candidate.resumeUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            View Resume
                        </a>
                    )}
                    <button
                        onClick={handleDelete}
                        className="text-sm text-red-600 hover:text-red-800 cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CandidateCard;
