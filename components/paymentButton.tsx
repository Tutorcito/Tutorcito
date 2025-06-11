import React, { useState } from 'react';
import { CreditCard, Loader2, ShoppingCart, X } from 'lucide-react';

interface PaymentItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
}

interface PaymentData {
  items: PaymentItem[];
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>;
    excluded_payment_types?: Array<{ id: string }>;
    installments?: number;
  };
}

interface PaymentButtonProps {
  items: PaymentItem[];
  accessToken: string;
  backUrls: {
    success: string;
    failure: string;
    pending: string;
  };
  autoReturn?: 'approved' | 'all' | 'pending';
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  items,
  accessToken,
  backUrls,
  autoReturn = 'approved',
  onSuccess,
  onError,
  className = '',
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const createPaymentPreference = async (): Promise<string> => {
    const paymentData: PaymentData = {
      items: items.map(item => ({
        ...item,
        currency_id: item.currency_id || 'ARS'
      })),
      back_urls: backUrls,
      auto_return: autoReturn,
      payment_methods: {
        installments: 12
      }
    };

    try {
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const preference = await response.json();
      return preference.init_point;
    } catch (error) {
      console.error('Error creando preferencia de pago:', error);
      throw new Error('No se pudo crear la preferencia de pago');
    }
  };

  const handlePayment = async () => {
    if (disabled || loading) return;
  
    setLoading(true);
  
    try {
      const checkoutUrl = await createPaymentPreference();
  
      if (!checkoutUrl) {
        throw new Error('No se recibió una URL de redirección');
      }
  
      console.log('Redirigiendo a:', checkoutUrl);
      window.location.href = checkoutUrl;
  
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('handlePayment error:', errorMessage);
      onError?.(errorMessage);
      setLoading(false);
    }
  };
  

  const total = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={() => setShowSummary(true)}
        disabled={disabled || items.length === 0}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-white
          transition-all duration-200 transform
          ${disabled || items.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-black hover:bg-blue-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
          }
          ${className}
        `}
      >
        <div className="flex items-center justify-center space-x-2">
          <ShoppingCart className="w-5 h-5" />
          <span>Ver resumen de compra</span>
        </div>
      </button>

      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full relative shadow-2xl">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" onClick={() => setShowSummary(false)}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Resumen de compra
            </h2>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.title} (x{item.quantity})
                  </span>
                  <span className="font-medium">
                    ${(item.unit_price * item.quantity).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    ${total.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`
                mt-6 w-full py-3 px-6 rounded-lg font-semibold text-white
                transition-all duration-200 transform
                ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl'
                }
              `}
            >
              <div className="flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pagar con MercadoPago</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="text-center mt-3">
        <span className="text-xs text-gray-500">Procesado por</span>
        <div className="font-bold text-blue-500 text-sm">MercadoPago</div>
      </div>
    </div>
  );
};

export type { PaymentItem };

export default PaymentButton;