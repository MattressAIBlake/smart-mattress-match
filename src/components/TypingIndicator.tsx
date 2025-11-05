export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 py-2">
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
    </div>
  );
};
