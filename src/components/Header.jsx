
import { ArrowLeft, Search, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = ({ 
  title, 
  showBack = false,
  showSearch = false,
  showClose = false,
  onClose,
  className = "" 
}) => {
  return (
    <header className={`flex items-center justify-between py-4 ${className}`}>
      <div className="flex items-center">
        {showBack && (
          <Link to="/" className="mr-3">
            <ArrowLeft size={20} />
          </Link>
        )}
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
      <div>
        {showSearch && (
          <Link to="/search">
            <Search size={20} />
          </Link>
        )}
        {showClose && (
          <button onClick={onClose}>
            <X size={20} />
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
