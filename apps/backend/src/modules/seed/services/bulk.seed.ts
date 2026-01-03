import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { faker, zh_CN } from '@faker-js/faker';
import { createLogger } from '../../../common/logger';
import { ProgressReporter } from '../../../common/progress-reporter';
import { chineseNames, seedDefaults } from '../seed-config';

type BulkConfig = {
  departmentsCount: number;
  teachersPerDept: number;
  studentsPerDept: number;
  coursesPerDeptPerTerm: number;
  academicYears: string[];
  semesters: Array<'FALL' | 'SPRING'>;
  enrollmentsPerStudent: number;
  skipIfDataExists?: boolean;
};

@Injectable()
export class BulkSeedService {
  private log = createLogger('bulk-seed');
  private reporter: ProgressReporter | null = null;

  async run(sequelize: Sequelize, cfg: BulkConfig) {
    this.log.info({ cfg }, 'start bulk');
    this.reporter = new ProgressReporter(this.log);
    if (
      cfg.skipIfDataExists &&
      (await this.shouldSkip(sequelize))
    ) {
      this.log.info('skip bulk due to existing data');
      return;
    }
    const deptIds = await this.seedDepartments(
      sequelize,
      cfg
    );
    const { teacherIdsByDept, studentIdsByDept } =
      await this.seedUsers(sequelize, cfg, deptIds);
    const courseIdsByDeptTerm = await this.seedCourses(
      sequelize,
      cfg,
      deptIds,
      teacherIdsByDept
    );
    await this.seedSchedules(
      sequelize,
      courseIdsByDeptTerm
    );
    await this.seedPrerequisites(
      sequelize,
      courseIdsByDeptTerm
    );
    await this.seedEnrollments(
      sequelize,
      cfg,
      studentIdsByDept,
      courseIdsByDeptTerm
    );
    this.log.info('bulk done');
  }

  private async shouldSkip(sequelize: Sequelize) {
    const [rows]: any = await sequelize.query(
      `SELECT 
         (SELECT COUNT(*) FROM courses) AS courses,
         (SELECT COUNT(*) FROM enrollments) AS enrollments,
         (SELECT COUNT(*) FROM users WHERE role='STUDENT') AS students,
         (SELECT COUNT(*) FROM users WHERE role='TEACHER') AS teachers,
         (SELECT COUNT(*) FROM class_schedules) AS schedules,
         (SELECT COUNT(*) FROM prerequisites) AS prerequisites,
         (SELECT COUNT(*) FROM departments) AS departments`
    );
    const c = rows?.[0] ?? {};
    const total =
      Number(c.courses ?? 0) +
      Number(c.enrollments ?? 0) +
      Number(c.students ?? 0) +
      Number(c.teachers ?? 0) +
      Number(c.schedules ?? 0) +
      Number(c.prerequisites ?? 0) +
      Number(c.departments ?? 0);
    const threshold = 10;
    const skip = total > threshold;
    this.log.info(
      { counts: c, total, threshold, skip },
      'existing counts'
    );
    return skip;
  }

  private async seedDepartments(
    sequelize: Sequelize,
    cfg: BulkConfig
  ) {
    this.log.info('seed departments');
    const deptIds: string[] = [];
    const total = cfg.departmentsCount;
    for (let i = 1; i <= cfg.departmentsCount; i++) {
      const code = `D${String(i).padStart(3, '0')}`;
      const name = faker.location.city() + '学院';
      const idRes: any = await sequelize.query(
        `SELECT uuid_generate_v4() AS id`
      );
      const id = idRes[0]?.[0]?.id;
      await sequelize.query(
        `INSERT INTO departments(
          id, code, name, full_name, level, path, status, display_order,
          created_by, updated_by, created_at, updated_at
        ) SELECT
          :id, :code, :name, :full_name, 1, :id, 'ACTIVE', :order,
          NULL, NULL, NOW(), NOW()
        WHERE NOT EXISTS (SELECT 1 FROM departments WHERE code=:code)`,
        {
          replacements: {
            id,
            code,
            name,
            full_name: name,
            order: i,
          },
        }
      );
      const [drow]: any = await sequelize.query(
        `SELECT id FROM departments WHERE code=:code`,
        { replacements: { code } }
      );
      const did = drow?.[0]?.id ?? id;
      deptIds.push(did);
      this.reporter!.update('departments', i, total);
    }
    return deptIds;
  }

  private async seedUsers(
    sequelize: Sequelize,
    cfg: BulkConfig,
    deptIds: string[]
  ) {
    this.log.info('seed users');
    const teacherIdsByDept: Record<string, string[]> = {};
    const studentIdsByDept: Record<string, string[]> = {};
    const totalTeachers =
      deptIds.length * cfg.teachersPerDept;
    const totalStudents =
      deptIds.length * cfg.studentsPerDept;
    let doneTeachers = 0;
    let doneStudents = 0;
    for (const [idx, deptId] of deptIds.entries()) {
      const deptCode = `D${String(idx + 1).padStart(3, '0')}`;
      teacherIdsByDept[deptId] = [];
      studentIdsByDept[deptId] = [];
      // Teachers
      for (let t = 1; t <= cfg.teachersPerDept; t++) {
        const realName = this.cnName();
        const username = realName;
        const emailLocal = `t_${deptCode}_${String(t).padStart(5, '0')}`;
        const email = `${emailLocal}@${seedDefaults.emailDomain}`;
        const id = uuidv4();
        {
          const crypto = await import('node:crypto');
          const password_hash = crypto
            .createHash('sha256')
            .update('a123456')
            .digest('hex');
          await sequelize.query(
            `INSERT INTO users(
              id, username, email, real_name, gender, password_hash,
              role, status, department_id, created_at, updated_at
            ) SELECT
              :id, :username, :email, :real_name, 'SECRET', :password_hash,
              'TEACHER', 'ACTIVE', :department_id, NOW(), NOW()
            WHERE NOT EXISTS (SELECT 1 FROM users WHERE username=:username)`,
            {
              replacements: {
                id,
                username,
                email,
                real_name: realName,
                department_id: deptId,
                password_hash,
              },
            }
          );
        }
        const [urow]: any = await sequelize.query(
          `SELECT id FROM users WHERE username=:username`,
          { replacements: { username } }
        );
        const uid = urow?.[0]?.id ?? id;
        teacherIdsByDept[deptId].push(uid);
        doneTeachers++;
        this.reporter!.update(
          'teachers',
          doneTeachers,
          totalTeachers
        );
      }
      // Students
      for (let s = 1; s <= cfg.studentsPerDept; s++) {
        const realName = this.cnName();
        const username = realName;
        const emailLocal = `s_${deptCode}_${String(s).padStart(6, '0')}`;
        const email = `${emailLocal}@${seedDefaults.emailDomain}`;
        const id = uuidv4();
        {
          const crypto = await import('node:crypto');
          const password_hash = crypto
            .createHash('sha256')
            .update('a123456')
            .digest('hex');
          await sequelize.query(
            `INSERT INTO users(
              id, username, email, real_name, gender, password_hash,
              role, status, department_id, created_at, updated_at
            ) SELECT
              :id, :username, :email, :real_name, 'SECRET', :password_hash,
              'STUDENT', 'ACTIVE', :department_id, NOW(), NOW()
            WHERE NOT EXISTS (SELECT 1 FROM users WHERE username=:username)`,
            {
              replacements: {
                id,
                username,
                email,
                real_name: realName,
                department_id: deptId,
                password_hash,
              },
            }
          );
        }
        const [srow]: any = await sequelize.query(
          `SELECT id FROM users WHERE username=:username`,
          { replacements: { username } }
        );
        const sid = srow?.[0]?.id ?? id;
        studentIdsByDept[deptId].push(sid);
        doneStudents++;
        this.reporter!.update(
          'students',
          doneStudents,
          totalStudents
        );
      }
    }
    return { teacherIdsByDept, studentIdsByDept };
  }

  private cnName() {
    const surname =
      chineseNames.surnames[
        Math.floor(
          Math.random() * chineseNames.surnames.length
        )
      ];
    const len =
      Math.random() < seedDefaults.nameLengthPreferOne
        ? 1
        : 2;
    let given = '';
    for (let i = 0; i < len; i++) {
      given +=
        chineseNames.givenChars[
          Math.floor(
            Math.random() * chineseNames.givenChars.length
          )
        ];
    }
    return surname + given;
  }

  private async seedCourses(
    sequelize: Sequelize,
    cfg: BulkConfig,
    deptIds: string[],
    teacherIdsByDept: Record<string, string[]>
  ) {
    this.log.info('seed courses');
    const courseIdsByDeptTerm: Record<string, string[]> =
      {};
    const total =
      deptIds.length *
      cfg.academicYears.length *
      cfg.semesters.length *
      cfg.coursesPerDeptPerTerm;
    let done = 0;
    for (const deptId of deptIds) {
      for (const year of cfg.academicYears) {
        for (const sem of cfg.semesters) {
          const key = `${deptId}:${year}:${sem}`;
          courseIdsByDeptTerm[key] = [];
          for (
            let i = 1;
            i <= cfg.coursesPerDeptPerTerm;
            i++
          ) {
            const code = `C${year.replace('-', '')}_${sem}_${String(i).padStart(4, '0')}_${deptId.slice(0, 8)}`;
            const name =
              faker.word.words({
                count: { min: 1, max: 3 },
              }) + '课程';
            const english = faker.word.words({
              count: { min: 1, max: 3 },
            });
            const credit = faker.helpers.arrayElement([
              1.0, 2.0, 3.0, 4.0,
            ]);
            const hours = credit * 16;
            const capacity = faker.number.int({
              min: 30,
              max: 200,
            });
            const minQuota = Math.min(
              credit * 3,
              Math.floor(capacity / 5)
            );
            const teacherPool = teacherIdsByDept[deptId];
            const teacher_id =
              faker.helpers.arrayElement(teacherPool);
            try {
              await sequelize.query(
                `INSERT INTO courses(
                id, course_code, course_number, name, english_name, credit, credit_hours, course_type,
                department_id, teacher_id, academic_year, semester, capacity, min_quota, enrolled_count,
                status, schedule, location_type, location_details, description, objectives, syllabus,
                assessment_method, textbook_reference, attachments, restrictions, view_count, favorite_count,
                review_notes, reviewed_at, reviewed_by, published_at, created_at, updated_at
              ) SELECT
                uuid_generate_v4(), :course_code, NULL, :name, :english_name, :credit, :credit_hours, 'COMPULSORY',
                :department_id, :teacher_id, :academic_year, :semester, :capacity, :min_quota, 0,
                'PUBLISHED', :schedule::jsonb, 'CLASSROOM', '{}'::jsonb, NULL, NULL, NULL,
                NULL, NULL, '[]'::jsonb, :restrictions::jsonb, 0, 0,
                NULL, NOW(), :teacher_id, NOW(), NOW(), NOW()
              WHERE NOT EXISTS (SELECT 1 FROM courses WHERE course_code=:course_code)`,
                {
                  replacements: {
                    course_code: code,
                    name,
                    english_name: english,
                    credit,
                    credit_hours: hours,
                    department_id: deptId,
                    teacher_id,
                    academic_year: year,
                    semester: sem,
                    capacity,
                    min_quota: Math.max(
                      1,
                      Number(minQuota)
                    ),
                    schedule: JSON.stringify({
                      weekly: [],
                      specific_dates: [],
                    }),
                    restrictions: JSON.stringify({
                      grade_limits: [],
                      major_limits: [],
                      prerequisites: [],
                      conflict_courses: [],
                    }),
                  },
                }
              );
            } catch (e: any) {
              // 简单跳过写入失败，记录错误以继续批量生成
              // 可按需改为抛出或重试
              // eslint-disable-next-line no-console
              console.error('Insert course failed', {
                code,
                deptId,
                teacher_id,
                year,
                sem,
                err: e?.message || String(e),
              });
              continue;
            }
            const [cidRes]: any = await sequelize.query(
              `SELECT id FROM courses WHERE course_code=:code`,
              { replacements: { code } }
            );
            const cid = cidRes?.[0]?.id;
            if (cid) courseIdsByDeptTerm[key].push(cid);
            done++;
            this.reporter!.update('courses', done, total);
          }
        }
      }
    }
    return courseIdsByDeptTerm;
  }

  private async seedSchedules(
    sequelize: Sequelize,
    courseIdsByDeptTerm: Record<string, string[]>
  ) {
    this.log.info('seed schedules');
    const blocks = seedDefaults.scheduleBlocks;
    const total = Object.values(courseIdsByDeptTerm).reduce(
      (acc, arr) => acc + arr.length,
      0
    );
    let done = 0;
    for (const key of Object.keys(courseIdsByDeptTerm)) {
      for (const cid of courseIdsByDeptTerm[key]) {
        const count = faker.number.int({ min: 1, max: 3 });
        const used: Set<string> = new Set();
        for (let i = 0; i < count; i++) {
          const weekday = faker.number.int({
            min: 1,
            max: 7,
          });
          const block = faker.helpers.arrayElement(blocks);
          const uniq = `${weekday}-${block.start}-${block.end}`;
          if (used.has(uniq)) continue;
          used.add(uniq);
          const location = `${faker.location.street()} ${faker.number.int({ min: 101, max: 999 })}`;
          await sequelize.query(
            `INSERT INTO class_schedules(id, course_id, weekday, start_time, end_time, location, is_active)
             SELECT uuid_generate_v4(), :course_id, :weekday, :start_time, :end_time, :location, TRUE
             WHERE NOT EXISTS (
               SELECT 1 FROM class_schedules WHERE course_id=:course_id AND weekday=:weekday AND start_time=:start_time AND end_time=:end_time
             )`,
            {
              replacements: {
                course_id: cid,
                weekday,
                start_time: block.start,
                end_time: block.end,
                location,
              },
            }
          );
        }
        done++;
        this.reporter!.update('schedules', done, total);
      }
    }
  }

  private async seedPrerequisites(
    sequelize: Sequelize,
    courseIdsByDeptTerm: Record<string, string[]>
  ) {
    this.log.info('seed prerequisites');
    const total = Object.values(courseIdsByDeptTerm).reduce(
      (acc, arr) => acc + arr.length,
      0
    );
    let done = 0;
    for (const key of Object.keys(courseIdsByDeptTerm)) {
      const arr = courseIdsByDeptTerm[key];
      for (let i = 0; i < arr.length; i++) {
        const cid = arr[i];
        const maxPrereq = faker.number.int({
          min: 0,
          max: 3,
        });
        const candidates = arr.slice(0, i); // 仅选择本term前序课程，避免环与自身
        for (
          let k = 0;
          k < maxPrereq && candidates.length > 0;
          k++
        ) {
          const pcid =
            faker.helpers.arrayElement(candidates);
          await sequelize.query(
            `INSERT INTO prerequisites(id, course_id, prerequisite_course_id)
             SELECT uuid_generate_v4(), :course_id, :pcid
             WHERE NOT EXISTS (
               SELECT 1 FROM prerequisites WHERE course_id=:course_id AND prerequisite_course_id=:pcid
             )`,
            { replacements: { course_id: cid, pcid } }
          );
        }
        done++;
        this.reporter!.update('prerequisites', done, total);
      }
    }
  }

  private async seedEnrollments(
    sequelize: Sequelize,
    cfg: BulkConfig,
    studentIdsByDept: Record<string, string[]>,
    courseIdsByDeptTerm: Record<string, string[]>
  ) {
    this.log.info('seed enrollments');
    const allCourses: string[] = Object.values(
      courseIdsByDeptTerm
    ).flat();
    if (!allCourses.length) return;
    const total =
      Object.values(studentIdsByDept).reduce(
        (acc, arr) => acc + arr.length,
        0
      ) * cfg.enrollmentsPerStudent;
    let done = 0;
    for (const deptId of Object.keys(studentIdsByDept)) {
      const students = studentIdsByDept[deptId];
      for (const sid of students) {
        const count = cfg.enrollmentsPerStudent;
        const chosen = new Set<string>();
        for (let i = 0; i < count; i++) {
          const cid =
            faker.helpers.arrayElement(allCourses);
          if (chosen.has(cid)) continue;
          chosen.add(cid);
          const [courseRow]: any = await sequelize.query(
            `SELECT academic_year AS year, semester AS sem, capacity, enrolled_count FROM courses WHERE id=:cid`,
            { replacements: { cid } }
          );
          const meta = courseRow?.[0];
          if (!meta) continue;
          // 唯一与容量保护，容量不在此处更新（遵守 CHECK），留给业务层或后续统计更新
          try {
            await sequelize.query(
              `INSERT INTO enrollments(
              id, student_id, course_id, academic_year, semester, status, selection_round,
              selection_method, enrolled_at, created_at, updated_at
            ) SELECT
              uuid_generate_v4(), :student_id, :course_id, :year, :sem, :status, 1,
              'MANUAL', NOW(), NOW(), NOW()
            WHERE NOT EXISTS (
              SELECT 1 FROM enrollments WHERE student_id=:student_id AND course_id=:course_id AND academic_year=:year AND semester=:sem
            )`,
              {
                replacements: {
                  student_id: sid,
                  course_id: cid,
                  year: meta.year,
                  sem: meta.sem,
                  status: faker.helpers.arrayElement(
                    seedDefaults.enrollmentStatusPool
                  ),
                },
              }
            );
          } catch (e: any) {
            // eslint-disable-next-line no-console
            console.error('Insert enrollment failed', {
              sid,
              cid,
              year: meta.year,
              sem: meta.sem,
              err: e?.message || String(e),
            });
          }
          done++;
          this.reporter!.update('enrollments', done, total);
        }
      }
    }
  }
}
