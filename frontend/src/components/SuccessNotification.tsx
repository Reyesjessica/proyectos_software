'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Download, 
  Calendar,
  DollarSign,
  Clock,
  CreditCard,
  Wallet,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface LoanResponse {
  success: boolean;
  transaction_hash?: string;
  loan_id?: string;
  amount?: number;
  recipient?: string;
  timestamp?: number;
  interest_rate?: number;
  repayment_due_date?: number;
  error?: string;
}

interface SuccessNotificationProps {
  loanAmount: number;
  userAddress: string;
  onStartOver: () => void;
  onViewDashboard: () => void;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  loanAmount,
  userAddress,
  onStartOver,
  onViewDashboard
}) => {
  const [loanResult, setLoanResult] = useState<LoanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Process loan request on component mount
  useEffect(() => {
    const processLoan = async () => {
      try {
        setLoading(true);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const loanRequest = {
          user_address: userAddress,
          amount: loanAmount * 10000000, // Convert to stroops (7 decimals)
          credit_score: 750, // This would come from the previous step
          purpose: 'personal',
          repayment_plan: 'monthly'
        };

        const response = await fetch('/api/request-loan-real', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loanRequest),
        });

        const result: LoanResponse = await response.json();
        
        if (result.success) {
          setLoanResult(result);
        } else {
          setError(result.error || 'Error processing loan');
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    processLoan();
  }, [loanAmount, userAddress]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amountInStroops: number) => {
    return (amountInStroops / 10000000).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Procesando tu Préstamo</h2>
          <p className="text-xl text-gray-300 mb-8">
            Verificando fondos y ejecutando smart contract...
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3 text-green-400">
              <span className="text-2xl">✓</span>
              <span className="font-medium">Verificando elegibilidad</span>
            </div>
            <div className="flex items-center space-x-3 text-green-400">
              <span className="text-2xl">✓</span>
              <span className="font-medium">Validando balance del pool</span>
            </div>
            <div className="flex items-center space-x-3 text-purple-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium">Ejecutando contrato en Stellar...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-3xl font-bold text-white mb-4">Error en el Préstamo</h2>
          <p className="text-lg text-gray-300 mb-8">{error}</p>
          
          <div className="space-y-3">
            <button
              onClick={onStartOver}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Intentar de Nuevo
            </button>
            <button
              onClick={onViewDashboard}
              className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!loanResult || !loanResult.success) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6 text-white">
      {/* Background Spheres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
            <span className="text-5xl">✓</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            ¡Préstamo <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">Aprobado!</span>
          </h1>
          <p className="text-xl text-gray-300">
            Tu préstamo se ha procesado exitosamente en blockchain
          </p>
        </div>

        {/* Transaction Details Card */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-10 border border-purple-500/20 mb-10 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="text-3xl">💰</span>
            Detalles de la Transacción
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Amount */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">💵</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400">Monto</h3>
                  <p className="text-lg font-bold text-white">USDC Transferido</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-green-400">
                ${formatAmount(loanResult.amount!)} USDC
              </div>
            </div>

            {/* Interest Rate */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400">Tasa</h3>
                  <p className="text-lg font-bold text-white">APR Anual</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-blue-400">
                {(loanResult.interest_rate! * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Hash and ID */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transaction Hash */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🔗</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400">TX Hash</h3>
                  <p className="text-lg font-bold text-white">Stellar Blockchain</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <code className="text-xs text-purple-300 font-mono bg-purple-500/10 px-3 py-2 rounded flex-1 truncate">
                  {loanResult.transaction_hash!.substring(0, 20)}...
                </code>
                <button
                  onClick={() => copyToClipboard(loanResult.transaction_hash!, 'hash')}
                  className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                  title="Copiar"
                >
                  <Copy className="w-4 h-4 text-purple-400" />
                </button>
              </div>
              {copied === 'hash' && (
                <p className="text-green-400 text-xs mt-2 font-semibold">✓ ¡Copiado!</p>
              )}
            </div>

            {/* Loan ID */}
            <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-2xl p-6 border border-orange-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🆔</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400">Loan ID</h3>
                  <p className="text-lg font-bold text-white">Identificador Único</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <code className="text-xs text-orange-300 font-mono bg-orange-500/10 px-3 py-2 rounded flex-1 truncate">
                  {loanResult.loan_id}
                </code>
                <button
                  onClick={() => copyToClipboard(loanResult.loan_id!, 'id')}
                  className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
                  title="Copiar"
                >
                  <Copy className="w-4 h-4 text-orange-400" />
                </button>
              </div>
              {copied === 'id' && (
                <p className="text-green-400 text-xs mt-2 font-semibold">✓ ¡Copiado!</p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-8 p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-blue-500/20">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              Cronología
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-500/5 rounded-lg">
                <span className="text-gray-300 font-medium">Procesado</span>
                <span className="text-white font-bold">
                  {formatDate(loanResult.timestamp!)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-500/5 rounded-lg">
                <span className="text-gray-300 font-medium">Fecha de Pago</span>
                <span className="text-yellow-400 font-bold">
                  {formatDate(loanResult.repayment_due_date!)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-8 border border-blue-500/20 mb-10 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            Próximos Pasos
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-blue-500/5 rounded-lg">
              <span className="text-2xl flex-shrink-0">✓</span>
              <div>
                <h3 className="text-white font-semibold mb-1">Los USDC están en tu wallet</h3>
                <p className="text-gray-400 text-sm">
                  Revisa tu wallet Stellar para confirmar la recepción de fondos
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-yellow-500/5 rounded-lg">
              <span className="text-2xl flex-shrink-0">⏰</span>
              <div>
                <h3 className="text-white font-semibold mb-1">Prepara el pago</h3>
                <p className="text-gray-400 text-sm">
                  El pago vence el {formatDate(loanResult.repayment_due_date!)}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-green-500/5 rounded-lg">
              <span className="text-2xl flex-shrink-0">💾</span>
              <div>
                <h3 className="text-white font-semibold mb-1">Guarda este recibo</h3>
                <p className="text-gray-400 text-sm">
                  Usa el Loan ID <code className="text-green-400">{loanResult.loan_id}</code> para consultas futuras
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => window.open(`https://stellar.expert/explorer/testnet/tx/${loanResult.transaction_hash}`, '_blank')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Ver en Stellar</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
          >
            <Wallet className="w-5 h-5" />
            <span>Mi Dashboard</span>
          </button>
          
          <button
            onClick={onStartOver}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Nuevo Préstamo</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>
            ¿Preguntas? Contacta soporte con tu Loan ID: <code className="text-purple-400">{loanResult.loan_id}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;