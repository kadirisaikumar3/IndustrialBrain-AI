import React from "react";

function StatCard({
  title,
  value="-",
  icon: Icon,
  color = "text-cyan-500",
  bgColor = "bg-cyan-500/10",
}) {
  return (
    <div className="card-bg rounded-3xl border border-theme p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-secondary">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-primary">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${bgColor}`}
        >
          {Icon && (
            <Icon
              size={28}
              className={color}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default StatCard;