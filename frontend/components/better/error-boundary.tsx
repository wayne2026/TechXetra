import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        // Update state to indicate error
        return { hasError: true };
    }

    componentDidCatch(_: Error, __: ErrorInfo) {
        // You can log the error to an error reporting service
        console.error('Error caught in error boundary');
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (hasError) {
            // Render fallback UI when an error occurs
            return (
                <div className='flex flex-col justify-center gap-8 items-center mt-8'>
                    <h1>Something Went Wrong!!</h1>
                </div>
            );
        }

        // Render children if no error occurred
        return children;
    }
}

export default ErrorBoundary;
