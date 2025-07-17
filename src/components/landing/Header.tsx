import { Globe, User, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-primary">vigovia</div>
          <span className="text-sm text-muted-foreground">PLUS PACK</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#"
            className="text-foreground hover:text-primary transition-colors"
          >
            Instant Visa
          </Link>
          <Link
            href="#"
            className="text-foreground hover:text-primary transition-colors"
          >
            One Week Visa
          </Link>
          <Link
            href="#"
            className="text-foreground hover:text-primary transition-colors"
          >
            One Month Visa
          </Link>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">Country</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-foreground">Language</span>
          </div>
        </nav>

        <div className="flex items-center space-x-4">
          <Sun className="h-5 w-5 text-muted-foreground cursor-pointer" />
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span className="text-foreground">Utkarsh</span>
          </div>
          <Button variant="outline" size="sm">
            Login / Sign Up
          </Button>
          <Button asChild>
            <Link href={"/form"}>Generate Itinerary</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
