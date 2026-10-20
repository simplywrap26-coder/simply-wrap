export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div role="alert" className="mx-auto my-12 max-w-md rounded-sm border border-mist bg-sand/50 p-5 text-sm">
      <p className="font-medium">We couldn't load this.</p>
      <p className="mt-1 text-stone">{message}</p>
    </div>
  );
}
