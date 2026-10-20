export default function LoadingSpinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex justify-center py-16">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-mist border-t-ink" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
