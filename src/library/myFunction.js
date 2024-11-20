// export const myFunction = () => {
//     // 函数内容
//     console.log("image-rearrange&tag-fliter");
// };

// const images = [
//     { src: 'image1.jpg', description: '描述 1', tags: ['tag1'] },
//     { src: 'image2.jpg', description: '描述 2', tags: ['tag2'] },
//     { src: 'image3.jpg', description: '描述 3', tags: ['tag1', 'tag3'] },
//     // 添加更多图片
// ];

// // 随机排序函数
// function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
// }

// // 渲染图片函数
// function renderImages(filterTag = null) {
//     const container = document.querySelector('.image-container');
//     container.innerHTML = ''; // 清空容器

//     const shuffledImages = shuffleArray(images); // 随机排序
//     const filteredImages = filterTag ? shuffledImages.filter(img => img.tags.includes(filterTag)) : shuffledImages;

//     filteredImages.forEach(image => {
//         const imageItem = document.createElement('div');
//         imageItem.className = 'image-item';
//         imageItem.innerHTML = `
//             <img src="${image.src}" alt="${image.description}">
//             <div class="image-description">${image.description}</div>
//         `;
//         container.appendChild(imageItem);
//     });
// }

// // 标签过滤函数
// function filterByTag(tag) {
//     renderImages(tag);
// }

// // 重置过滤
// function resetFilter() {
//     renderImages();
// }

// // 初始化页面
// renderImages();
