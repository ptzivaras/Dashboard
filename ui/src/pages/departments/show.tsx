import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Breadcrumb } from "../../components/refine-ui/layout/breadcrumb";
import { Separator } from "../../components/ui/separator";
import { ArrowLeft, Edit, Loader2, Building2, FileText, Calendar } from "lucide-react";
import { formatDate } from "../../lib/utils";

type Department = {
  id: number;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export default function DepartmentShow() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/departments/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setDepartment(data);
        }
      } catch (error) {
        console.error("Error fetching department:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDepartment();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!department) {
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
          <h1 className="text-3xl font-bold">Department not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
            <h1 className="text-3xl font-bold mt-2">{department.name}</h1>
          </div>
        </div>
        <Button onClick={() => navigate(`/departments/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Department
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Code</p>
              <Badge className="mt-1">{department.code}</Badge>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="mt-1 font-medium">{department.name}</p>
            </div>

            {department.description && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                  </p>
                  <p className="mt-1 text-sm">{department.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timestamps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="mt-1 font-medium">{formatDate(department.createdAt)}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="mt-1 font-medium">{formatDate(department.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
