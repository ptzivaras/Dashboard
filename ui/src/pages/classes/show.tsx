import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Breadcrumb } from "../../components/refine-ui/layout/breadcrumb";
import { ArrowLeft, Edit2, Loader2, Users } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

type Class = {
  id: number;
  subjectId: number;
  teacherId: string;
  schedule: string;
  maxStudents: number;
  inviteCode: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  subject?: {
    name: string;
    code: string;
    department?: {
      name: string;
    };
  };
  teacher?: {
    name: string;
    email: string;
  };
  _count?: {
    enrollments: number;
  };
};

const formatDate = (date: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-700 dark:text-green-400";
    case "inactive":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    case "archived":
      return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  }
};

export default function ClassShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/classes/${id}`);
        if (response.ok) {
          const data = await response.json();
          setClassData(data);
        }
      } catch (error) {
        console.error("Error fetching class:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!classData) {
    return <div>Class not found</div>;
  }

  const enrollmentCount = classData._count?.enrollments || 0;
  const enrollmentPercentage = (enrollmentCount / classData.maxStudents) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
            <h1 className="text-3xl font-bold mt-2">Class Details</h1>
          </div>
        </div>
        <Button onClick={() => navigate(`/classes/${id}/edit`)}>
          <Edit2 className="mr-2 h-4 w-4" />
          Edit Class
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Subject
              </p>
              {classData.subject ? (
                <div>
                  <p className="text-lg font-semibold">{classData.subject.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {classData.subject.code}
                    {classData.subject.department && (
                      <> • {classData.subject.department.name}</>
                    )}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No subject assigned</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Teacher
              </p>
              {classData.teacher ? (
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {classData.teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{classData.teacher.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {classData.teacher.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No teacher assigned</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Schedule
              </p>
              <p className="text-lg">{classData.schedule}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </p>
              <Badge className={getStatusColor(classData.status)}>
                {classData.status.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrollment & Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Enrollment Status
              </p>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-lg font-semibold">
                    {enrollmentCount} / {classData.maxStudents}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        enrollmentPercentage >= 90
                          ? "bg-red-500"
                          : enrollmentPercentage >= 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${enrollmentPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Invite Code
              </p>
              <p className="text-lg font-mono">{classData.inviteCode}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Class ID
              </p>
              <p className="text-sm font-mono">{classData.id}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Created At
              </p>
              <p className="text-sm">{formatDate(classData.createdAt)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Last Updated
              </p>
              <p className="text-sm">{formatDate(classData.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
