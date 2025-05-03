// filepath: c:\Users\Nipun\v2\AgentAI\components\ui\card.tsx
export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`card ${className}`}>{children}</div>
  );