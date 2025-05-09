import { z } from 'zod';

//
const createStudentZodSchema = z.object({
  password: z.string().optional(),
  student: z.object({
    name: z.object({
      firstName: z.string({
        required_error: 'First Name is required'
      }),
      middleName: z.string().optional(),
      lastName: z.string({ required_error: 'Last Name is required' })
    }),
    gender: z.string().optional(),
    dateOfBirth: z.string().optional(),
    email: z.string({ required_error: 'Email is required' }),
    bloodGroup: z.string().optional(),
    contactNo: z.string({ required_error: 'Contact is required' }),
    emergencyContactNo: z.string({
      required_error: 'Emergency Contact is required'
    }),
    presentAddress: z.string({
      required_error: 'Present Address is required'
    }),
    permanentAddress: z.string({
      required_error: 'Permanent Address is required'
    }),
    guardian: z.object({
      fatherName: z.string({
        required_error: 'Father Name is required'
      }),
      fatherOccupation: z.string({
        required_error: 'FatherOccupation is required'
      }),
      fatherContactNo: z.string({
        required_error: 'Father Contact Number is required'
      }),
      motherName: z.string({
        required_error: 'Mother Name is required'
      }),
      motherOccupation: z.string({
        required_error: 'MotherOccupation is required'
      }),
      motherContactNo: z.string({
        required_error: 'Mother Contact Number is required'
      }),
      address: z.string({
        required_error: 'Address is required'
      })
    }),
    localGuardian: z.object({
      name: z.string({
        required_error: 'Local Guardian Name is required'
      }),
      occupation: z.string({
        required_error: 'Local Guardian Occupation is required'
      }),
      contactNo: z.string({
        required_error: 'Local Guardian Contact Number is required'
      }),
      address: z.string({
        required_error: 'Local Guardian Address is required'
      })
    }),
    profileImage: z.string().optional(),
    academicSemester: z.string({
      required_error: 'Academic Semester is required'
    }),
    academicDepartment: z.string({
      required_error: 'Academic Department is required'
    }),
    academicFaculty: z.string({
      required_error: 'Academic Faculty is required'
    })
  })
});

// Faculty
const createFacultyZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    faculty: z.object({
      name: z.object({
        firstName: z.string({
          required_error: 'First Name is required'
        }),
        middleName: z.string().optional(),
        lastName: z.string({ required_error: 'Last Name is required' })
      }),
      gender: z.string().optional(),
      dateOfBirth: z.string().optional(),
      email: z.string({ required_error: 'Email is required' }),
      bloodGroup: z.string().optional(),
      contactNo: z.string({ required_error: 'Contact is required' }),
      emergencyContactNo: z.string({
        required_error: 'Emergency Contact is required'
      }),
      presentAddress: z.string({
        required_error: 'Present Address is required'
      }),
      permanentAddress: z.string({
        required_error: 'Permanent Address is required'
      }),
      designation: z.string({
        required_error: 'Designation is required'
      }),
      profileImage: z.string().optional(),
      academicDepartment: z.string({
        required_error: 'Academic Department is required'
      }),
      academicFaculty: z.string({
        required_error: 'Academic Faculty is required'
      })
    })
  })
});

const createAdminZodSchema = z.object({
  password: z.string().optional(),

  admin: z.object({
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required'
      }),
      lastName: z.string({
        required_error: 'Last name is required'
      }),
      middleName: z.string().optional()
    }),

    email: z
      .string({
        required_error: 'Email is required'
      })
      .email(),

    contactNo: z.string({
      required_error: 'Contact number is required'
    }),

    emergencyContactNo: z.string({
      required_error: 'Emergency contact number is required'
    }),

    dateOfBirth: z.string({
      required_error: 'Date of birth is required'
    }),

    gender: z.string({
      required_error: 'Gender is required'
    }),

    bloodGroup: z.string({
      required_error: 'Blood group is required'
    }),

    presentAddress: z.string({
      required_error: 'Present address is required'
    }),

    permanentAddress: z.string({
      required_error: 'Permanent address is required'
    }),

    managementDepartment: z.string({
      required_error: 'Management department is required'
    }),

    designation: z.string({
      required_error: 'Designation is required'
    }),

    profileImage: z.string().optional()
  })
});

export const UserValidation = {
  createStudentZodSchema,
  createFacultyZodSchema,
  createAdminZodSchema
};
