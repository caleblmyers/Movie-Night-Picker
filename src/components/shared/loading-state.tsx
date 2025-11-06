interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

export function LoadingState({
  message = "Loading...",
  submessage,
}: LoadingStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="text-2xl font-semibold text-foreground">{message}</div>
        {submessage && (
          <div className="text-muted-foreground">{submessage}</div>
        )}
      </div>
    </div>
  );
}
