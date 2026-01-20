import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";

type Subject = {
  id: number;
  name: string;
  code: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function ClassCreate() {
  const navigate = useNavigate();  const { toast } = useToast();  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [formData, setFormData] = useState({
    subjectId: "",
    teacherId: "",
    schedule: "",
    maxStudents: "",
    status: "active",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, usersRes] = await Promise.all([
          fetch("http://localhost:8000/api/subjects?limit=100"),
          fetch("http://localhost:8000/api/users?limit=100"),
        ]);

        if (subjectsRes.ok && usersRes.ok) {
          const subjectsData = await subjectsRes.json();
          const usersData = await usersRes.json();
          
          setSubjects(subjectsData.data || []);
          setTeachers(
            (usersData.data || []).filter((u: User) => u.role === "teacher")
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          subjectId: parseInt(formData.subjectId),
          maxStudents: parseInt(formData.maxStudents),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Class created successfully",
        });
        navigate("/classes");
      } else {
        const data = await response.json();
        const errorMsg = data.message || "Failed to create class";
        setError(errorMsg);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMsg,
        });
      }
    } catch (error) {
      const errorMsg = "Network error. Please check your connection.";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Network Error",
        description: errorMsg,
      });
      console.error("Error creating class:", error);
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
          onClick={() => navigate("/classes")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <Breadcrumb />
          <h1 className="text-3xl font-bold mt-2">Create Class</h1>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-start gap-3 max-w-2xl">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Class Information</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subjectId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the subject for this class
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">
                  Teacher <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, teacherId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Assign a teacher to this class
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">
                  Schedule <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="schedule"
                  placeholder="e.g., Mon/Wed 10:00-12:00"
                  value={formData.schedule}
                  onChange={(e) =>
                    setFormData({ ...formData, schedule: e.target.value })
                  }
                  required
                  maxLength={255}
                />
                <p className="text-xs text-muted-foreground">
                  Class schedule (max 255 characters)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStudents">
                  Max Students <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="maxStudents"
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.maxStudents}
                  onChange={(e) =>
                    setFormData({ ...formData, maxStudents: e.target.value })
                  }
                  required
                  min="1"
                  max="1000"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of students (1-1000)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Current class status
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/classes")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Creating..." : "Create Class"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
