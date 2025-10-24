//SDK利用準備
import type { MicroCMSQueries } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";


const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});


//型定義
export type Blog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
  author:string;
  photocollection?: string[];
};
export type BlogResponse = {
  totalCount: number;
  offset: number;
  limit: number;
  contents: Blog[];
};
export type Image = {
  id: string;
  photo: {
    url: string;
  };
  description: string;
  tagname?: Array<{
    id: string;
    name: string;
  }>;
};
export type ImageResponse = {
  totalCount: number;
  offset: number;
  limit: number;
  contents: Image[];
};
export type TagResponse = {
  contents: { id: string; name: string }[];
};
// --------------------------------------------------新加入的
export interface Photo {
  id: string;
  photo: { url: string };  // 假设 `photo` 是一个包含 `url` 属性的对象
  description: string;
}




//APIの呼び出し
export const getBlogs = async (queries?: MicroCMSQueries) => {
  return await client.get<BlogResponse>({ endpoint: "blogs", queries });
};
export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  return await client.getListDetail<Blog>({
    endpoint: "blogs",
    contentId,
    queries: {
      ...queries,
      fields: ["id", "title", "publishedAt", "content", "author", "photocollection"], // 确保 photocolletion 被包含
    },
  });
};



export const getImages = async (queries?: MicroCMSQueries) => {
  try {
    // 设置分页请求以加载所有图片（一次最大限制为 100）
    let allImages: any[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await client.get<ImageResponse>({
        endpoint: "gallery",
        queries: { ...queries, limit, offset },
      });

      allImages = allImages.concat(
        response.contents.map((photo) => ({
          ...photo,
          tagname: photo.tagname?.map((tag) => tag.name) || [], // 提取 tagname 数组中的每个 name
        }))
      );

      if (response.contents.length < limit) break; // 当返回的数据少于限制时，说明已经加载完
      offset += limit;
    }

    return { contents: allImages };
  } catch (error) {
    console.error("Failed to fetch images:", error);
    throw error;
  }
};

export async function getPhotos(): Promise<Photo[]> {
  try {
    // 设置分页请求以加载所有图片
    let allPhotos: Photo[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await client.get({
        endpoint: "gallery",
        queries: { limit, offset, fields: ["id", "photo", "description"] },
      });

      allPhotos = allPhotos.concat(response.contents as Photo[]);

      if (response.contents.length < limit) break; // 数据少于限制值时结束循环
      offset += limit;
    }

    return allPhotos;
  } catch (error) {
    console.error("Failed to fetch photos:", error);
    throw error;
  }
}

function adjustPhotoContainerWidth() {
  const photoContainer = document.querySelector(".photo-container");
  const photoBoxes = document.querySelectorAll(".photo-box-outside");

  if (photoContainer && photoBoxes.length > 0) {
    // 计算总宽度，包括间距
    const totalWidth = Array.from(photoBoxes).reduce(
      (acc, box) => acc + box.offsetWidth + 20, // 20 是 CSS 中的 gap
      0
    );
    photoContainer.style.width = `${totalWidth}px`;
  } else {
    console.warn("photo-container 或 photo-box-outside 不存在！");
  }
}

// 确保仅在客户端运行调整逻辑
if (typeof window !== "undefined") {
  window.addEventListener("load", adjustPhotoContainerWidth);
  window.addEventListener("resize", adjustPhotoContainerWidth);
}














export async function getTagsWithPhotos(queries?: MicroCMSQueries) {
  try {
    // 获取所有的标签
    const tagResponse = await client.get<TagResponse>({ endpoint: "tag", queries });
    
    // 获取所有的照片，并包含 tagname 字段
    const galleryResponse = await client.get<ImageResponse>({ 
      endpoint: "gallery", 
      queries: { fields: ["id", "photo", "description", "tagname"] } 
    });
    
    // 将标签和照片关联
    const tagsWithPhotos = tagResponse.contents.map(tag => {
      const associatedPhotos = galleryResponse.contents.filter(photo => {
        // 确保 tagname 是数组，检查每个 tagname 的 name 是否匹配
        return photo.tagname?.some(tagRef => tagRef.name === tag.name);
      });

      return {
        ...tag,
        photos: associatedPhotos,
      };
    });

    return tagsWithPhotos;
  } catch (error) {
    console.error("Failed to fetch tags with photos:", error);
    throw error;
  }
}