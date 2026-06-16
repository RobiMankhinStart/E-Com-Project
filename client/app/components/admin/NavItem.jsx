import React from "react";
import Link from "next/link";

const NavItem = ({ icon, label, href, active = false, onClick }) => {
  const baseClasses = `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
    active
      ? "bg-indigo-50 text-indigo-600"
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
  }`;

  // Fix: Explicitly separate standard Buttons from Next.js Links
  if (onClick) {
    return (
      <button onClick={onClick} className={baseClasses} type="button">
        {icon}
        {label}
      </button>
    );
  }

  // Next.js Link guarantees a safe string fallback if href is somehow missing
  return (
    <Link href={href || "#"} className={baseClasses}>
      {icon}
      {label}
    </Link>
  );
};

export default NavItem;
