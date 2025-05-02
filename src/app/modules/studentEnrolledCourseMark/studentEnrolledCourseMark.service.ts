import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

// const createStudentEnrolledCourseMark = async (req: Request): Promise<any> => {
//   const result = await HttpService.post('/student-enrolled-course-marks', req.body, {
//     headers: {
//       Authorization: req.headers.authorization
//     }
//   });

//   // RETURN
//   return result;
// };

const getAllStudentEnrolledCourseMarks = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/student-enrolled-course-marks`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

const getSingleStudentEnrolledCourseMark = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/student-enrolled-course-marks/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

const updateStudentEnrolledCourseMark = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/student-enrolled-course-marks/update-mark`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

const updateStudentEnrolledCourseFinalMark = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(
    `/student-enrolled-course-marks/update-final-mark`,
    req.body,
    {
      params: req.query,
      headers: {
        Authorization: req.headers.authorization
      }
    }
  );

  // RETURN
  return result;
};

// const deleteStudentEnrolledCourseMark = async (req: Request): Promise<any> => {
//   const result = await HttpService.delete(`/student-enrolled-course-marks/${req.params.id}`, {
//     params: req.query,
//     headers: {
//       Authorization: req.headers.authorization
//     }
//   });

//   // RETURN
//   return result;
// };

// EXPORT SERVICES
export const StudentEnrolledCourseMarkServices = {
  updateStudentEnrolledCourseFinalMark,
  updateStudentEnrolledCourseMark,
  getSingleStudentEnrolledCourseMark,
  getAllStudentEnrolledCourseMarks
};
