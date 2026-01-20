import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { ListView } from "../../components/refine-ui/views/list-view";
import { Breadcrumb } from "../../components/refine-ui/layout/breadcrumb";
import { DataTable } from "../../components/refine-ui/data-table/data-table";
import { CreateButton } from "../../components/refine-ui/buttons/create";
import { DeleteButton } from "../../components/refine-ui/buttons/delete";
import { formatDate } from "../../lib/utils";

type EnrollmentListItem = {
  id: number;
  studentId: string;
  classId: number;
  createdAt: string;
  student?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
  } | null;
  class?: {
    id: number;
    name: string;
    inviteCode: string;
    status: string;
    subject?: {
      id: number;
      name: string;
      code?: string | null;
    } | null;
  } | null;
};

const EnrollmentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const enrollmentColumns = useMemo<ColumnDef<EnrollmentListItem>[]>(
    () => [
      {
        id: "student",
        accessorKey: "student.name",
        size: 220,
        header: () => <p className="column-title">Student</p>,
        cell: ({ row }) => {
          const student = row.original.student;
          return student ? (
            <div className="flex items-center gap-3">
              {student.image ? (
                <img
                  src={student.image}
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-medium text-sm">{student.name}</span>
                <span className="text-xs text-muted-foreground">{student.email}</span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">Unknown student</span>
          );
        },
        filterFn: "includesString",
      },
      {
        id: "class",
        accessorKey: "class.name",
        size: 200,
        header: () => <p className="column-title">Class</p>,
        cell: ({ row }) => {
          const classData = row.original.class;
          return classData ? (
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm">{classData.name}</span>
              {classData.subject && (
                <Badge variant="outline" className="w-fit text-xs">
                  {classData.subject.name}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">Unknown class</span>
          );
        },
      },
      {
        id: "inviteCode",
        accessorKey: "class.inviteCode",
        size: 140,
        header: () => <p className="column-title">Class Code</p>,
        cell: ({ row }) => {
          const code = row.original.class?.inviteCode;
          return code ? (
            <Badge variant="secondary" className="font-mono">
              {code}
            </Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        id: "status",
        accessorKey: "class.status",
        size: 120,
        header: () => <p className="column-title">Status</p>,
        cell: ({ row }) => {
          const status = row.original.class?.status;
          if (!status) return <span className="text-muted-foreground">-</span>;

          const variant =
            status === "active"
              ? "default"
              : status === "inactive"
              ? "secondary"
              : "outline";
          return (
            <Badge variant={variant as any} className="capitalize">
              {status}
            </Badge>
          );
        },
      },
      {
        id: "enrolledAt",
        accessorKey: "createdAt",
        size: 160,
        header: () => <p className="column-title">Enrolled Date</p>,
        cell: ({ getValue }) => {
          const date = getValue<string>();
          return (
            <span className="text-sm text-muted-foreground">
              {formatDate(date)}
            </span>
          );
        },
      },
      {
        id: "actions",
        size: 140,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <DeleteButton
              resource="enrollments"
              recordItemId={row.original.id}
              size="sm"
            >
              Remove
            </DeleteButton>
          </div>
        ),
      },
    ],
    []
  );

  const searchFilters = searchQuery
    ? [
        {
          field: "student.name",
          operator: "contains" as const,
          value: searchQuery,
        },
        {
          field: "student.email",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const enrollmentsTable = useTable<EnrollmentListItem>({
    columns: enrollmentColumns,
    refineCoreProps: {
      resource: "enrollments",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...searchFilters],
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Enrollments</h1>

      <div className="intro-row">
        <p className="text-muted-foreground">
          Manage student enrollments and track class participation.
        </p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by student name or email..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <CreateButton resource="enrollments" />
        </div>
      </div>

      <DataTable table={enrollmentsTable} />
    </ListView>
  );
};

export default EnrollmentsList;
