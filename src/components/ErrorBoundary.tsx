import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SmartSeva UI Error Caught:', error.name, error.message, errorInfo.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#home';
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8f9ff] text-[#121c28] flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#c3c6d1] rounded-2xl p-6 shadow-sm text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center text-rose-600">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#001e40]">Something went wrong</h2>
              <p className="text-xs text-[#43474f] mt-1 leading-relaxed">
                We ran into an unexpected issue. Don't worry, your progress is safe.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full mt-2">
              <button
                type="button"
                onClick={this.handleRetry}
                className="w-full h-11 bg-[#005db6] hover:bg-[#00376f] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">refresh</span>
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full h-11 bg-[#eef4ff] hover:bg-[#dfe9fa] text-[#005db6] border border-[#c3c6d1] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">home</span>
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
