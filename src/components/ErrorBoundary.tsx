import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong. Please try again later.";
      
      try {
        // Check if it's our custom JSON error from handleFirestoreError
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.operationType) {
          errorMessage = `Database Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path}`;
        }
      } catch (e) {
        // Not a JSON error, use raw message if available
        if (this.state.error?.message) {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="bg-red-600/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="text-red-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Oops!</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {errorMessage}
            </p>
            <button 
              onClick={this.handleReset}
              className="w-full bg-white text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition"
            >
              <RefreshCw className="w-4 h-4" /> Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
