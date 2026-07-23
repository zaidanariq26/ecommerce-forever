import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
          <h2 className="mb-2 text-xl font-medium text-gray-900">
            Something went wrong
          </h2>
          <p className="mb-6 max-w-md text-sm text-gray-500">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer bg-gray-900 px-6 py-2 text-sm text-white hover:bg-gray-800"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
