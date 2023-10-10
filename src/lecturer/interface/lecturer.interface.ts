interface LecturerInputData {
  userId: number;
  nickname: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  homepageUrl?: string;
  affiliation?: string;
  introduction: string;
  experience: string;
}

interface LecturerRegionInputData {
  lecturerId: number;
  regionId: number;
}

interface LecturerWebsiteInputData {
  lecturerId: number;
  url: string;
}

interface LecturerDanceGenreInputData {
  lecturerId: number;
  danceCategoryId: number;
  name?: string;
}

export {
  LecturerInputData,
  LecturerRegionInputData,
  LecturerWebsiteInputData,
  LecturerDanceGenreInputData,
};
