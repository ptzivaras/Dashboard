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

type Class = {
  id: number;
  subjectId: number;
  teacherId: string;
  schedule: string;
  maxStudents: number;
  status: string;
};

export default function ClassEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
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
        const [classRes, subjectsRes, usersRes] = await Promise.all([
          fetch(`http://localhost:8000/api/classes/${id}`),
          fetch("http://localhost:8000/api/subjects?limit=100"),
          fetch("http://localhost:8000/api/users?limit=100"),
        ]);

        if (classRes.ok && subjectsRes.ok && usersRes.ok) {
          const classData: Class = await classRes.json();
          const subjectsData = await subjectsRes.json();
          const usersData = await usersRes.json();

          setSubjects(subjectsData.data || []);
          setTeachers(
            (usersData.data || []).filter((u: User) => u.role === "teacher")
          );
          setFormData({
            subjectId: classData.subjectId.toString(),
            teacherId: classData.teacherId,
            schedule: classData.schedule,
            maxStudents: classData.maxStudents.toString(),
            status: classData.status,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/classes/${id}`, {
        method: "PATCH",
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
        navigate("/classes");
      } else {
        console.error("Failed to update class");
      }
    } catch (error) {
      console.error("Error updating class:", error);
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
          <h1 className="text-3xl font-bold mt-2">Edit Class</h1>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Class Information</CardTitle>
        </CardHeader>
        <CardContent>
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
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
