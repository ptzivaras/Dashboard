import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Users, BookOpen, GraduationCap, School, Loader2 } from "lucide-react";

type Stats = {
  users: number;
  teachers: number;
  admins: number;
  subjects: number;
  departments: number;
  classes: number;
};

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/stats/overview");
        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users || 0,
      icon: Users,
      description: `${stats?.teachers || 0} teachers, ${stats?.admins || 0} admins`,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Departments",
      value: stats?.departments || 0,
      icon: School,
      description: "Academic departments",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Subjects",
      value: stats?.subjects || 0,
      icon: BookOpen,
      description: "Available subjects",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Classes",
      value: stats?.classes || 0,
      icon: GraduationCap,
      description: "Active classes",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10",
    },
      icon: Users,
      description: "Student enrollments",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the Classroom Management System
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/classes/create"
              className="block p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <p className="font-medium">Create New Class</p>
              <p className="text-sm text-muted-foreground">
                Set up a new class for students
              </p>
            </a>
            <a
              href="/enrollments/create"
              className="block p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <p className="font-medium">Enroll Student</p>
              <p className="text-sm text-muted-foreground">
                Add a student to an existing class
              </p>
            </a>
            <a
              href="/subjects/create"
              className="block p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <p className="font-medium">Add Subject</p>
              <p className="text-sm text-muted-foreground">
                Create a new subject in a department
              </p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Class Utilization
              </span>
              <span className="font-medium">
                {stats?.totalEnrollments && stats?.totalClasses
                  ? Math.round(
                      (stats.totalEnrollments / (stats.totalClasses * 30)) * 100
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{
                  width: `${
                    stats?.totalEnrollments && stats?.totalClasses
                      ? Math.min(
                          (stats.totalEnrollments / (stats.totalClasses * 30)) *
                            100,
                          100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Classes</span>
                <span className="font-medium">{stats?.activeClasses || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Subjects</span>
                <span className="font-medium">{stats?.totalSubjects || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Departments</span>
                <span className="font-medium">
                  {stats?.totalDepartments || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
