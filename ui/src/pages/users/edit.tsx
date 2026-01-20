import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Breadcrumb } from "../../components/refine-ui/layout/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
};

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${id}`);
        if (response.ok) {
          const userData: User = await response.json();
          setUser(userData);
          setFormData({
            name: userData.name,
            email: userData.email,
            role: userData.role,
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/users");
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      case "teacher":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "student":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/users")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <Breadcrumb />
          <h1 className="text-3xl font-bold mt-2">Edit User</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  maxLength={255}
                />
                <p className="text-xs text-muted-foreground">
                  User's full name (max 255 characters)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  User's email address
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  User's role in the system
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/users")}
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

        <Card>
          <CardHeader>
            <CardTitle>User Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Current Role
              </p>
              <Badge className={getRoleBadgeColor(user.role)}>
                {user.role.toUpperCase()}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Email Verification
              </p>
              {user.emailVerified ? (
                <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                  ✓ Verified
                </Badge>
              ) : (
                <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                  Pending
                </Badge>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                User ID
              </p>
              <p className="text-xs font-mono break-all">{user.id}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Member Since
              </p>
              <p className="text-sm">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
