export const up = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  await sequelize.query(
    'ALTER TABLE users ADD CONSTRAINT users_department_fk FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL'
  );
  await sequelize.query(
    'ALTER TABLE courses ADD CONSTRAINT courses_teacher_fk FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL'
  );
  await sequelize.query(
    'ALTER TABLE courses ADD CONSTRAINT courses_department_fk FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT'
  );
  await sequelize.query(
    'ALTER TABLE enrollments ADD CONSTRAINT enrollments_student_fk FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE'
  );
  await sequelize.query(
    'ALTER TABLE enrollments ADD CONSTRAINT enrollments_course_fk FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE'
  );
  await sequelize.query(
    'ALTER TABLE courses ADD CONSTRAINT courses_capacity_nonnegative CHECK (capacity >= 0)'
  );
  await sequelize.query(
    'ALTER TABLE courses ADD CONSTRAINT courses_min_quota_nonnegative CHECK (min_quota >= 0)'
  );
  await sequelize.query(
    'ALTER TABLE courses ADD CONSTRAINT courses_enrolled_count_nonnegative CHECK (enrolled_count >= 0)'
  );
};

export const down = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  await sequelize.query(
    'ALTER TABLE users DROP CONSTRAINT IF EXISTS users_department_fk'
  );
  await sequelize.query(
    'ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_teacher_fk'
  );
  await sequelize.query(
    'ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_department_fk'
  );
  await sequelize.query(
    'ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_student_fk'
  );
  await sequelize.query(
    'ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_course_fk'
  );
  await sequelize.query(
    'ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_capacity_nonnegative'
  );
  await sequelize.query(
    'ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_min_quota_nonnegative'
  );
  await sequelize.query(
    'ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_enrolled_count_nonnegative'
  );
};
