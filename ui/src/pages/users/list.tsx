import { Search, UserCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { ListView } from "../../components/refine-ui/views/list-view";
import { Breadcrumb } from "../../components/refine-ui/layout/breadcrumb";
import { DataTable } from "../../components/refine-ui/data-table/data-table";
import { EditButton } from "../../components/refine-ui/buttons/edit";
import { formatDate } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

type UserListItem = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "admin" | "teacher" | "student";
  emailVerified: boolean;
  createdAt: string;
};

const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const userColumns = useMemo<ColumnDef<UserListItem>[]>(
    () => [
      {
        id: "user",
        accessorKey: "name",
        size: 280,
        header: () => <p className="column-title">User</p>,
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                  <UserCircle className="w-8 h-8 text-primary" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          );
        },
        filterFn: "includesString",
      },
      {
        id: "role",
        accessorKey: "role",
        size: 120,
        header: () => <p className="column-title">Role</p>,
        cell: ({ getValue }) => {
          const role = getValue<string>();
          const variant =
            role === "admin"
              ? "destructive"
              : role === "teacher"
              ? "default"
              : "secondary";
          return (
            <Badge variant={variant as any} className="capitalize">
              {role}
            </Badge>
          );
        },
      },
      {
        id: "emailVerified",
        accessorKey: "emailVerified",
        size: 140,
        header: () => <p className="column-title">Email Status</p>,
        cell: ({ getValue }) => {
          const verified = getValue<boolean>();
          return verified ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              Not Verified
            </Badge>
          );
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        size: 160,
        header: () => <p className="column-title">Joined Date</p>,
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
        size: 120,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <EditButton
              resource="users"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              Edit
            </EditButton>
          </div>
        ),
      },
    ],
    []
  );

  const filters = [];

  if (searchQuery) {
    filters.push({
      field: "search",
      operator: "contains" as const,
      value: searchQuery,
    });
  }

  if (roleFilter && roleFilter !== "all") {
    filters.push({
      field: "role",
      operator: "eq" as const,
      value: roleFilter,
    });
  }

  const usersTable = useTable<UserListItem>({
    columns: userColumns,
    refineCoreProps: {
      resource: "users",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: filters,
      },
      sorters: {
        initial: [
          {
            field: "createdAt",
            order: "desc",
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Users</h1>

      <div className="intro-row">
        <p className="text-muted-foreground">
          Manage system users, roles, and permissions.
        </p>

        <div className="actions-row">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>

          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>
      </div>

      <DataTable table={usersTable} />
    </ListView>
  );
};

export default UsersList;
