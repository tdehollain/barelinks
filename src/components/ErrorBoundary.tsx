import { ErrorBoundary } from 'react-error-boundary';

type FallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
    >
      <p className="font-semibold">Something went wrong.</p>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-xs">
        {error.message}
      </pre>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="mt-3 rounded-md border border-destructive/60 bg-background px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/20"
      >
        Try again
      </button>
    </div>
  );
}

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactElement | ((props: FallbackProps) => React.ReactElement);
  onReset?: () => void;
};

export function ErrorBoundaryWrapper({
  children,
  fallback,
  onReset,
}: Props) {
  return (
    <ErrorBoundary
      fallbackRender={
        fallback
          ? typeof fallback === 'function'
            ? fallback
            : () => fallback
          : ErrorFallback
      }
      onReset={onReset}
    >
      {children}
    </ErrorBoundary>
  );
}
