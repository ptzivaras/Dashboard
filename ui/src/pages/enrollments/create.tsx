import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
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
import { ArrowLeft, Save, Loader2, Users } from "lucide-react";
import { Badge } from "../../components/ui/badge";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Class = {
  id: number;
  schedule: string;
  status: string;
  maxStudents: number;
  subject?: {
    name: string;
    code: string;
  };
  teacher?: {
    name: string;
  };
  _count?: {
    enrollments: number;
  };
};

export default function EnrollmentCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, classesRes] = await Promise.all([
          fetch("http://localhost:8000/api/users?limit=100"),
          fetch("http://localhost:8000/api/classes?limit=100"),
        ]);

        if (usersRes.ok && classesRes.ok) {
          const usersData = await usersRes.json();
          const classesData = await classesRes.json();

          setStudents(
            (usersData.data || []).filter((u: User) => u.role === "student")
          );
          setClasses(classesData.data || []);
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

    try {
      const response = await fetch("http://localhost:8000/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          classId: parseInt(formData.classId),
        }),
      });

      if (response.ok) {
        navigate("/enrollments");
      } else {
        console.error("Failed to create enrollment");
      }
    } catch (error) {
      console.error("Error creating enrollment:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedClass = classes.find(
    (c) => c.id.toString() === formData.classId
  );
  const enrollmentCount = selectedClass?._count?.enrollments || 0;
  const maxStudents = selectedClass?.maxStudents || 0;
  const isFull = enrollmentCount >= maxStudents;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/enrollments")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <Breadcrumb />
          <h1 className="text-3xl font-bold mt-2">Enroll Student</h1>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Enrollment Information</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="student">
                  Student <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.studentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, studentId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the student to enroll
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">
                  Class <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, classId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => {
                      const clsEnrollmentCount = cls._count?.enrollments || 0;
                      const clsIsFull = clsEnrollmentCount >= cls.maxStudents;

                      return (
                        <SelectItem
                          key={cls.id}
                          value={cls.id.toString()}
                          disabled={clsIsFull || cls.status !== "active"}
                        >
                          <div className="flex items-center justify-between gap-2 w-full">
                            <span>
                              {cls.subject?.name} ({cls.subject?.code})
                            </span>
                            {clsIsFull && (
                              <Badge variant="destructive" className="ml-2">
                                FULL
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the class to enroll in
                </p>
              </div>

              {selectedClass && (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Class Details
                      </p>
                      <p className="text-lg font-semibold">
                        {selectedClass.subject?.name} (
                        {selectedClass.subject?.code})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">Schedule:</p>
                      <p className="text-sm font-medium">
                        {selectedClass.schedule}
                      </p>
                    </div>

                    {selectedClass.teacher && (
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          Teacher:
                        </p>
                        <p className="text-sm font-medium">
                          {selectedClass.teacher.name}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {enrollmentCount} / {maxStudents} enrolled
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              (enrollmentCount / maxStudents) * 100 >= 90
                                ? "bg-red-500"
                                : (enrollmentCount / maxStudents) * 100 >= 70
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${(enrollmentCount / maxStudents) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {isFull && (
                      <div className="bg-destructive/10 text-destructive p-3 rounded-md">
                        <p className="text-sm font-medium">
                          This class is full and cannot accept new enrollments.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/enrollments")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || isFull}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Enrolling..." : "Enroll Student"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
