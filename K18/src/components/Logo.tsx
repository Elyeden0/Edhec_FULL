import { useNavigate } from "react-router-dom";

const Logo = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();

  return (
    <div 
      className={`flex items-center gap-1 cursor-pointer ${className}`}
      onClick={() => navigate("/")}
      role="button"
      aria-label="Go to home page"
    >
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
