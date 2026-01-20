import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Breadcrumb } from "../../components/refine-ui/layout/breadcrumb";
import { ArrowLeft, Edit2, Loader2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";

type Subject = {
  id: number;
  departmentId: number;
  code: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
  department?: {
    name: string;
    code: string;
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

export default function SubjectShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/subjects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSubject(data);
        }
      } catch (error) {
        console.error("Error fetching subject:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!subject) {
    return <div>Subject not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/subjects")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Breadcrumb />
            <h1 className="text-3xl font-bold mt-2">Subject Details</h1>
          </div>
        </div>
        <Button onClick={() => navigate(`/subjects/${id}/edit`)}>
          <Edit2 className="mr-2 h-4 w-4" />
          Edit Subject
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
                Subject Code
              </p>
              <p className="text-lg font-semibold">{subject.code}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Subject Name
              </p>
              <p className="text-lg">{subject.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Department
              </p>
              {subject.department ? (
                <Badge variant="outline" className="text-sm">
                  {subject.department.name} ({subject.department.code})
                </Badge>
              ) : (
                <p className="text-sm text-muted-foreground">No department assigned</p>
              )}
            </div>

            {subject.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-sm">{subject.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Subject ID
              </p>
              <p className="text-sm font-mono">{subject.id}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Created At
              </p>
              <p className="text-sm">{formatDate(subject.createdAt)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Last Updated
              </p>
              <p className="text-sm">{formatDate(subject.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
