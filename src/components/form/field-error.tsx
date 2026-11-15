export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-small font-medium text-danger">
      {message}
    </p>
  );
}
