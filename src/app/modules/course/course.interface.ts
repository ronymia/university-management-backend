export type IPreRequisiteCourses = {
  courseId: string;
  preRequisiteId?: string;
  isDeleted?: boolean;
};

export type ICourse = {
  title: string;
  code: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  preRequisiteCourses: IPreRequisiteCourses[];
};
