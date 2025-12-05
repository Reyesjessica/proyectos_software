'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import IncomeDashboard from './IncomeDashboard';
import CreditProfile from './CreditProfile';
import SuccessNotification from './SuccessNotification';
import { SessionManager } from '@/lib/session';
import { startRegistration, startAuthentication, browserSupportsWebAuthn } from '@/lib/webauthn';

type FlowStep = 'landing' | 'webauthn' | 'income' | 'credit' | 'success';

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

const CreditScoringFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('landing');
  const [incomeData, setIncomeData] = useState<IncomeData | null>(null);
  const [selectedLoanAmount, setSelectedLoanAmount] = useState<number>(0);
  const [userAddress, setUserAddress] = useState<string>('');
  const [webauthnSupported, setWebauthnSupported] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    setWebauthnSupported(browserSupportsWebAuthn());
  }, []);

  useEffect(() => {
    // Get wallet address from authenticated session
    const address = SessionManager.getWalletAddress();
    if (address) {
      setUserAddress(address);
      console.log('✅ Using authenticated wallet:', address);
    } else {
      console.warn('⚠️ No authenticated wallet found, using fallback');
      // Fallback to funded testnet address if no session (for testing)
      setUserAddress('GDJYLRW4DZK7LVGCNAKBO42FGWVDRP2G7BEAXWWUC5E63ZENZ3RAPAKL');
    }
  }, []);

  const handleStartSession = () => {
    if (webauthnSupported) {
      setCurrentStep('webauthn');
    } else {
      console.warn('WebAuthn no soportado, saltando a income');
      setCurrentStep('income');
    }
  };

  const handleWebAuthnRegister = async (username: string) => {
    setIsAuthenticating(true);
    try {
      const result = await startRegistration(username);
      if (result.success) {
        // Crear sesión después del registro exitoso
        await SessionManager.createSession(username, result.credentialId || '');
        setCurrentStep('income');
      } else {
        alert('Error en registro: ' + result.error);
      }
    } catch (error) {
      console.error('WebAuthn registration error:', error);
      alert('Error durante el registro WebAuthn');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleWebAuthnAuthenticate = async () => {
    setIsAuthenticating(true);
    try {
      const result = await startAuthentication();
      if (result.success) {
        // Obtener el usuario de las credenciales almacenadas
        const storedCredentials = JSON.parse(localStorage.getItem("passkey-credentials") || "[]");
        const matchedCred = storedCredentials.find((c: any) => c.credentialId === result.credentialId);
        
        if (matchedCred) {
          // Crear sesión después de la autenticación exitosa
          await SessionManager.createSession(matchedCred.username, result.credentialId || '');
          setCurrentStep('income');
        } else {
          alert('Error: Usuario no encontrado');
        }
      } else {
        alert('Error en autenticación: ' + result.error);
      }
    } catch (error) {
      console.error('WebAuthn authentication error:', error);
      alert('Error durante la autenticación');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleIncomeDataReady = (data: IncomeData) => {
    setIncomeData(data);
  };

  const handleIncomeNext = () => {
    if (incomeData) {
      setCurrentStep('credit');
    }
  };

  const handleRequestLoan = (amount: number) => {
    setSelectedLoanAmount(amount);
    setCurrentStep('success');
  };

  const handleBackToIncome = () => {
    setCurrentStep('income');
  };

  const handleStartOver = () => {
    setCurrentStep('landing');
    setIncomeData(null);
    setSelectedLoanAmount(0);
  };

  const handleViewDashboard = () => {
    // In real app, this would navigate to a user dashboard
    // For MVP, let's go back to credit profile
    setCurrentStep('credit');
  };

  return (
    <div className="min-h-screen">
      {currentStep === 'landing' && (
        <LandingPage onStartSession={handleStartSession} />
      )}
      
      {currentStep === 'webauthn' && (
        <WebAuthnPage
          onRegister={handleWebAuthnRegister}
          onAuthenticate={handleWebAuthnAuthenticate}
          isLoading={isAuthenticating}
        />
      )}
      
      {currentStep === 'income' && (
        <IncomeDashboard
          onDataReady={handleIncomeDataReady}
          onNext={handleIncomeNext}
        />
      )}
      
      {currentStep === 'credit' && incomeData && (
        <CreditProfile
          incomeData={incomeData}
          onRequestLoan={handleRequestLoan}
          onBack={handleBackToIncome}
        />
      )}
      
            {currentStep === 'success' && (
        <SuccessNotification
          loanAmount={selectedLoanAmount}
          userAddress={userAddress}
          onStartOver={handleStartOver}
          onViewDashboard={handleViewDashboard}
        />
      )}
    </div>
  );
};

// ✅ NUEVO COMPONENTE WEBAUTHN CON OPCIONES
const WebAuthnPage: React.FC<{
  onRegister: (username: string) => void;
  onAuthenticate: () => void;
  isLoading: boolean;
}> = ({ onRegister, onAuthenticate, isLoading }) => {
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState<'choice' | 'register' | 'authenticate'>('choice');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        {mode === 'choice' && (
          <>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🔐</div>
              <h1 className="text-3xl font-bold text-gray-800">WebAuthn Passkey</h1>
              <p className="text-gray-600 mt-2">Autenticación segura sin contraseña</p>
            </div>

            <button
              onClick={() => setMode('register')}
              className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg"
            >
              📝 Registrar Passkey
            </button>

            <button
              onClick={() => setMode('authenticate')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg"
            >
              ✅ Autenticarse
            </button>

            <p className="text-xs text-gray-500 text-center mt-6">
              ✓ Sin contraseña ✓ Seguro ✓ Rápido
            </p>
          </>
        )}
        
        {mode === 'register' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              📝 Registrar Passkey
            </h2>

            <input
              type="text"
              placeholder="Tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-4 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />

            <button
              onClick={() => onRegister(username)}
              disabled={isLoading || !username}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⏳ Registrando...' : '✅ Registrar Passkey'}
            </button>

            <button
              onClick={() => setMode('choice')}
              className="w-full mt-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Volver
            </button>
          </>
        )}
        
        {mode === 'authenticate' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ✅ Autenticarse
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Usa tu dispositivo biométrico o llave de seguridad para autenticarte.
            </p>

            <button
              onClick={onAuthenticate}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? '⏳ Autenticando...' : '🔓 Autenticarse con Passkey'}
            </button>

            <button
              onClick={() => setMode('choice')}
              className="w-full text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Volver
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreditScoringFlow;