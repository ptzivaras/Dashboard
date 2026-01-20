import { Refine } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import dataProvider from "@refinedev/simple-rest";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import DepartmentsList from "./pages/departments/list";
import DepartmentCreate from "./pages/departments/create";
import DepartmentEdit from "./pages/departments/edit";
import DepartmentShow from "./pages/departments/show";
import SubjectsList from "./pages/subjects/list";
import SubjectCreate from "./pages/subjects/create";
import SubjectEdit from "./pages/subjects/edit";
import SubjectShow from "./pages/subjects/show";
import ClassesList from "./pages/classes/list";
import ClassCreate from "./pages/classes/create";
import ClassEdit from "./pages/classes/edit";
import ClassShow from "./pages/classes/show";
import EnrollmentsList from "./pages/enrollments/list";
import EnrollmentCreate from "./pages/enrollments/create";
import UsersList from "./pages/users/list";
import UserEdit from "./pages/users/edit";
import { MainLayout } from "./components/layout/main-layout";

function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider("http://localhost:8000/api")}
        resources={[
          {
            name: "departments",
            list: "/departments",
            create: "/departments/create",
            edit: "/departments/:id/edit",
            show: "/departments/:id",
          },
          {
            name: "subjects",
            list: "/subjects",
            create: "/subjects/create",
            edit: "/subjects/:id/edit",
            show: "/subjects/:id",
          },
          {
            name: "classes",
            list: "/classes",
            create: "/classes/create",
            edit: "/classes/:id/edit",
            show: "/classes/:id",
          },
          {
            name: "enrollments",
            list: "/enrollments",
            create: "/enrollments/create",
          },
          {
            name: "users",
            list: "/users",
            edit: "/users/:id/edit",
          },
        ]}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/departments"
            element={
              <MainLayout>
                <DepartmentsList />
              </MainLayout>
            }
          />
          <Route
            path="/departments/create"
            element={
              <MainLayout>
                <DepartmentCreate />
              </MainLayout>
            }
          />
          <Route
            path="/departments/:id"
            element={
              <MainLayout>
                <DepartmentShow />
              </MainLayout>
            }
          />
          <Route
            path="/departments/:id/edit"
            element={
              <MainLayout>
                <DepartmentEdit />
              </MainLayout>
            }
          />
          <Route
            path="/subjects"
            element={
              <MainLayout>
                <SubjectsList />
              </MainLayout>
            }
          />
          <Route
            path="/subjects/create"
            element={
              <MainLayout>
                <SubjectCreate />
              </MainLayout>
            }
          />
          <Route
            path="/subjects/:id"
            element={
              <MainLayout>
                <SubjectShow />
              </MainLayout>
            }
          />
          <Route
            path="/subjects/:id/edit"
            element={
              <MainLayout>
                <SubjectEdit />
              </MainLayout>
            }
          />
          <Route
            path="/classes"
            element={
              <MainLayout>
                <ClassesList />
              </MainLayout>
            }
          />
          <Route
            path="/classes/create"
            element={
              <MainLayout>
                <ClassCreate />
              </MainLayout>
            }
          />
          <Route
            path="/classes/:id"
            element={
              <MainLayout>
                <ClassShow />
              </MainLayout>
            }
          />
          <Route
            path="/classes/:id/edit"
            element={
              <MainLayout>
                <ClassEdit />
              </MainLayout>
            }
          />
          <Route
            path="/enrollments"
            element={
              <MainLayout>
                <EnrollmentsList />
              </MainLayout>
            }
          />
          <Route
            path="/enrollments/create"
            element={
              <MainLayout>
                <EnrollmentCreate />
              </MainLayout>
            }
          />
          <Route
            path="/users"
            element={
              <MainLayout>
                <UsersList />
              </MainLayout>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <MainLayout>
                <UserEdit />
              </MainLayout>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
