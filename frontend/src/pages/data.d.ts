export type Member = {
  avatar: string;
  name: string;
  id: string;
};

export interface Params {
  count: number;
}
export interface BookMetaDataType {
  author: string;
  create_time: string;
  description: string;
  done_dates: string;
  id: number;
  md5: string;
  name: string;
  publisher: string;
  size: number;
  star: number;
  tags: string;
  uuid: string;
  coll_uuids: string;
  // 这个参数由客户端定义，与接口没有任何关系，目的是为了方便页面显示
  coll_names?: string;
}

export interface CollectionDataType {
  id: number;
  uuid: string;
  name: string;
  description: string;
  item_uuids: string;
  tags: string;
  star: number;
  create_time: string;
}

export interface ClippingDataType {
  uuid: string;
  book_name: string;
  author: string;
  content: string;
  addDate: string;
  tags: string;
  star: number;
  highlights: string[];
  coll_uuids: string;
  create_time: string;
}

// 摘抄的集合
export interface ClippingCollectionDataType {
  id: number;
  uuid: string;
  name: string;
  clipping_uuids: string;
  tag: string;
  star: number;
  create_time: string;
}

export interface CommentDataType {
  uuid: string;
  related_uuid: string;
  content: string;
  create_time: string;
}

export interface BookToClippingBookType {
  book_meta_uuid: string;
  clipping_book_name: string;
  clipping_count: int;
  status: int;
  create_time: string;
}

export interface VocabRelatedBookType {
  key: string;
  title: string;
  author: int;
  status: int;
  create_time: string;
}

export interface VocabWordsType {
  book_key: string;
  word: string;
  usage: VocabWordUsageItemType[];
  create_time: string;
}

export interface VocabWordUsageItemType {
  book_key: string;
  usage: string;
  timestamp: string;
}
