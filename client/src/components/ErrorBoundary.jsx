import React from 'react';
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h1>
                    <p className="text-lg text-gray-700 mb-6">We're sorry for the inconvenience. Please try refreshing the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
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