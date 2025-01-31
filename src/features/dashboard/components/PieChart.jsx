import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'; // Correct import

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const RechartsPieChartComponent = ({ PayIn, status, title, method, razorCount, nullCount }) => {
    const COLORS = {
        SUCCESS: "#4CAF50", // Green (Success)  
        DROPPED: "#F44336", // Red (Dropped)  
        FAILED: "#9E9E9E", // Grey (Failed)   
        PENDING: "#FFC107", // Yellow (Pending)  
        DUPLICATE: "#673AB7", // Purple (Duplicate)  
        BANK_MISMATCH: "#2196F3", // Blue (Bank Mismatch)
        REJECTED: "#FF9800", // Orange (Rejected)  
        DISPUTE: "#795548", // Brown (Dispute)  
        ASSIGNED: "#FF0000", // Red (Assigned)  
    };


    const statusArray = Array.isArray(status) ? status : [];
    const methodArray = Array.isArray(method) ? method : [];

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
    const totalCountPie = statusCountArray.reduce((acc, curr) => acc + curr.value, 0);
    const statusRatios = Object.keys(countStatus).map((status) => {
        const statusCountValue = countStatus[status];
        const ratio = statusCountValue / totalCountPie; 
        return { status, ratio }; 
    });



    const totalCount = statusCountArray.reduce((acc, curr) => acc + curr.value, 0);
    // Step 1: Ensure each status gets at least 2% of the total space
    const minValue = totalCount * 0.02;  // 2% of total
    let remainingValue = totalCount - statusCountArray.length * minValue;  // Remaining space after applying 2%

    // Step 2: Apply the minimum 2% to each status
    const adjustedStatusCountArray = statusCountArray.map(item => ({
        ...item,
        value: minValue,  // Assign the minimum value first
    }));

    // Step 3: Calculate remaining space and distribute based on original proportions
    let remainingSpace = remainingValue;  // Remaining space after 2% for each
    const proportions = statusCountArray.map(item => item.value / totalCount); 

    // Step 4: Loop through statuses to allocate remaining space proportionally
    const finalStatusCountArray = adjustedStatusCountArray.map((item, index) => {
        const availableSpace = remainingSpace * proportions[index];
        item.value += availableSpace;
        remainingSpace -= availableSpace;
        return item;
    });

    // Step 5: If there is still remaining space (floating-point precision issue), distribute it among the first items
    if (remainingSpace > 0) {
        finalStatusCountArray[0].value += remainingSpace;
    }

    const CustomTooltip = ({ payload }) => {
        if (!payload || payload.length === 0) return null;

        const filteredPayload = payload.filter(item => item.name !== 'totalCountPie'); 
        const countStatus = statusArray.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});

        const statusCountArray = Object.keys(countStatus).map(key => ({
            name: key,
            value: countStatus[key],
        }));

        // If filteredPayload is empty after filtering out 'totalCountPie', return null
        if (filteredPayload.length === 0) return null;

        const totalCount = statusArray.length; 
        // Get the hovered status name and value from filteredPayload
        const { name, value } = filteredPayload[0];
        const hoveredStatus = statusCountArray.find(item => item.name === name);
        const hoveredStatusValue = hoveredStatus ? hoveredStatus.value : 0;

        // Calculate RazorPay and Manual counts
        const razorpayCountForStatus = PayIn.filter(
            (item) => item.status === name && item.method === "RazorPay"
        ).length;
        const manualCountForStatus = hoveredStatusValue - razorpayCountForStatus;

        // Calculate the ratios for all statuses
        const statusRatios = Object.keys(countStatus).map((status) => {
            const statusCountValue = countStatus[status]; 
            const ratio = statusCountValue / totalCount;
            return { status, ratio }; 
        });

        // Find the ratio for the hovered status
        const statusRatio = statusRatios.find((item) => item.status === name);


        return (
            <div className="custom-tooltip bg-white rounded-md p-4">
                <p>{`Count : ${hoveredStatusValue}`}</p> 

              
                {statusRatio && (
                    <p>{`${name} Ratio: [${(statusRatio.ratio * 100).toFixed(2)}%]`}</p>
                )}

               
                {razorpayCountForStatus > 0 && <p>RazorPay Count: {razorpayCountForStatus}</p>}
                {razorpayCountForStatus === 0 && <p>RazorPay Count: 0</p>}

                {manualCountForStatus > 0 && <p>Manual Count: {manualCountForStatus}</p>}
                {manualCountForStatus === 0 && <p>Manual Count: 0</p>}
            </div>
        );
    };

    return (
        <div className="pt-6 px-4 ">
            <h2 className="flex justify-center items-center text-[#6495ED] text-3xl font-bold">{title}</h2>
            <PieChart width={400} height={400}>
                <Pie
                    data={finalStatusCountArray}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    startAngle={90} // Rotate anticlockwise
                    endAngle={-450} // End at the opposite point (complete rotation)
                >
                    {finalStatusCountArray.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#8884d8"} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip razorCount={razorCount} />} />
                <Legend />
            </PieChart>
        </div>
    );
};

export default RechartsPieChartComponent;

