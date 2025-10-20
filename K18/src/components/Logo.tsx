const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-3xl font-black tracking-tight">K18</span>
      <div className="flex flex-col gap-0.5">
        <div className="flex gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
        </div>
        <div className="flex gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
