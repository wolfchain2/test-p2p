
import React from 'react';

const SummaryCard: React.FC<{ title: string; value: string; subtext?: string; valueColor?: string }> = ({ title, value, subtext, valueColor = "text-gray-800" }) => (
    <div className="bg-white p-5 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
        <h4 className="text-sm text-gray-500 mb-1.5">{title}</h4>
        <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
);

export default SummaryCard;
