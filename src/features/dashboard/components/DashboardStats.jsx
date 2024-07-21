function DashboardStats({title, icon, value, description, colorIndex}){

    const COLORS = ["primary", "primary"]

    const getDescStyle = () => {
        if(description.includes("↗︎"))return "font-bold text-green-700 dark:text-green-300"
        else if(description.includes("↙"))return "font-bold text-rose-500 dark:text-red-400"
        else return ""
    }

    return(
        <div className="stats shadow" style={{width:'100%'}}>
            <div className="stat w-full">
                {/* <div className={`stat-figure dark:text-slate-300 text-${COLORS[colorIndex%2]}`}>{icon}</div> */}
                <div className="stat-title dark:text-slate-300">This Hour Deposit</div>
                <div className={`stat-value dark:text-slate-300 text-${COLORS[colorIndex%2]}`}>{value}</div>
                <div className={"stat-desc  " + getDescStyle()}>{description}</div>
            </div>
            <div className="stat w-full">
                {/* <div className={`stat-figure dark:text-slate-300 text-${COLORS[colorIndex%2]}`}>{icon}</div> */}
                <div className="stat-title dark:text-slate-300">Today's Deposit</div>
                <div className={`stat-value dark:text-slate-300 text-${COLORS[colorIndex%2]}`}>{value}</div>
                <div className={"stat-desc  " + getDescStyle()}>{description}</div>
            </div>
            <div className="stat w-full">
                {/* <div className={`stat-figure dark:text-slate-300 text-${COLORS[colorIndex%2]}`}>{icon}</div> */}
                <div className="stat-title dark:text-slate-300">Balance</div>
                <div className={`stat-value dark:text-slate-300 text-${COLORS[colorIndex%2]}`}>{value}</div>
                {/* <div className={"stat-desc  " + getDescStyle()}>{description}</div> */}
            </div>
        </div>
    )
}

export default DashboardStats
