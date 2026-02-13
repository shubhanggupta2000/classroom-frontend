import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { BarChart, PieChart, LineChart } from "recharts";
import { useList } from "@refinedev/core";
import { User, ClassDetails, Subject, Department } from "@/types";
import {
  Users,
  BookOpen,
  GraduationCap,
  Building2,
  AlertTriangle,
} from "lucide-react";

const Dashboard = () => {
  // Fetch data
  const { query: usersQuery } = useList<User>({
    resource: "users",
    pagination: { pageSize: 100 },
  });
  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: { pageSize: 100 },
  });
  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { pageSize: 100 },
  });
  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: { pageSize: 100 },
  });

  const users = usersQuery.data?.data || [];
  const departments = departmentsQuery.data?.data || [];
  const subjects = subjectsQuery.data?.data || [];
  const classes = classesQuery.data?.data || [];

  // Metrics
  const totalUsers = users.length;
  const totalTeachers = users.filter((u) => u.role === "teacher").length;
  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalDepartments = departments.length;
  const totalSubjects = subjects.length;
  const totalClasses = classes.length;
  const totalEnrollments = classes.reduce(
    (acc, c) => acc + (c.capacity || 0),
    0,
  );

  // Chart: User Distribution
  const userDistribution = [
    { name: "Students", value: totalStudents },
    { name: "Teachers", value: totalTeachers },
    { name: "Admins", value: totalAdmins },
  ];

  // Chart: Classes by Department
  const classesByDept = useMemo(() => {
    const map: Record<string, number> = {};
    classes.forEach((c) => {
      const dept = c.department?.name || "Unknown";
      map[dept] = (map[dept] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [classes]);

  // Chart: Capacity Status
  const capacityStatus = useMemo(() => {
    let filled = 0,
      available = 0;
    classes.forEach((c) => {
      filled += c.capacity || 0;
      // For demo, assume all classes are full
    });
    return [
      { name: "Filled", value: filled },
      { name: "Available", value: totalClasses * 50 - filled },
    ];
  }, [classes, totalClasses]);

  // Chart: Enrollment Trends (Fake data for demo)
  const enrollmentTrends = [
    { month: "Jan", enrollments: 20 },
    { month: "Feb", enrollments: 35 },
    { month: "Mar", enrollments: 50 },
    { month: "Apr", enrollments: 40 },
    { month: "May", enrollments: 60 },
    { month: "Jun", enrollments: 55 },
  ];

  // Activity Feed (Fake data for demo)
  const activityFeed = [
    { type: "enroll", user: "Alice", className: "Math 101", time: "2m ago" },
    {
      type: "create",
      user: "Admin",
      className: "Physics 201",
      time: "10m ago",
    },
    { type: "unenroll", user: "Bob", className: "History 101", time: "1h ago" },
    {
      type: "invite",
      user: "Teacher Jane",
      className: "Biology 101",
      time: "2h ago",
    },
  ];

  // Capacity warnings
  const capacityWarnings = classes.filter((c) => c.capacity && c.capacity < 5);

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 p-4">
          <Users className="text-primary" />
          <div>
            <div className="text-lg font-bold">{totalUsers}</div>
            <div className="text-muted-foreground">Users</div>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <Building2 className="text-primary" />
          <div>
            <div className="text-lg font-bold">{totalDepartments}</div>
            <div className="text-muted-foreground">Departments</div>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <BookOpen className="text-primary" />
          <div>
            <div className="text-lg font-bold">{totalSubjects}</div>
            <div className="text-muted-foreground">Subjects</div>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <GraduationCap className="text-primary" />
          <div>
            <div className="text-lg font-bold">{totalClasses}</div>
            <div className="text-muted-foreground">Classes</div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4 col-span-2">
          <div className="font-semibold mb-2">Enrollment Trends</div>
          <LineChart width={350} height={180} data={enrollmentTrends}>
            {/* Add axes, lines, tooltips as needed */}
          </LineChart>
        </Card>
        <Card className="p-4">
          <div className="font-semibold mb-2">User Distribution</div>
          <PieChart width={180} height={180}>
            {/* Pie slices for userDistribution */}
          </PieChart>
        </Card>
        <Card className="p-4">
          <div className="font-semibold mb-2">Classes by Department</div>
          <BarChart width={180} height={180} data={classesByDept}>
            {/* Bars for classesByDept */}
          </BarChart>
        </Card>
        <Card className="p-4">
          <div className="font-semibold mb-2">Capacity Status</div>
          <PieChart width={180} height={180}>
            {/* Pie slices for capacityStatus */}
          </PieChart>
        </Card>
      </div>

      {/* Capacity Warnings */}
      {capacityWarnings.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-300">
          <div className="flex items-center gap-2 mb-2 text-yellow-700">
            <AlertTriangle className="w-5 h-5" />
            <span>Capacity Warnings</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {capacityWarnings.map((c) => (
              <Badge key={c.id} variant="destructive">
                {c.name}: {c.capacity} spots left
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Activity Feed */}
      <Card className="p-4">
        <div className="font-semibold mb-2">Recent Activity</div>
        <Separator />
        <ul className="mt-2 space-y-2">
          {activityFeed.map((a, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Badge variant={a.type === "enroll" ? "default" : "secondary"}>
                {a.type.charAt(0).toUpperCase() + a.type.slice(1)}
              </Badge>
              <span>
                <b>{a.user}</b>{" "}
                {a.type === "enroll"
                  ? "enrolled in"
                  : a.type === "unenroll"
                  ? "left"
                  : a.type === "invite"
                  ? "invited to"
                  : "created"}{" "}
                <b>{a.className}</b>
              </span>
              <span className="ml-auto text-muted-foreground">{a.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Dashboard;
