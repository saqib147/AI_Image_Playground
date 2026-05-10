import React from "react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  breadcrumb?: string; // e.g. "Tool / Generative Fill"
};

const Header = ({ title, subtitle, breadcrumb }: HeaderProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Breadcrumb pill */}
      {breadcrumb && (
        <div
          className="inline-flex items-center gap-2 w-fit rounded-full
                        border border-white/10 bg-white/[0.05] px-3 py-1.5"
        >
          {/* Status dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
          <span className="text-[12px] font-medium text-white/50 tracking-wide">
            {breadcrumb}
          </span>
        </div>
      )}

      {/* Page title */}
      <h2 className="h2-bold text-dark-600">{title}</h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="p-16-regular text-white/50 max-w-[560px] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Header;
