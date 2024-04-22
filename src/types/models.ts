import type { UserRole } from "@/types/enums";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResponseData<T> {
  code: number;
  message: string;
  data: T;
}

export interface LoginResponse<T> extends ResponseData<T> {
  access_token: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: number;
  dateOfBirth: string;
  phoneNumber: string;
  avatar: string;
  singerId: number;
  packaged: Package;
  role: UserRole;
}

export interface Singer extends User {
  id: number;
  stageName: string;
  identityCardPhoto: string;
  identityNumber: number;
  debutTime: string;
  type: number;
  description: string;
  verifyBy: number;
  verify: string;
  numberFollow: number;
  lstSongs: [];
  lstAlbums: [];
  user: User;
  role: UserRole;
}

export interface Song {
  id: number;
  name: string;
  link: string;
  thumbnail: string;
  lyric: string;
  singerId: number[];
  countryId: number;
  author: string;
  stageName: string;
  categoryId: number[];
  draftSongId: number;
  listComment: Comment[];
  singers: Singers[];
  view: number;
}

export interface DraftSong {
  id: number;
  name: string;
  link: string;
  thumbnail: string;
  lyric: string;
  singerId: number[];
  countryId: number;
  categoryId: number[];
  author: string;
  stageName: string;
}

export interface Singers {
  id: number;
  stageName: number;
}

export interface Album {
  id: number;
  name: string;
  singer: string;
  thumbnail: string;
  description: string;
  singerId: number;
  createdAt: string;
}

export interface AlbumSong {
  songId: number[];
  albumId: number;
}

export interface LikeSong extends Song {
  isLike: boolean;
}

export interface UserProfile extends User {
  amountSongLike: number;
  songLike: number[];
  singerFollow: number[];
  starPoint: number;
  packaged: Package;
}

export interface Package {
  id: number;
  name: string;
  price: number;
  month: number;
  description: string;
  quantityFavorite: number;
}

export interface UserPackage {
  userId: number;
  packageId: number;
}

export interface StarPoint {
  point: number;
  userId: number;
}

export interface Category {
  id: number;
  name: string;
  banner: string;
  description: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  note: string;
  createdAt: string;
}

export interface Country {
  id: number;
  name: string;
  image: string;
}

export interface ResponsiveImage {
  sm: string;
  lg: string;
  xl: string;
}

export interface ReportRequest {
  startTime?: string;
  endTime?: string;
  size?: string;
}

export interface ReportStarPointRequest {
  year?: string;
}

export interface ReportByTimeResponse {
  date: string;
  count: number;
}

export interface ReportByCompetition {
  competition: string;
  count: number;
}

export interface Comment {
  userId: number;
  id: number;
  commentAt: string;
  message: string;
  commentBy: string;
  avatar: string;
}
