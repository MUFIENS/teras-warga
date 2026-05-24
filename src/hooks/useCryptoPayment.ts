import { useState, useEffect, useCallback } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useConfig } from 'wagmi';
import { parseEther } from 'viem';
import { Web3PaymentStatus } from '@/types/marketplace';
import { useQuery } from '@tanstack/react-query';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Using CoinGecko API for real-time rates
const fetchExchangeRates = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network,binancecoin&vs_currencies=idr');
  if (!response.ok) throw new Error('Failed to fetch exchange rates');
  return response.json();
};

export function useCryptoPayment(priceIdr: number, sellerWallet: string | null) {
  const { address, isConnected, chain, connector } = useAccount();
  const { data: hash, isPending: isSending, sendTransaction, error: sendError, reset: resetSend } = useSendTransaction();
  
  const { isLoading: isMining, isSuccess: isMined, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  });

  const [status, setStatus] = useState<Web3PaymentStatus>(Web3PaymentStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cryptoAmount, setCryptoAmount] = useState<string>('0');

  // React Query for Exchange Rates
  const { data: rates, isLoading: isRatesLoading, isError: isRatesError } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: fetchExchangeRates,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Calculate Crypto Amount based on the active chain and real-time rates
  useEffect(() => {
    if (!rates || !priceIdr || !chain) return;

    let idrRate = 0;
    if (chain.name.includes('Polygon') || chain.id === 137) {
      idrRate = rates['matic-network']?.idr || 11000;
    } else if (chain.name.includes('BNB') || chain.id === 56) {
      idrRate = rates['binancecoin']?.idr || 9000000;
    } else {
      idrRate = rates['ethereum']?.idr || 50000000; // default to ETH
    }

    if (idrRate > 0) {
      // Add a 2% slippage/buffer for the seller to prevent underpayment due to volatility
      const amountWithBuffer = (priceIdr / idrRate) * 1.02;
      setCryptoAmount(amountWithBuffer.toFixed(6));
    }
  }, [rates, priceIdr, chain]);

  // Status Machine
  useEffect(() => {
    if (isSending) {
      setStatus(Web3PaymentStatus.WAITING_CONFIRMATION);
    } else if (isMining) {
      setStatus(Web3PaymentStatus.MINING);
    } else if (isMined) {
      setStatus(Web3PaymentStatus.SUCCESS);
    }
  }, [isSending, isMining, isMined]);

  // Error Handling logic
  useEffect(() => {
    if (sendError) {
      setStatus(Web3PaymentStatus.ERROR);
      if (sendError.message.includes('User rejected')) {
        setErrorMessage('Transaksi dibatalkan oleh pengguna (User rejected).');
      } else if (sendError.message.includes('insufficient funds')) {
        setErrorMessage('Saldo tidak mencukupi untuk melakukan pembayaran beserta gas fee.');
      } else {
        setErrorMessage('Terjadi kesalahan saat memproses transaksi.');
      }
    } else if (receiptError) {
      setStatus(Web3PaymentStatus.ERROR);
      setErrorMessage('Transaksi gagal saat di-mining (Reverted).');
    }
  }, [sendError, receiptError]);

  // The actual pay function
  const triggerPayment = useCallback(() => {
    setErrorMessage(null);
    
    // Check if window.ethereum exists
    if (typeof window !== 'undefined' && !window.ethereum) {
      setStatus(Web3PaymentStatus.ERROR);
      setErrorMessage('METAMASK_MISSING');
      return;
    }

    if (!isConnected) {
      setStatus(Web3PaymentStatus.ERROR);
      setErrorMessage('Silakan hubungkan wallet Anda terlebih dahulu.');
      return;
    }

    if (!sellerWallet) {
      setStatus(Web3PaymentStatus.ERROR);
      setErrorMessage('Alamat dompet (wallet) penjual tidak ditemukan.');
      return;
    }

    if (!cryptoAmount || parseFloat(cryptoAmount) <= 0) {
      setStatus(Web3PaymentStatus.ERROR);
      setErrorMessage('Gagal menghitung jumlah crypto. Coba lagi.');
      return;
    }

    try {
      setStatus(Web3PaymentStatus.PREPARING);
      sendTransaction({
        to: sellerWallet as `0x${string}`,
        value: parseEther(cryptoAmount),
      });
    } catch (err: any) {
      setStatus(Web3PaymentStatus.ERROR);
      setErrorMessage(err.message || 'Gagal memulai transaksi.');
    }
  }, [isConnected, sellerWallet, cryptoAmount, sendTransaction]);

  const resetState = useCallback(() => {
    setStatus(Web3PaymentStatus.IDLE);
    setErrorMessage(null);
    resetSend();
  }, [resetSend]);

  return {
    status,
    errorMessage,
    cryptoAmount,
    chainSymbol: chain?.nativeCurrency?.symbol || 'ETH',
    isRatesLoading,
    isRatesError,
    hash,
    triggerPayment,
    resetState,
    hasMetaMask: typeof window !== 'undefined' && !!window.ethereum
  };
}
