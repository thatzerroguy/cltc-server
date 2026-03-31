-- CreateTable
CREATE TABLE "Alumini" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "school_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "year_of_participation" TEXT,
    "occupation" TEXT,
    "age" TEXT,
    "gender" TEXT,
    "sponsor" TEXT,
    "image_url" TEXT,

    CONSTRAINT "Alumini_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alumini" ADD CONSTRAINT "Alumini_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alumini" ADD CONSTRAINT "Alumini_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
