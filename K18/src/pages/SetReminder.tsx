import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { CheckCircle } from "lucide-react";

const SetReminder = () => {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState<number | null>(7);
  const [saved, setSaved] = useState(false);

  const saveReminder = (days: number | null) => {
    // Compute reminder date if days provided
    if (days) {
      const when = new Date();
      when.setDate(when.getDate() + days);
      const reminder = {
        when: when.toISOString(),
        days,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("feedbackReminder", JSON.stringify(reminder));
    } else {
      // clear any existing reminder
      localStorage.removeItem("feedbackReminder");
    }

    setSaved(true);

    // After a short delay, go to the pending purchase (if any) or to products
    setTimeout(() => {
      const pendingRaw = sessionStorage.getItem('pendingPurchase');
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          // Clear the pending purchase and redirect to external store
          sessionStorage.removeItem('pendingPurchase');
          if (pending.url) {
            // Use location.href so it behaves like a normal navigation
            window.location.href = pending.url;
            return;
          }
        } catch (e) {
          // fallback to products
        }
      }

      navigate("/products");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white">
      <header className="p-6 flex items-center justify-between">
        <Logo />
      </header>

      <div className="container max-w-lg mx-auto px-4 py-12">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Set a reminder for feedback</CardTitle>
            <CardDescription>
              We'd love to hear how the products worked for you. Choose when you'd like us to remind you to leave feedback after you receive your purchase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!saved ? (
              <div>
                <p className="mb-4 text-sm text-muted-foreground">Select a reminder time:</p>
                <div className="flex gap-3">
                  <Button variant={selectedDays === 7 ? undefined : "outline"} onClick={() => setSelectedDays(7)}>7 days</Button>
                  <Button variant={selectedDays === 14 ? undefined : "outline"} onClick={() => setSelectedDays(14)}>14 days</Button>
                  <Button variant={selectedDays === 21 ? undefined : "outline"} onClick={() => setSelectedDays(21)}>21 days</Button>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button onClick={() => saveReminder(selectedDays ?? 7)} className="flex-1">Set Reminder</Button>
                  <Button variant="ghost" onClick={() => { saveReminder(null); }} className="flex-1">Skip</Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <h3 className="text-lg font-semibold">All set!</h3>
                <p className="text-sm text-muted-foreground mt-2">We'll remind you to leave feedback on the date you chose.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetReminder;
