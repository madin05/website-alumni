import React from 'react';

export type GenderType = 'L' | 'P' | 'Laki-laki' | 'Perempuan' | 'male' | 'female' | string;

export interface UserAvatarProps {
  name?: string;
  gender?: GenderType;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const detectGenderFromName = (name?: string, explicitGender?: GenderType): 'L' | 'P' => {
  // 1. If explicitGender is explicitly given, ALWAYS trust it!
  if (explicitGender) {
    const g = explicitGender.toString().trim().toUpperCase();
    if (g.startsWith('P') || g === 'FEMALE' || g === 'WANITA' || g === 'PEREMPUAN') return 'P';
    if (g.startsWith('L') || g === 'MALE' || g === 'PRIA' || g === 'LAKI-LAKI') return 'L';
  }

  // 2. Fallback heuristic from name only when explicitGender is undefined
  if (!name) return 'L';
  const lower = name.toLowerCase().trim();
  const words = lower.split(/[\s,.-]+/);

  const exactFemaleWords = new Set([
    'citra', 'kirana', 'siti', 'dewi', 'putri', 'annisa', 'anisa', 'nur', 'rida', 'rina', 'ayu',
    'nabila', 'fitri', 'rahma', 'dina', 'maya', 'linda', 'sarah', 'aulia',
    'indah', 'ratna', 'lestari', 'widya', 'tiara', 'mega', 'zahra', 'kartika',
    'nurhaliza', 'kania', 'amalia', 'fatimah', 'olivia', 'vina', 'yasmin',
    'bella', 'gita', 'ani', 'shifa', 'syifa', 'salma', 'fathia', 'mutia',
    'tasya', 'nadia', 'alysa', 'amanda', 'audrey', 'chika', 'chelsea', 'cantika',
    'dinda', 'eva', 'fani', 'fanny', 'hana', 'intan', 'jessica', 'laila', 'melly',
    'nanda', 'novi', 'novita', 'puja', 'rizka', 'safira', 'tania', 'wulan', 'yulia', 'yuliana',
    'cut', 'kayla', 'masitoh', 'astuti', 'salsabila', 'sfella', 'pratiwi'
  ]);

  return words.some((w) => exactFemaleWords.has(w)) ? 'P' : 'L';
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  gender,
  className = 'w-10 h-10',
}) => {
  const resolvedGender = detectGenderFromName(name, gender);

  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 select-none flex items-center justify-center border border-slate-200/90 shadow-xs ${className}`}
      title={name || (resolvedGender === 'P' ? 'Alumni Putri' : 'Alumni Putra')}
    >
      {resolvedGender === 'P' ? (
        // Generic Female Avatar (Modern Hijab & Blazer)
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle with soft rose-slate gradient */}
          <circle cx="50" cy="50" r="50" fill="url(#fem-grad)" />
          <defs>
            <linearGradient id="fem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
          </defs>

          {/* Shoulders & Jacket */}
          <path
            d="M18 95 C18 76, 32 68, 50 68 C68 68, 82 76, 82 95 Z"
            fill="#1e293b"
          />

          {/* Inner Blouse Collar */}
          <path d="M42 68 L50 80 L58 68 Z" fill="#ffffff" />
          <path d="M48 76 L52 76 L51 90 L49 90 Z" fill="#f59e0b" />

          {/* Hijab Drape Body */}
          <path
            d="M34 66 C40 76, 60 76, 66 66 C68 84, 32 84, 34 66 Z"
            fill="#fbcfe8"
          />

          {/* Hijab Hood / Outer */}
          <path
            d="M26 44 C26 25, 35 17, 50 17 C65 17, 74 25, 74 44 C74 63, 65 69, 50 69 C35 69, 26 63, 26 44 Z"
            fill="#fdf2f8"
          />

          {/* Face Oval */}
          <ellipse cx="50" cy="44" rx="14" ry="16" fill="#fed7aa" />

          {/* Inner Hijab Underscarf */}
          <path
            d="M37 38 C42 34, 58 34, 63 38 C61 32, 56 30, 50 30 C44 30, 39 32, 37 38 Z"
            fill="#db2777"
          />

          {/* Eyes & Eyebrows */}
          <ellipse cx="44" cy="43" rx="2" ry="2.2" fill="#1e293b" />
          <ellipse cx="56" cy="43" rx="2" ry="2.2" fill="#1e293b" />
          <path
            d="M42 39 C43 38, 46 38, 47 39"
            stroke="#78350f"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M53 39 C54 38, 57 38, 58 39"
            stroke="#78350f"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Friendly Smile & Blush */}
          <path
            d="M46 50 C48 53, 52 53, 54 50"
            stroke="#c2410c"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="41" cy="48" r="2" fill="#f43f5e" opacity="0.3" />
          <circle cx="59" cy="48" r="2" fill="#f43f5e" opacity="0.3" />
        </svg>
      ) : (
        // Generic Male Avatar (Modern Hair & Blazer)
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle with soft royal blue gradient */}
          <circle cx="50" cy="50" r="50" fill="url(#male-grad)" />
          <defs>
            <linearGradient id="male-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>

          {/* Shoulders & Jacket */}
          <path
            d="M18 95 C18 76, 32 68, 50 68 C68 68, 82 76, 82 95 Z"
            fill="#0f172a"
          />

          {/* Shirt / Collar / Tie */}
          <path d="M40 68 L50 82 L60 68 Z" fill="#ffffff" />
          <path d="M47 78 L53 78 L52 94 L48 94 Z" fill="#f59e0b" />

          {/* Neck */}
          <rect x="44" y="52" width="12" height="15" rx="3" fill="#fed7aa" />

          {/* Head / Face */}
          <circle cx="50" cy="42" r="18" fill="#ffedd5" />

          {/* Neat Modern Hair */}
          <path
            d="M32 38 C31 24, 42 19, 50 19 C61 19, 69 25, 68 38 C65 31, 57 26, 48 26 C38 26, 33 33, 32 38 Z"
            fill="#1e293b"
          />
          <path
            d="M32 36 C30 40, 31 46, 34 47 C33 43, 33 39, 32 36 Z"
            fill="#1e293b"
          />
          <path
            d="M68 36 C70 40, 69 46, 66 47 C67 43, 67 39, 68 36 Z"
            fill="#1e293b"
          />

          {/* Eyes & Eyebrows */}
          <ellipse cx="43" cy="42" rx="2" ry="2.2" fill="#1e293b" />
          <ellipse cx="57" cy="42" rx="2" ry="2.2" fill="#1e293b" />
          <path
            d="M40 38 C42 37, 45 37, 46 38"
            stroke="#1e293b"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M54 38 C55 37, 58 37, 60 38"
            stroke="#1e293b"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Friendly Smile */}
          <path
            d="M46 49 C48 52, 52 52, 54 49"
            stroke="#c2410c"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};
