export function ErrorBanner({ message }) {
  return (
    <div className="error-banner" role="alert" data-testid="error-banner">
      {message}
    </div>
  );
}
