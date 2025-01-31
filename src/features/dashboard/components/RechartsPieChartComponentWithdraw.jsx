import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'; // Correct import

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const RechartsPieChartComponentWithdraw = ({ statusWith, title, nullCount, methodWithdraw, PayOut, countsWithdraw, ekoCount }) => {

    const COLORS = {
        SUCCESS: "#4CAF50", // SUCCESS - Green    

        REVERSED: "#FFC107", // REJECTED - Orange  
        INITIATED: "#795548",//yellow
        REJECTED: "#673AB7", // DUPLICATE - Purple

    };


    const statusArray = Array.isArray(statusWith) ? statusWith : [];
    const methodArray = Array.isArray(methodWithdraw) ? methodWithdraw : [];

    if (statusArray.length === 0) {
        return <div>No status data available</div>;
    }

    const countStatus = statusArray.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});


    const statusCountArray = Object.keys(countStatus).map(key => ({
        name: key,
        value: countStatus[key],
    }));

    const CustomTooltip = ({ payload }) => {
        if (!payload || payload.length === 0) return null;

        const totalCount = statusArray.length;
        const { name, value } = payload[0];

        const statusRatios = Object.keys(countStatus).map((status) => {
            const statusCountValue = countStatus[status];
            const ratio = statusCountValue / totalCount;
            return { status, ratio };
        });

        const statusRatio = statusRatios.find((item) => item.status === name);

        return (
            <div className="custom-tooltip bg-white rounded-md p-4">
                <p>{`Count: ${value}`}</p>

                {statusRatio && (
                    <p>{`${name} Ratio: [${(statusRatio.ratio * 100).toFixed(2)}%]`}</p>
                )}

                <p>EkoPay Count: {ekoCount > 0 ? ekoCount : 0}</p>

                <p>Manual Count: {value - ekoCount > 0 ? value - ekoCount : 0}</p>
            </div>
        );
    };

    return (
        <div className="pt-6 px-4 ">
            <h2 className='flex justify-center items-center text-[#6495ED] text-3xl font-bold'>{title}</h2>
            <PieChart width={400} height={400}>  
                <Pie
                    data={statusCountArray}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    startAngle={90} // Rotate anticlockwise
                    endAngle={-450} // End at the opposite point (complete rotation)
                >
                    {statusCountArray.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#8884d8"} />
                    ))}
                </Pie>
                {/* Use the custom tooltip */}
                <Tooltip content={<CustomTooltip ekoCount={ekoCount} nullCount={nullCount} />} />
                <Legend />
            </PieChart>
        </div>
    );
};

export default RechartsPieChartComponentWithdraw;
