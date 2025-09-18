import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ErrorBoundary catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // PUBLIC_INTERFACE
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // PUBLIC_INTERFACE
  componentDidCatch(error, errorInfo) {
    // In production you could report this to an external service
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  // PUBLIC_INTERFACE
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 16 }}>
          <div className="card" style={{ width: 480, maxWidth: '100%' }}>
            <h2 style={{ marginTop: 0 }}>Something went wrong</h2>
            <p style={{ color: 'var(--muted)' }}>
              The UI encountered an unexpected error and cannot continue. You can try reloading the page.
            </p>
            <pre style={{ whiteSpace: 'pre-wrap', background: 'var(--panel-2)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
              {String(this.state.error || '')}
            </pre>
            <div className="toolbar" style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => window.location.reload()}>Reload</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
