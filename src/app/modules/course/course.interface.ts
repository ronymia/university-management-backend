export type IPreRequisite = {
  courseId: string;
  preRequisiteId?: string;
};

export type ICourse = {
  title: string;
  code: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  preRequisiteCourses: IPreRequisite[];
};
