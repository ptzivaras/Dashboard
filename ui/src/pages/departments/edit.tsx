import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Breadcrumb } from "../../components/refine-ui/layout/breadcrumb";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function DepartmentEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/departments/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setFormData({
            code: data.code || "",
            name: data.name || "",
            description: data.description || "",
          });
        }
      } catch (error) {
        console.error("Error fetching department:", error);
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchDepartment();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/departments/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        navigate("/departments");
      } else {
        console.error("Failed to update department");
      }
    } catch (error) {
      console.error("Error updating department:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mt-2">Edit Department</h1>
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
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
