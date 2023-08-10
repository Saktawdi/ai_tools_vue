import html2canvas from 'html2canvas';
import PptxGenJS from 'pptxgenjs';

// 加载生成的 HTML 并截图
async function generateScreenshots(html) {
  const container = document.createElement('html');
  container.innerHTML = html;
  // 添加样式到 container
  const style = document.createElement('style');
  style.textContent = 'body { margin: 0; } .marpit img {max-height: 256px;max-width: 256px;}';
  container.querySelector('head').appendChild(style);

  //在新标签页展示 container
  const newTab = window.open();
  newTab.document.body.appendChild(container);

  const screenshots = [];
  const slides = container.querySelectorAll('section'); // 根据具体情况选择合适的选择器
  for (const slide of slides) {
    const screenshot = await html2canvas(slide);
    screenshots.push(screenshot);
  }
  return screenshots;
}

// 创建 PPTX 文件并插入截图
function generatePPTX(screenshots) {
  const pptx = new PptxGenJS();
  for (const screenshot of screenshots) {
    const slide = pptx.addSlide();
    slide.addImage({
      data: screenshot.toDataURL('image/png'),
      x: 0,
      y: 0,
      w: '100%',
      h: '100%'
    });
  }
  return pptx;
}

// 调用上述函数进行整个过程
export default async function generatePPTXFromHTML(html) {
  const screenshots = await generateScreenshots(html);
  const pptx = generatePPTX(screenshots);
  return new Promise((resolve, reject) => {
    pptx.writeFile({
        fileName: 'saktaMdPPT.pptx'
      })
      .then(fileName => {
        resolve({
          status: true,
          msg: fileName
        });
      })
      .catch(error => {
        reject({
          status: false,
          msg: error
        });
      });

  })
}
