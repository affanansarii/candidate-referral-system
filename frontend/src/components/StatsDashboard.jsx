import React from "react";

const StatsDashboard = ({ stats }) => {
    const statusCounts = stats.byStatus || {};

    const statCards = [
        {
            title: "Total Candidates",
            value: stats.total || 0,
            color: "bg-blue-500",
            icon: "👥",
        },
        {
            title: "Pending",
            value: statusCounts.Pending || 0,
            color: "bg-yellow-500",
            icon: "⏳",
        },
        {
            title: "Reviewed",
            value: statusCounts.Reviewed || 0,
            color: "bg-blue-500",
            icon: "📋",
        },
        {
            title: "Hired",
            value: statusCounts.Hired || 0,
            color: "bg-green-500",
            icon: "✅",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                {stat.title}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsDashboard;
