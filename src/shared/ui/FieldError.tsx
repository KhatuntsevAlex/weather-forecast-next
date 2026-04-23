export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className="absolute -bottom-5 left-1 text-xs text-red-500 dark:text-red-400"
    >
      {message}
    </p>
  );
}
