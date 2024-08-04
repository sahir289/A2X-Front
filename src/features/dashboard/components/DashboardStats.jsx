import { formatCurrency } from "../../../utils/utils";

function DashboardStats({
  title,
  icon,
  value,
  count,
  description,
  colorIndex,
}) {
  const COLORS = ["primary", "primary"];

  const getDescStyle = () => {
    if (description.includes("↗︎"))
      return "font-bold text-green-700 dark:text-green-300";
    else if (description.includes("↙"))
      return "font-bold text-rose-500 dark:text-red-400";
    else return "";
  };

  return (
    <div className="stats shadow">
      <div className="stat">
        {/* <div className={`stat-figure dark:text-slate-300 text-${COLORS[colorIndex%2]}`}>{icon}</div> */}
        <div className="stat-title dark:text-slate-300">
          {title} {!!count && `(${count})`}
        </div>
        <div
          className={`stat-value dark:text-slate-300 text-${
            COLORS[colorIndex % 2]
          }`}
        >
          {formatCurrency(value)}
        </div>
        {!!description && (
          <div className={"stat-desc  " + getDescStyle()}>{description}</div>
        )}
      </div>
    </div>
  );
}

export default DashboardStats;
