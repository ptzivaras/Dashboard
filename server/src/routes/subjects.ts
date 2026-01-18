import express from "express";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { subjects, departments, classes } from "../db/schema/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`)
        )
      );
    }

    if (department) {
      filterConditions.push(ilike(departments.name, `%${department}%`));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const subjectsList = await db
      .select({
        ...getTableColumns(subjects),
        department: {
          ...getTableColumns(departments),
        },
        totalClasses: sql<number>`count(${classes.id})`,
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .leftJoin(classes, eq(subjects.id, classes.subjectId))
      .where(whereClause)
      .groupBy(subjects.id, departments.id)
      .orderBy(desc(subjects.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.json({
      data: subjectsList,
      total: totalCount,
      page: currentPage,
      limit: limitPerPage,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await db
      .select({
        ...getTableColumns(subjects),
        department: getTableColumns(departments),
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(eq(subjects.id, +id))
      .limit(1);

    if (!subject.length) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.json(subject[0]);
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ error: "Failed to fetch subject" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { departmentId, name, code, description } = req.body;

    const newSubject = await db
      .insert(subjects)
      .values({ departmentId, name, code, description })
      .returning();

    res.status(201).json(newSubject[0]);
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ error: "Failed to create subject" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentId, name, code, description } = req.body;

    const updated = await db
      .update(subjects)
      .set({ departmentId, name, code, description })
      .where(eq(subjects.id, +id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ error: "Failed to update subject" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(subjects)
      .where(eq(subjects.id, +id))
      .returning();

    if (!deleted.length) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ error: "Failed to delete subject" });
  }
});

export default router;
