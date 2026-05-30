import Image from "next/image";

export default function WelcomeLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black selection:bg-[#1D9BF0] selection:text-white flex flex-col items-center justify-center">
      {/* Subtle pulse animation for the logo, using opacity to be GPU-friendly */}
      <div className="animate-pulse flex flex-col items-center justify-center opacity-80">
        <Image 
          src="/logo-ai.png" 
          alt="Memuat Teras Warga..." 
          width={160} 
          height={53} 
          className="h-10 w-auto object-contain block dark:hidden"
          priority
        />
        <Image 
          src="/logo-ai-dark.png" 
          alt="Memuat Teras Warga..." 
          width={160} 
          height={53} 
          className="h-10 w-auto object-contain hidden dark:block"
          priority
        />
      </div>
    </div>
  );
}
