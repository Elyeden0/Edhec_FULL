import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/Logo";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Step2Questions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [hairType, setHairType] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [washFrequency, setWashFrequency] = useState("");

  const hairTypes = [
    { value: "straight", label: "Straight", emoji: "➖" },
    { value: "wavy", label: "Wavy", emoji: "〰️" },
    { value: "curly", label: "Curly", emoji: "🌀" },
    { value: "coily", label: "Coily/Kinky", emoji: "🔃" },
  ];

  const concernOptions = [
    { value: "dryness", label: "Dryness" },
    { value: "frizz", label: "Frizz" },
    { value: "damage", label: "Damage/Breakage" },
    { value: "oiliness", label: "Oiliness" },
    { value: "dullness", label: "Lack of Shine" },
    { value: "thinning", label: "Thinning" },
  ];

  const washOptions = [
    { value: "daily", label: "Daily" },
    { value: "2-3times", label: "2-3 times per week" },
    { value: "weekly", label: "Once a week" },
    { value: "less", label: "Less than once a week" },
  ];

  const toggleConcern = (value: string) => {
    setConcerns(prev =>
      prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value]
    );
  };

  const handleNext = () => {
    if (!hairType) {
      toast({
        title: "Selection Required",
        description: "Please select your hair type to continue.",
        variant: "destructive"
      });
      return;
    }

    if (concerns.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one hair concern.",
        variant: "destructive"
      });
      return;
    }

    if (!washFrequency) {
      toast({
        title: "Selection Required",
        description: "Please select your wash frequency.",
        variant: "destructive"
      });
      return;
    }

    // Store answers
    sessionStorage.setItem('hairType', hairType);
    sessionStorage.setItem('concerns', JSON.stringify(concerns));
    sessionStorage.setItem('washFrequency', washFrequency);
    
    navigate("/step3");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-primary">Step 2</span>
          <span>/</span>
          <span>4</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/step1")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-4xl font-bold mb-2">Tell Us About Your Hair</h1>
          <p className="text-lg text-muted-foreground">
            Help us understand your hair better for personalized recommendations
          </p>
        </div>

        <div className="space-y-6">
          {/* Hair Type */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>What's your hair type?</CardTitle>
              <CardDescription>Select the option that best describes your natural hair texture</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={hairType} onValueChange={setHairType}>
                <div className="grid grid-cols-2 gap-4">
                  {hairTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`
                        flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all
                        ${hairType === type.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
                      `}
                    >
                      <RadioGroupItem value={type.value} id={type.value} />
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{type.emoji}</span>
                        <Label htmlFor={type.value} className="cursor-pointer font-medium">
                          {type.label}
                        </Label>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Hair Concerns */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>What are your main hair concerns?</CardTitle>
              <CardDescription>Select all that apply</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {concernOptions.map((concern) => (
                  <label
                    key={concern.value}
                    className={`
                      flex items-center space-x-3 border-2 rounded-lg p-3 cursor-pointer transition-all
                      ${concerns.includes(concern.value) ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
                    `}
                  >
                    <Checkbox
                      checked={concerns.includes(concern.value)}
                      onCheckedChange={() => toggleConcern(concern.value)}
                      id={concern.value}
                    />
                    <Label htmlFor={concern.value} className="cursor-pointer">
                      {concern.label}
                    </Label>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Wash Frequency */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>How often do you wash your hair?</CardTitle>
              <CardDescription>This helps us understand your hair care routine</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={washFrequency} onValueChange={setWashFrequency}>
                <div className="space-y-3">
                  {washOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`
                        flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all
                        ${washFrequency === option.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
                      `}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer font-medium">
                        {option.label}
                      </Label>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Next Button */}
        <div className="mt-8">
          <Button
            onClick={handleNext}
            size="lg"
            className="w-full h-14 text-lg"
          >
            Continue to Location
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step2Questions;
