interface LecturerCreateInput {
  userId: number;
  nickname: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  homepageUrl?: string;
  affiliation?: string;
  introduction: string;
  experience: string;
}

interface LecturerInputData {
  lecturerId: number;
  regionId: number;
}
export { LecturerCreateInput, LecturerInputData };
