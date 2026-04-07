export type BannersDB = {
  data: BannerDocument[]
};

export type BannerDocument = {
  id: string;
  title: string;
  image: string;
};

export type CreateBannerDto = {
  title: string;
  image: string;
};
