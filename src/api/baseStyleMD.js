export const  baseStyleMD = [
`---
theme: default
_class: lead
paginate: true
auto-scaling: true
backgroundImage: linear-gradient(-225deg, #D4FFEC 0%, #57F2CC 48%, #4596FB 100%);
---
`,
`---
theme: gaia
_class: lead
paginate: true
backgroundImage: linear-gradient(to right, #acb6e5 , #86fde8 )
---
`,
`---
theme: uncover
_class: lead
paginate: true
backgroundImage: linear-gradient(-225deg, #B6CEE8 0%, #F578DC 100%);
---
`,
`---
theme: sakta
paginate: true
style: |
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---
`
];

export const themeDatas = [
    { id:0,title: '默认', image: 'https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/66262e3593222669ec93839629adb67.png' },
    { id:1,title: '盖亚', image: 'https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/94eb26a3133f4eb719d76492cb1aa10.png' },
    { id:2,title: '现代', image: 'https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/d9b4ac6308e4db3b76c9541d5591654.png' },
    { id:3,title: 'sakta', image: 'https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/1692028460013.jpg' },
];

export const themeCSS = [{
    theme:"sakta",
    data:`/* @theme sakta */
    @charset "UTF-8";
    @import 'uncover';
    @import url('https://fonts.googleapis.com/css?family=Lato:400,900|Roboto+Mono:400,700&display=swap');
    @import '~highlight.js/styles/sunburst';
    section {
       font-size: 25px;
       padding: 50px;
       text-align: left;
       font-family:Arial, Helvetica, sans-serif;
       background: url('https://th.bing.com/th/id/R.3a2f2859337606e2e76f433ada8cf1b8?rik=VZof6FaCzzM0Yw&riu=http%3a%2f%2fimg.pptjia.com%2fimage%2f20190312%2fe4174af697f50bc44f5136745d629d4b.jpg&ehk=62dccZ4bHfyCy4K%2bu%2f4DTG2jqXKDVV7ea6ygWAQgBTY%3d&risl=&pid=ImgRaw&r=0');
      }
     
      h1 {
       text-align:center;
       color: black;
       margin-top: 50px;
       margin-bottom: 0px;
       font-size:72px;
      }
    
      h2 {
        text-align:center;
        margin-top: 0px;
        margin-bottom: 50px;
        color: white;
        font-size:60px;
      }
    
      h3 {
        color: rgb(60, 112, 198);
        font-size:36px;
        text-align:left;
        margin-top: 5px;
        margin-bottom: 5px;
      }
    
      h4 {
        font-size:30px;
        text-align:left;
        margin-top: 5px;
        margin-bottom: 5px;
      }
    
      h6 {
        text-align:center;
        font-size:30px;
        text-align:left;
        margin-top: 10px;
        margin-bottom: 10px;
      }
    
      header {
        left: 50px;
        right: 50px;
        top: 10px;
        height: 50px;
        background-image: url("https://cdn.jsdelivr.net/gh/Saktawdi/my-images@main/img/logo2.png"); 
        background-position: right top;
        background-repeat: no-repeat;
        background-size: 200px;
        text-align:left;
        color: rgb(60, 112, 198);
        font-weight: bold;
        font-size:36px;
      }

      svg[data-marpit-svg] {
        display: block;
        width: 100vw;
        height: 100vh;
      }
    `
},]

