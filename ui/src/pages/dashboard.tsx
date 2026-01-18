import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Users, BookOpen, Building2, GraduationCap } from "lucide-react";

interface Stats {
  users: number;
  teachers: number;
  admins: number;
  subjects: number;
  departments: number;
  classes: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/stats/overview")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stats:", err);
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Teachers",
      value: stats?.teachers || 0,
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Departments",
      value: stats?.departments || 0,
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Subjects",
      value: stats?.subjects || 0,
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Classes",
      value: stats?.classes || 0,
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Admins",
      value: stats?.admins || 0,
      icon: GraduationCap,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to the Classroom Management System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/departments"
                className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Manage Departments</div>
                <div className="text-sm text-gray-600">
                  Add, edit, or remove departments
                </div>
              </a>
              <a
                href="/subjects"
                className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Manage Subjects</div>
                <div className="text-sm text-gray-600">
                  View and organize subjects
                </div>
              </a>
              <a
                href="/classes"
                className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Manage Classes</div>
                <div className="text-sm text-gray-600">
                  Create and manage classes
                </div>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Student Users</span>
                  <span className="font-semibold">
                    {(stats?.users || 0) - (stats?.teachers || 0) - (stats?.admins || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Teaching Staff</span>
                  <span className="font-semibold">{stats?.teachers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Administrators</span>
                  <span className="font-semibold">{stats?.admins || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Classes</span>
                  <span className="font-semibold">{stats?.classes || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
