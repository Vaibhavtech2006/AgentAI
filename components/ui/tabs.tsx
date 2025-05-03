// filepath: c:\Users\Nipun\v2\AgentAI\components\ui\tabs.tsx
export const Tabs = ({ children }: { children: React.ReactNode }) => (
    <div className="tabs">{children}</div>
  );
  
  export const Tab = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button className="tab" onClick={onClick}>
      {children}
    </button>
  );