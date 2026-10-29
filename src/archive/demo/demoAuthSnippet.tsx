import React from "react";

export interface DemoLoginHelpers {
  handleQuickDemoAlumni: (
    setIdentifier: (val: string) => void,
    setPassword: (val: string) => void
  ) => void;
  handleAdminDemo: (
    setIdentifier: (val: string) => void,
    setPassword: (val: string) => void
  ) => void;
}

export const demoAuthHelpers: DemoLoginHelpers = {
  handleQuickDemoAlumni: (setIdentifier, setPassword) => {
    setIdentifier("3079145847");
    setPassword("alumni#847");
  },
  handleAdminDemo: (setIdentifier, setPassword) => {
    setIdentifier("admin@smksasmitajaya2.sch.id");
    setPassword("Admin#12345");
  },
};

interface DemoActionButtonsProps {
  onQuickDemoAlumni: () => void;
  onQuickDemoAdmin: () => void;
}

export const DemoActionButtons: React.FC<DemoActionButtonsProps> = ({
  onQuickDemoAlumni,
  onQuickDemoAdmin,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
      <button
        type="button"
        onClick={onQuickDemoAlumni}
        className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium text-[11px] cursor-pointer"
      >
        Alumni (DEMO)
      </button>
      <button
        type="button"
        onClick={onQuickDemoAdmin}
        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-[11px] cursor-pointer"
      >
        Admin BKK
      </button>
    </div>
  );
};

