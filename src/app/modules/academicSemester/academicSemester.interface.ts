import { Model } from 'mongoose';

export type Month =
    | 'January'
    | 'February'
    | 'March'
    | 'April'
    | 'May'
    | 'June'
    | 'July'
    | 'August'
    | 'September'
    | 'October'
    | 'November'
    | 'December';

export type IAcademicSemesterTitles = 'Autumn' | 'Summer' | 'Fall';

export type IAcademicSemesterCodes = '01' | '02' | '03';

export type IAcademicSemesterFilters = {
    searchTerm?: string;
    title?: string;
    code?: string;
    year?: string;
    syncId?: string;
};

export type IAcademicSemester = {
    title: IAcademicSemesterTitles;
    year: string;
    code: IAcademicSemesterCodes;
    startMonth: Month;
    endMonth: Month;
    syncId: string;
};

export type AcademicSemesterModel = Model<IAcademicSemester, object>;
