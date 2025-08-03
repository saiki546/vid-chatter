import { Button } from "@/components/ui/button";
import { Moon, Sun, MessageSquare, Upload, History } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Upload className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">AI Transcript</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <Link to="/">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </Link>
          <Link to="/chat">
            <Button
              variant={location.pathname === "/chat" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </Button>
          </Link>
          <Link to="/history">
            <Button
              variant={location.pathname === "/history" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </Link>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}