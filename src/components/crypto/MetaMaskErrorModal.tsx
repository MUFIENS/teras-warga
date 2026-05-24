import { X, ExternalLink, DownloadCloud } from "lucide-react";

interface MetaMaskErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MetaMaskErrorModal({ isOpen, onClose }: MetaMaskErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-neutral-800">
          <h2 className="font-bold text-lg">Web3 Wallet Required</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
            <img loading="lazy" src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
              alt="MetaMask"
              className="w-10 h-10"
            />
          </div>
          
          <h3 className="font-bold text-xl mb-2">MetaMask Tidak Ditemukan</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Untuk melakukan pembayaran dengan Crypto, Anda memerlukan ekstensi atau aplikasi browser Web3 seperti MetaMask.
          </p>

          <a 
            href="https://metamask.io/download/"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#F6851B] hover:bg-[#E2761B] text-white font-bold py-3.5 px-4 rounded-full transition-colors flex items-center justify-center gap-2 mb-3"
          >
            <DownloadCloud className="w-5 h-5" />
            Install MetaMask
          </a>
          
          <button 
            onClick={onClose}
            className="w-full text-gray-600 dark:text-gray-300 font-semibold py-3 px-4 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
