'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Shield, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Loader2,
  BarChart3,
  User,
  Calendar,
  Briefcase,
  PieChart
} from 'lucide-react';

interface IncomeData {
  monthly_earnings: number[];
  gig_platforms: string[];
  average_hours_per_week: number;
  years_experience: number;
  education_level: 'high_school' | 'bachelor' | 'master' | 'phd' | 'none';
  employment_type: 'full_time_gig' | 'part_time_gig' | 'mixed' | 'unemployed';
  bank_account_age_months: number;
  has_savings: boolean;
  debt_to_income_ratio: number;
}

interface CreditScoreResult {
  credit_score: number;
  factors: {
    income_stability: number;
    income_level: number;
    employment_history: number;
    financial_behavior: number;
    platform_diversity: number;
  };
  recommendation: string;
  loan_eligible: boolean;
  max_loan_amount: number;
}

interface CreditProfileProps {
  incomeData: IncomeData;
  onRequestLoan: (amount: number) => void;
  onBack: () => void;
}

const CreditProfile: React.FC<CreditProfileProps> = ({ incomeData, onRequestLoan, onBack }) => {
  const [creditResult, setCreditResult] = useState<CreditScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState(500);

  // Calculate credit score on component mount
  useEffect(() => {
    const calculateScore = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const response = await fetch('/api/calculate-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(incomeData),
        });

        if (!response.ok) {
          throw new Error('Failed to calculate credit score');
        }

        const result: CreditScoreResult = await response.json();
        setCreditResult(result);
        
        // Set default loan amount to half of max or $500, whichever is higher
        if (result.loan_eligible && result.max_loan_amount > 0) {
          setSelectedAmount(Math.max(500, Math.floor(result.max_loan_amount / 2)));
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    calculateScore();
  }, [incomeData]);

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-emerald-400';
    if (score >= 750) return 'text-green-400';
    if (score >= 700) return 'text-yellow-400';
    if (score >= 650) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 800) return 'from-emerald-500 to-green-500';
    if (score >= 750) return 'from-green-500 to-lime-500';
    if (score >= 700) return 'from-yellow-500 to-green-500';
    if (score >= 650) return 'from-orange-500 to-yellow-500';
    return 'from-red-500 to-orange-500';
  };

  const getFactorIcon = (factor: string) => {
    switch (factor) {
      case 'income_stability': return <TrendingUp className="w-5 h-5" />;
      case 'income_level': return <DollarSign className="w-5 h-5" />;
      case 'employment_history': return <Calendar className="w-5 h-5" />;
      case 'financial_behavior': return <Shield className="w-5 h-5" />;
      case 'platform_diversity': return <Briefcase className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getFactorLabel = (factor: string) => {
    switch (factor) {
      case 'income_stability': return 'Estabilidad de Ingresos';
      case 'income_level': return 'Nivel de Ingresos';
      case 'employment_history': return 'Historial Laboral';
      case 'financial_behavior': return 'Comportamiento Financiero';
      case 'platform_diversity': return 'Diversidad de Plataformas';
      default: return factor;
    }
  };

  const calculateInterestRate = (score: number) => {
    if (score >= 800) return 6;
    if (score >= 750) return 8;
    if (score >= 700) return 12;
    return 15;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block">
            <Loader2 className="w-16 h-16 text-purple-400 animate-spin mb-6" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Calculando tu Credit Score</h2>
          <p className="text-gray-300 mb-8">
            Analizando {incomeData.gig_platforms.length} plataformas y {incomeData.monthly_earnings.length} meses de datos...
          </p>
          <div className="w-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full h-2 mx-auto border border-purple-500/20">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="inline-block mb-6 text-6xl">❌</div>
          <h2 className="text-3xl font-bold text-white mb-4">Error al Calcular Score</h2>
          <p className="text-gray-300 mb-8">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!creditResult) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6 text-white">
      {/* Background Spheres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="text-purple-300 text-sm font-semibold">📊 Análisis de Crédito</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Tu <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Credit Score</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Análisis integral de tu perfil financiero y elegibilidad de crédito
          </p>
        </div>

        {/* Main Score Display */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-12 border border-purple-500/20 mb-12 backdrop-blur-sm">
          <div className="text-center mb-10">
            <div className={`text-9xl md:text-10xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getScoreGradient(creditResult.credit_score)} mb-4`}>
              {creditResult.credit_score}
            </div>
            <div className="text-3xl font-bold text-white mb-8">
              {creditResult.credit_score >= 800 && '🌟 Excelente'}
              {creditResult.credit_score >= 750 && creditResult.credit_score < 800 && '⭐ Muy Bueno'}
              {creditResult.credit_score >= 700 && creditResult.credit_score < 750 && '✨ Bueno'}
              {creditResult.credit_score >= 650 && creditResult.credit_score < 700 && '⚠️ Regular'}
              {creditResult.credit_score < 650 && '❌ Necesita Mejora'}
            </div>
            
            {/* Score Bar */}
            <div className="w-full max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-full h-3 mb-4 border border-gray-600/50">
                <div 
                  className={`bg-gradient-to-r ${getScoreGradient(creditResult.credit_score)} h-3 rounded-full transition-all duration-1000 shadow-lg shadow-purple-500/50`}
                  style={{ width: `${((creditResult.credit_score - 500) / 350) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 px-2">
                <span>500 (Bajo)</span>
                <span>850 (Excelente)</span>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 text-center border border-blue-500/20">
            <p className="text-lg text-gray-200">💡 {creditResult.recommendation}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Score Factors */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-8 border border-blue-500/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-3xl">📈</span>
              Factores del Score
            </h2>
            
            <div className="space-y-6">
              {Object.entries(creditResult.factors).map(([factor, value]) => (
                <div key={factor} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getFactorIcon(factor)}</span>
                      <span className="text-white font-semibold">
                        {getFactorLabel(factor)}
                      </span>
                    </div>
                    <span className="text-blue-400 font-bold text-lg">{value}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2.5 border border-gray-600/30">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loan Options */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-8 border border-green-500/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-3xl">💰</span>
              Opciones de Préstamo
            </h2>

            {creditResult.loan_eligible ? (
              <>
                {/* Loan Amount Selector */}
                <div className="mb-8">
                  <label className="block text-white font-semibold mb-4 text-lg">
                    Monto del Préstamo: <span className="text-green-400">${selectedAmount.toLocaleString()} USDC</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max={creditResult.max_loan_amount}
                    step="50"
                    value={selectedAmount}
                    onChange={(e) => setSelectedAmount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>$50</span>
                    <span>${creditResult.max_loan_amount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                    <span className="text-gray-300 font-medium">Tasa de Interés APR</span>
                    <span className="text-green-400 font-bold text-lg">
                      {calculateInterestRate(creditResult.credit_score)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                    <span className="text-gray-300 font-medium">Límite Máximo</span>
                    <span className="text-blue-400 font-bold text-lg">
                      ${creditResult.max_loan_amount.toLocaleString()} USDC
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                    <span className="text-gray-300 font-medium">Aprobación</span>
                    <span className="text-purple-400 font-bold text-lg">≤ 5 minutos</span>
                  </div>
                </div>

                {/* Request Loan Button */}
                <button
                  onClick={() => onRequestLoan(selectedAmount)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-green-500/50 transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
                >
                  <span>💳</span>
                  <span>Solicitar ${selectedAmount.toLocaleString()} USDC</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold text-white mb-3">No Elegible Aún</h3>
                <p className="text-gray-300 mb-8">
                  Tu score actual ({creditResult.credit_score}) está por debajo del mínimo requerido (700).
                </p>
                
                {/* Improvement Tips */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-6 text-left border border-yellow-500/20">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span>💡</span> Para mejorar tu score:
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex gap-2">
                      <span className="text-yellow-400">→</span>
                      <span>Aumenta tus ingresos mensuales promedio</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-yellow-400">→</span>
                      <span>Conecta más plataformas de trabajo</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-yellow-400">→</span>
                      <span>Mantén ingresos estables por más tiempo</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-yellow-400">→</span>
                      <span>Reduce tu ratio de deuda/ingreso</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
          >
            ← Volver a Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditProfile;