import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'خطای غیرمنتظره‌ای رخ داد.',
    };
  }

  render() {
    if (this.state.hasError) {
      let readableMessage = 'متاسفانه در پردازش درخواست مشکلی پیش آمد. لطفاً صفحه را مجدداً بارگذاری کنید.';
      try {
        const parsed = JSON.parse(this.state.errorMessage);
        if (parsed?.error) {
          readableMessage = `خطای ارتباط با پایگاه داده: ${parsed.error}`;
        }
      } catch {
        // Keep clean Persian message for non-JSON errors
      }

      return (
        <div className="min-h-screen bg-[#F6F6F4] flex items-center justify-center p-6" dir="rtl">
          <div className="max-w-md w-full bg-white border border-neutral-200 rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-lg bg-red-50 text-red-700 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-[#111315] mb-2">اختلال موقت در سامانه</h1>
            <p className="text-sm text-neutral-600 leading-relaxed mb-6">{readableMessage}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111315] text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>بارگذاری مجدد صفحه</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
