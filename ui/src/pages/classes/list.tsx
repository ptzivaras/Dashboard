import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { ListView } from "../../components/refine-ui/views/list-view";
import { Breadcrumb } from "../../components/refine-ui/layout/breadcrumb";
import { DataTable } from "../../components/refine-ui/data-table/data-table";
import { ShowButton } from "../../components/refine-ui/buttons/show";
import { CreateButton } from "../../components/refine-ui/buttons/create";
import { EditButton } from "../../components/refine-ui/buttons/edit";
import { DeleteButton } from "../../components/refine-ui/buttons/delete";

type ClassListItem = {
  id: number;
  name: string;
  inviteCode: string;
  status: "active" | "inactive" | "archived";
  capacity: number;
  subjectId: number;
  teacherId: string;
  subject?: {
    id: number;
    name: string;
    code?: string | null;
  } | null;
  teacher?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
  totalEnrollments?: number | null;
};

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const classColumns = useMemo<ColumnDef<ClassListItem>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title">Class Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground font-medium">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        id: "subject",
        accessorKey: "subject.name",
        size: 180,
        header: () => <p className="column-title">Subject</p>,
        cell: ({ row }) => {
          const subject = row.original.subject;
          return subject ? (
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm">{subject.name}</span>
              {subject.code && (
                <Badge variant="outline" className="w-fit text-xs">
                  {subject.code}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">No subject</span>
          );
        },
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        size: 180,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ row }) => {
          const teacher = row.original.teacher;
          return teacher ? (
            <div className="flex items-center gap-2">
              {teacher.image && (
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm">{teacher.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">No teacher</span>
          );
        },
      },
      {
        id: "status",
        accessorKey: "status",
        size: 120,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
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
        id: "enrollments",
        accessorKey: "totalEnrollments",
        size: 140,
        header: () => <p className="column-title">Enrollments</p>,
        cell: ({ getValue, row }) => {
          const total = getValue<number>() ?? 0;
          const capacity = row.original.capacity;
          const percentage = capacity > 0 ? (total / capacity) * 100 : 0;
          const color =
            percentage >= 90
              ? "text-red-600"
              : percentage >= 70
              ? "text-orange-600"
              : "text-green-600";

          return (
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${color}`}>
                {total}/{capacity}
              </span>
              <span className="text-xs text-muted-foreground">
                ({Math.round(percentage)}%)
              </span>
            </div>
          );
        },
      },
      {
        id: "inviteCode",
        accessorKey: "inviteCode",
        size: 140,
        header: () => <p className="column-title">Invite Code</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="font-mono">
            {getValue<string>()}
          </Badge>
        ),
      },
      {
        id: "actions",
        size: 200,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <ShowButton
              resource="classes"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>
            <EditButton
              resource="classes"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              Edit
            </EditButton>
            <DeleteButton
              resource="classes"
              recordItemId={row.original.id}
              size="sm"
            >
              Delete
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
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
        {
          field: "inviteCode",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const classesTable = useTable<ClassListItem>({
    columns: classColumns,
    refineCoreProps: {
      resource: "classes",
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
      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p className="text-muted-foreground">
          Manage classes, track enrollments, and monitor capacity.
        </p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name or invite code..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <CreateButton resource="classes" />
        </div>
      </div>

      <DataTable table={classesTable} />
    </ListView>
  );
};

export default ClassesList;
