import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, LogOut, LogIn, User } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect admin users to the admin dashboard
  useEffect(() => {
    if (user?.isAdmin) {
      navigate("/admin");
    }
  }, [user, navigate]);

  return (
    <header className="py-4 px-6 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6 text-quickcart-600" />
          <span className="font-bold text-xl text-quickcart-600">QuickCart</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-quickcart-600">Home</Link>
          {user && !user.isAdmin && ( // Hide other links if user is admin
            <>
              <Link to="/create-list" className="text-gray-600 hover:text-quickcart-600">Create List</Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-sm text-gray-600">
                Hello, {user.name}
              </span>
              <Button variant="ghost" onClick={logout} size="sm" className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Login</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Register</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
