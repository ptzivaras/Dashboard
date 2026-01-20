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

type SubjectListItem = {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  departmentId: number;
  department?: {
    id: number;
    name: string;
    code?: string | null;
  } | null;
  totalClasses?: number | null;
};

const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const subjectColumns = useMemo<ColumnDef<SubjectListItem>[]>(
    () => [
      {
        id: "code",
        accessorKey: "code",
        size: 120,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => {
          const code = getValue<string>();

          return code ? (
            <Badge>{code}</Badge>
          ) : (
            <span className="text-muted-foreground ml-2">No code</span>
          );
        },
      },
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground font-medium">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        id: "department",
        accessorKey: "department.name",
        size: 180,
        header: () => <p className="column-title">Department</p>,
        cell: ({ row }) => {
          const dept = row.original.department;
          return dept ? (
            <Badge variant="secondary">{dept.name}</Badge>
          ) : (
            <span className="text-muted-foreground">No department</span>
          );
        },
      },
      {
        id: "totalClasses",
        accessorKey: "totalClasses",
        size: 120,
        header: () => <p className="column-title">Classes</p>,
        cell: ({ getValue }) => {
          const total = getValue<number>();
          return (
            <Badge variant="outline" className="font-semibold">
              {total ?? 0}
            </Badge>
          );
        },
      },
      {
        id: "description",
        accessorKey: "description",
        size: 280,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => {
          const description = getValue<string>();

          return description ? (
            <span className="truncate line-clamp-2 text-sm">{description}</span>
          ) : (
            <span className="text-muted-foreground text-sm">No description</span>
          );
        },
      },
      {
        id: "actions",
        size: 200,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <ShowButton
              resource="subjects"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>
            <EditButton
              resource="subjects"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              Edit
            </EditButton>
            <DeleteButton
              resource="subjects"
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
          field: "code",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const subjectsTable = useTable<SubjectListItem>({
    columns: subjectColumns,
    refineCoreProps: {
      resource: "subjects",
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
      <h1 className="page-title">Subjects</h1>

      <div className="intro-row">
        <p className="text-muted-foreground">
          Manage academic subjects across different departments.
        </p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name or code..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <CreateButton resource="subjects" />
        </div>
      </div>

      <DataTable table={subjectsTable} />
    </ListView>
  );
};

export default SubjectsList;
