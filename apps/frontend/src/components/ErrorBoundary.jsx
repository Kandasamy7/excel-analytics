import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("🛑 ErrorBoundary caught:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-600">
          <h2 className="text-2xl font-bold">Something went wrong 😓</h2>
          <p>{this.state.error?.message || 'Unknown error occurred.'}</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
