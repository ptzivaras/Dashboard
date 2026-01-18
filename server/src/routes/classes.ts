import express from "express";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { classes, subjects, user, enrollments } from "../db/schema/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, subject, teacher, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(classes.name, `%${search}%`),
          ilike(classes.inviteCode, `%${search}%`)
        )
      );
    }

    if (subject) {
      filterConditions.push(ilike(subjects.name, `%${subject}%`));
    }

    if (teacher) {
      filterConditions.push(ilike(user.name, `%${teacher}%`));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const classesList = await db
      .select({
        ...getTableColumns(classes),
        subject: getTableColumns(subjects),
        teacher: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        totalEnrollments: sql<number>`count(${enrollments.id})`,
      })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .leftJoin(enrollments, eq(classes.id, enrollments.classId))
      .where(whereClause)
      .groupBy(classes.id, subjects.id, user.id)
      .orderBy(desc(classes.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.json({
      data: classesList,
      total: totalCount,
      page: currentPage,
      limit: limitPerPage,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const classData = await db
      .select({
        ...getTableColumns(classes),
        subject: getTableColumns(subjects),
        teacher: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .where(eq(classes.id, +id))
      .limit(1);

    if (!classData.length) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json(classData[0]);
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ error: "Failed to fetch class" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      subjectId,
      teacherId,
      inviteCode,
      name,
      capacity,
      description,
      status,
      schedules,
    } = req.body;

    const newClass = await db
      .insert(classes)
      .values({
        subjectId,
        teacherId,
        inviteCode,
        name,
        capacity,
        description,
        status,
        schedules,
      })
      .returning();

    res.status(201).json(newClass[0]);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Failed to create class" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await db
      .update(classes)
      .set(updateData)
      .where(eq(classes.id, +id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({ error: "Failed to update class" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(classes)
      .where(eq(classes.id, +id))
      .returning();

    if (!deleted.length) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ error: "Failed to delete class" });
  }
});

export default router;
