import { Component } from "react";
import { Link } from "react-router-dom";

// Error boundaries MUST be class components — React requirement
// They catch errors in any child component during render
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Fires when a child throws — update state to show fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Good place to log to an error tracking service (Sentry etc.)
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-500 text-sm mb-6 max-w-md">
            An unexpected error occurred. Try refreshing the page or going back
            home.
          </p>
          {/* Show error details in development only */}
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 max-w-lg text-left overflow-auto">
              {this.state.error.toString()}
            </pre>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg transition-colors text-sm"
            >
              Try Again
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg transition-colors text-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
