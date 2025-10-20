import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";

const products = [
  {
    id: 1,
    name: "K18 Leave-In Molecular Repair Hair Mask",
    price: "$75.00",
    size: "50ml",
    description: "Patented molecular repair treatment that works in 4 minutes"
  },
  {
    id: 2,
    name: "K18 PRO Chelating Hair Complex",
    price: "$68.00",
    size: "250ml",
    description: "Professional chelating treatment to remove buildup"
  },
  {
    id: 3,
    name: "K18 Peptide Prep pH Maintenance Shampoo",
    price: "$38.00",
    size: "250ml",
    description: "Color-safe cleansing shampoo with K18PEPTIDE™"
  },
  {
    id: 4,
    name: "K18 Detox Shampoo",
    price: "$40.00",
    size: "250ml",
    description: "Deep cleansing shampoo to clear buildup"
  },
  {
    id: 5,
    name: "K18 Damage Shield pH Protective Conditioner",
    price: "$40.00",
    size: "250ml",
    description: "pH-optimized conditioner with protective barrier"
  },
  {
    id: 6,
    name: "K18 AirWash Dry Shampoo",
    price: "$32.00",
    size: "250ml",
    description: "Non-aerosol dry shampoo for clean, refreshed hair"
  },
  {
    id: 7,
    name: "K18 Oil Leave-In",
    price: "$68.00",
    size: "30ml",
    description: "Molecular repair hair oil for strength and shine"
  },
  {
    id: 8,
    name: "K18 x Future Society Limited Edition Mask",
    price: "$75.00",
    size: "50ml",
    description: "Scented molecular repair mask with extinct flower DNA fragrance"
  }
];

const Products = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo />
          <div className="w-10" />
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Our Products</h1>
          <p className="text-muted-foreground">
            Biomimetic haircare backed by science
          </p>
        </div>

        <div className="grid gap-4 max-w-2xl mx-auto">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                    <CardDescription className="text-sm">{product.size}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{product.price}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <Button className="w-full" size="lg">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Products;
