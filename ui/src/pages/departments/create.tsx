import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Breadcrumb } from "../../components/refine-ui/layout/breadcrumb";
import { ArrowLeft, Save } from "lucide-react";

export default function DepartmentCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/departments");
      } else {
        console.error("Failed to create department");
      }
    } catch (error) {
      console.error("Error creating department:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/departments")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <Breadcrumb />
          <h1 className="text-3xl font-bold mt-2">Create Department</h1>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Department Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code">
                Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="e.g., CS, EE, ME"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                Unique department code (max 50 characters)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Computer Science"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                maxLength={255}
              />
              <p className="text-xs text-muted-foreground">
                Full department name (max 255 characters)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter department description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Optional description of the department
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/departments")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Creating..." : "Create Department"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
