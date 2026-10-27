import React, { useState, useRef, useEffect, useMemo } from "react";
import { DEMO_USERS, DemoUser } from "@/data/demoUsers";
import {
  DemoLocksMap,
  isUserLockedByOther,
  fetchActiveDemoLocks,
} from "@/services/demoSessionService";
import {
  ChevronDown,
  Search,
  Lock,
  Check,
  X,
  Sparkles,
  User,
  ShieldCheck,
} from "lucide-react";

interface DemoUserSelectProps {
  selectedUser: string;
  onSelectUser: (username: string) => void;
  demoLocks: DemoLocksMap;
  disabled?: boolean;
}

export const DemoUserSelect: React.FC<DemoUserSelectProps> = ({
  selectedUser,
  onSelectUser,
  demoLocks,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "available" | "locked">(
    "all",
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when tapping outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Selected demo user details
  const currentSelectedUser = useMemo(() => {
    if (!selectedUser) return null;
    return DEMO_USERS.find(
      (u) => u.username.toLowerCase() === selectedUser.toLowerCase(),
    );
  }, [selectedUser]);

  // Compute status counts
  const { availableCount, lockedCount } = useMemo(() => {
    let available = 0;
    let locked = 0;
    for (const u of DEMO_USERS) {
      if (isUserLockedByOther(u.username, demoLocks)) {
        locked++;
      } else {
        available++;
      }
    }
    return { availableCount: available, lockedCount: locked };
  }, [demoLocks]);

  // Filter list based on search and tab
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DEMO_USERS.filter((u) => {
      const isLocked = isUserLockedByOther(u.username, demoLocks);

      // Filter Mode tab
      if (filterMode === "available" && isLocked) return false;
      if (filterMode === "locked" && !isLocked) return false;

      // Search Query
      if (!q) return true;
      return (
        u.username.toLowerCase().includes(q) ||
        u.nama.toLowerCase().includes(q) ||
        u.jurusan.toLowerCase().includes(q) ||
        u.jurusanShort.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, filterMode, demoLocks]);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) {
      fetchActiveDemoLocks();
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (u: DemoUser) => {
    const isLocked = isUserLockedByOther(u.username, demoLocks);
    if (isLocked) return; // Strictly prevent selecting locked user
    onSelectUser(u.username);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectUser("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        id="demo-user-custom-trigger"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full text-left flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
          isOpen
            ? "bg-white border-blue-500 ring-2 ring-blue-500/20"
            : currentSelectedUser
              ? "bg-blue-50/70 border-blue-300 hover:border-blue-400"
              : "bg-white border-slate-300 hover:border-slate-400"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {currentSelectedUser ? (
            <>
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {currentSelectedUser.username.replace("user", "")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {currentSelectedUser.username}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500 truncate">
                  Pilih Akun Demo (user01 - user30)
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {currentSelectedUser ? (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              title="Batalkan pilihan"
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span className="hidden sm:inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {availableCount} Tersedia
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-blue-600" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl shadow-xl border border-slate-200/95 overflow-hidden flex flex-col max-h-[22rem] animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header Search & Filter */}
          <div className="p-2.5 bg-slate-50/90 border-b border-slate-200 shrink-0 space-y-2">
            <div className="relative">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[10.5px]">
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  filterMode === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Semua ({DEMO_USERS.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("available")}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  filterMode === "available"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                Tersedia ({availableCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("locked")}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  filterMode === "locked"
                    ? "bg-rose-600 text-white"
                    : "bg-white text-rose-700 border border-rose-200 hover:bg-rose-50"
                }`}
              >
                Terpakai ({lockedCount})
              </button>
            </div>
          </div>

          {/* User Options List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 overscroll-contain">
            {filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Tidak ada akun demo yang cocok dengan pencarian.
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isLocked = isUserLockedByOther(user.username, demoLocks);
                const isSelected =
                  currentSelectedUser?.username.toLowerCase() ===
                  user.username.toLowerCase();

                if (isLocked) {
                  return (
                    <div
                      key={user.id}
                      className="p-2.5 bg-slate-50/80 flex items-center justify-between gap-2 opacity-50 cursor-not-allowed select-none"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {user.username.replace("user", "")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-600 truncate line-through">
                            {user.username} ({user.nama})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full shrink-0">
                        <Lock className="w-3 h-3" />
                        <span>Sedang Digunakan</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelect(user)}
                    className={`w-full text-left p-2.5 flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/90 hover:bg-blue-100/80 text-blue-900 border-l-4 border-blue-600"
                        : "hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className={`w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.username.replace("user", "")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold truncate">
                            {user.username}
                          </span>
                          <span className="text-[9.5px] font-medium text-slate-500">
                            ({user.nama})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100/90 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                          <span>Dipilih</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <span>Tersedia</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between shrink-0">
            <span>Tekan akun yang tersedia untuk memilih</span>
            <span className="text-slate-400">Esc untuk tutup</span>
          </div>
        </div>
      )}
    </div>
  );
};
