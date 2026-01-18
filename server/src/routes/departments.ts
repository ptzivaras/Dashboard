import express from "express";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { departments, subjects } from "../db/schema/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(departments.name, `%${search}%`),
          ilike(departments.code, `%${search}%`)
        )
      );
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(departments)
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const departmentsList = await db
      .select({
        ...getTableColumns(departments),
        totalSubjects: sql<number>`count(${subjects.id})`,
      })
      .from(departments)
      .leftJoin(subjects, eq(departments.id, subjects.departmentId))
      .where(whereClause)
      .groupBy(departments.id)
      .orderBy(desc(departments.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.json({
      data: departmentsList,
      total: totalCount,
      page: currentPage,
      limit: limitPerPage,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const department = await db
      .select()
      .from(departments)
      .where(eq(departments.id, +id))
      .limit(1);

    if (!department.length) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json(department[0]);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ error: "Failed to fetch department" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { code, name, description } = req.body;

    const newDepartment = await db
      .insert(departments)
      .values({ code, name, description })
      .returning();

    res.status(201).json(newDepartment[0]);
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ error: "Failed to create department" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description } = req.body;

    const updated = await db
      .update(departments)
      .set({ code, name, description })
      .where(eq(departments.id, +id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ error: "Failed to update department" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(departments)
      .where(eq(departments.id, +id))
      .returning();

    if (!deleted.length) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ error: "Failed to delete department" });
  }
});

export default router;
