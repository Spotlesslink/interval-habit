import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

const GoogleAuthButton = () => {
  const handleClick = () => {
    toast("Connect Supabase to enable Google Sign-In", {
      description: "Click the Supabase button (top-right) to link your project, then we’ll wire this button to Google OAuth.",
    });
  };

  return (
    <Button variant="outline" onClick={handleClick} className="w-full md:w-auto">
      <LogIn />
      Continue with Google
    </Button>
  );
};

export default GoogleAuthButton;
