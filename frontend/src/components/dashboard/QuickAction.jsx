import React from "react";
import { ArrowRight } from "lucide-react";

function QuickAction({
  title,
  description,
  icon: Icon,
  onClick,
  color = "text-cyan-500",
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-3xl border border-theme card-bg p-6 text-left shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
            {Icon && (
              <Icon
                size={28}
                className={color}
              />
            )}
          </div>

          <div>

            <h3 className="text-lg font-bold text-primary">
              {title}
            </h3>

            <p className="mt-1 text-sm text-secondary">
              {description}
            </p>

          </div>

        </div>

        <ArrowRight
          size={22}
          className="text-secondary transition-transform duration-300 group-hover:translate-x-1"
        />

      </div>
    </button>
  );
}

export default QuickAction;