import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GoogleAuthButton = () => {
  const handleClick = async () => {
    try {
      const redirectTo = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { access_type: "offline", prompt: "consent" },
          skipBrowserRedirect: false,
        },
      });

      if (error) throw error;

      // Fallback for environments where auto-redirect is blocked
      if (data?.url) window.location.assign(data.url);
    } catch (err: any) {
      toast.error("Google Sign-In failed", {
        description: err?.message ?? "Check Supabase auth settings and redirect URLs.",
      });
    }
  };

  return (
    <Button variant="outline" onClick={handleClick} className="w-full md:w-auto">
      <LogIn />
      Continue with Google
    </Button>
  );
};

export default GoogleAuthButton;
