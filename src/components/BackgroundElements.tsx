import React from 'react';

export const MedicineBottle = ({ className = "", size = 80 }: { className?: string, size?: number }) => (
  <div className={`absolute opacity-20 ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19,3H15V1H9V3H5C3.9,3 3,3.9 3,5V7C3,8.1 3.9,9 5,9V19C5,20.1 5.9,21 7,21H17C18.1,21 19,20.1 19,19V9C20.1,9 21,8.1 21,7V5C21,3.9 20.1,3 19,3M19,7H5V5H19V7M17,19H7V9H17V19M14,15H10V17H14V15M16,11H8V13H16V11Z" />
    </svg>
  </div>
);

export const Pills = ({ className = "", size = 80 }: { className?: string, size?: number }) => (
  <div className={`absolute opacity-20 ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.22,11.29L11.29,4.22C13.64,1.88 17.43,1.88 19.78,4.22C22.12,6.56 22.12,10.36 19.78,12.71L12.71,19.78C10.36,22.12 6.56,22.12 4.22,19.78C1.88,17.43 1.88,13.64 4.22,11.29M5.64,12.71C4.59,13.75 4.24,15.24 4.6,16.57L10.59,10.59L14.83,14.83L18.36,11.29C19.93,9.73 19.93,7.2 18.36,5.64C16.8,4.07 14.27,4.07 12.71,5.64L5.64,12.71Z" />
    </svg>
  </div>
);

export const Syringe = ({ className = "", size = 80 }: { className?: string, size?: number }) => (
  <div className={`absolute opacity-20 ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.85,15.15L7.35,10.65C8.92,9.45 9.15,7 7.95,5.35L14.15,11.55C12.4,10.38 10.04,10.65 8.85,12.15M19.36,5.64L16.91,8.09L15.76,6.94L18.76,3.94L17.71,2.89L14.71,5.89L13.56,4.74L16.01,2.29L14.95,1.24L8.8,7.39L16.61,15.2L22.76,9.05L21.71,8M10.41,19.06L4.27,12.92L3.22,13.97L9.36,20.11M5,3H7V5A22.84,22.84 0 0,1 3,7V5C3,3.89 3.89,3 5,3Z" />
    </svg>
  </div>
);

export const HeartPulse = ({ className = "", size = 80 }: { className?: string, size?: number }) => (
  <div className={`absolute opacity-20 ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5,4A5.5,5.5 0 0,0 2,9.5C2,10 2.09,10.5 2.22,11H6.3L7.57,7.63C7.87,6.83 9.05,6.75 9.43,7.63L11.5,13L12.09,11.58C12.22,11.25 12.57,11 13,11H21.78C21.91,10.5 22,10 22,9.5A5.5,5.5 0 0,0 16.5,4C14.64,4 13,4.93 12,6.34C11,4.93 9.36,4 7.5,4V4M3,12.5A1,1 0 0,0 2,13.5A1,1 0 0,0 3,14.5H5.44L11,20C12,20.9 12,20.9 13,20L18.56,14.5H21A1,1 0 0,0 22,13.5A1,1 0 0,0 21,12.5H13.4L12.47,14.8C12.07,15.81 10.92,15.67 10.55,14.83L8.5,9.5L7.54,11.83C7.39,12.21 7.05,12.5 6.6,12.5H3Z" />
    </svg>
  </div>
);

export const CirclePattern = ({ className = "" }: { className?: string }) => (
  <div className={`absolute w-full h-full pointer-events-none overflow-hidden ${className}`}>
    <div className="absolute rounded-full border-8 border-primary/10 w-[300px] h-[300px] animate-[spin_25s_linear_infinite]"></div>
    <div className="absolute rounded-full border-4 border-blue-500/10 w-[500px] h-[500px] animate-[spin_40s_linear_infinite_reverse]"></div>
    <div className="absolute rounded-full border-2 border-blue-300/10 w-[700px] h-[700px] animate-[spin_60s_linear_infinite]"></div>
  </div>
);

export const GridPattern = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${className}`} style={{ 
    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
    backgroundSize: '40px 40px'
  }}></div>
);

export const GradientBlob = ({ className = "", color = "blue" }: { className?: string, color?: string }) => {
  const colors = {
    blue: "from-blue-400 to-blue-600",
    green: "from-green-400 to-green-600",
    purple: "from-purple-400 to-purple-600",
  };

  return (
    <div className={`absolute rounded-full bg-gradient-to-br ${colors[color as keyof typeof colors]} opacity-20 blur-3xl ${className}`}></div>
  );
};

export const FloatingParticles = ({ count = 20 }: { count?: number }) => {
  const particles = Array(count).fill(0).map((_, i) => {
    const size = Math.random() * 10 + 4;
    const left = `${Math.random() * 100}%`;
    const top = `${Math.random() * 100}%`;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 5;
    
    return (
      <div 
        key={i}
        className="absolute rounded-full bg-blue-500/10 dark:bg-blue-300/10"
        style={{
          width: size + 'px',
          height: size + 'px',
          left,
          top,
          animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`
        }}
      ></div>
    );
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles}
    </div>
  );
};

export const PrescriptionPad = ({ className = "", size = 120 }: { className?: string, size?: number }) => (
  <div className={`absolute ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M16,15H8V13H16M16,11H8V9H16M8,7H13V8H8" />
    </svg>
    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center opacity-50">
      <div className="w-[70%] h-[2px] bg-current mb-2"></div>
      <div className="w-[60%] h-[2px] bg-current mb-2"></div>
      <div className="w-[50%] h-[2px] bg-current"></div>
    </div>
  </div>
);

export const MolecularStructure = ({ className = "", size = 140 }: { className?: string, size?: number }) => (
  <div className={`absolute ${className}`} style={{ width: size, height: size }}>
    <div className="relative w-full h-full">
      {/* Molecular nodes */}
      <div className="absolute top-[20%] left-[30%] w-4 h-4 rounded-full bg-current opacity-30"></div>
      <div className="absolute top-[50%] left-[20%] w-5 h-5 rounded-full bg-current opacity-40"></div>
      <div className="absolute top-[70%] left-[40%] w-3 h-3 rounded-full bg-current opacity-25"></div>
      <div className="absolute top-[30%] left-[60%] w-5 h-5 rounded-full bg-current opacity-35"></div>
      <div className="absolute top-[55%] left-[65%] w-4 h-4 rounded-full bg-current opacity-30"></div>
      <div className="absolute top-[75%] left-[70%] w-3 h-3 rounded-full bg-current opacity-20"></div>
      
      {/* Molecular bonds */}
      <div className="absolute top-[25%] left-[33%] w-[20%] h-[1px] bg-current opacity-20 origin-left rotate-45"></div>
      <div className="absolute top-[35%] left-[35%] w-[30%] h-[1px] bg-current opacity-20 origin-left rotate-[30deg]"></div>
      <div className="absolute top-[50%] left-[25%] w-[15%] h-[1px] bg-current opacity-20 origin-left rotate-[120deg]"></div>
      <div className="absolute top-[60%] left-[25%] w-[20%] h-[1px] bg-current opacity-20 origin-left rotate-[60deg]"></div>
      <div className="absolute top-[60%] left-[60%] w-[15%] h-[1px] bg-current opacity-20 origin-left rotate-[30deg]"></div>
      <div className="absolute top-[40%] left-[63%] w-[15%] h-[1px] bg-current opacity-20 origin-left rotate-[100deg]"></div>
    </div>
  </div>
); 