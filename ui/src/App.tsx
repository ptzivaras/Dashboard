import { Refine } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import dataProvider from "@refinedev/simple-rest";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import DepartmentsList from "./pages/departments/list";
import SubjectsList from "./pages/subjects/list";
import ClassesList from "./pages/classes/list";
import EnrollmentsList from "./pages/enrollments/list";
import UsersList from "./pages/users/list";
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
          },
          {
            name: "subjects",
            list: "/subjects",
          },
          {
            name: "classes",
            list: "/classes",
          },
          {
            name: "enrollments",
            list: "/enrollments",
          },
          {
            name: "users",
            list: "/users",
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
            path="/subjects"
            element={
              <MainLayout>
                <SubjectsList />
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
            path="/enrollments"
            element={
              <MainLayout>
                <EnrollmentsList />
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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
