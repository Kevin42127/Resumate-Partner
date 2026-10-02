import { resumeSchema, type Resume, type ResumeLocale } from "./schema";

const zh = {
  basics: {
    name: "王小明",
    title: "資深前端工程師",
    phone: "0912-345-678",
    email: "ming.wang@example.com",
    location: "台北市",
    links: [
      { id: "l1", label: "GitHub", url: "https://github.com/ming-wang" },
      { id: "l2", label: "LinkedIn", url: "https://linkedin.com/in/ming-wang" },
      { id: "l3", label: "個人作品集", url: "https://ming-wang.dev" },
    ],
    desiredPosition: "前端技術主管 / Tech Lead",
    desiredSalary: "面議",
  },
  work: [
    {
      id: "w1",
      company: "ABC 科技",
      position: "資深前端工程師",
      location: "台北",
      start: "2022-03",
      current: true,
      description:
        "主導設計系統重構，元件重用率提升 40%，並對外發布為公司第一個開源專案\n導入 Vitest 與 Playwright，測試覆蓋率從 20% 提升到 75%，有效降低線上事故\n帶領 4 人前端團隊，建立 Code Review、技術分享與 On-call 輪值制度\n與 PM、設計師緊密協作推動 Design Token 標準化，讓設計稿到實作的落差減少 60%\n優化 CI/CD pipeline，部署時間從 18 分鐘縮短至 6 分鐘",
    },
    {
      id: "w2",
      company: "XYZ 電商",
      position: "前端工程師",
      location: "新北",
      start: "2020-07",
      end: "2022-02",
      description:
        "開發會員中心與結帳流程，轉換率提升 12%\n將首頁 LCP 從 4.1 秒優化至 1.8 秒，Lighthouse 效能分數達 92\n獨立完成行動版網站改版，首次瀏覽跳出率降低 18%\n導入 Sentry 前端監控，MTTR 縮短 35%",
    },
    {
      id: "w3",
      company: "DEF 新創",
      position: "前端工程師（實習轉正職）",
      location: "台北",
      start: "2019-07",
      end: "2020-06",
      description:
        "以 Vue 2 開發後台管理系統，服務超過 200 名內部使用者\n撰寫技術文件並主導前後端 API 協作規範\n從實習生晉升為正職工程師，提前三個月達成轉正績效指標",
    },
  ],
  education: [
    {
      id: "e1",
      school: "國立台灣大學",
      field: "資訊工程學系",
      degree: "學士",
      start: "2016-09",
      end: "2020-06",
      description:
        "畢業專題：基於機器學習的程式碼品質預測系統，獲系上佳作\n擔任資工系學生會學術長，舉辦每學期技術讀書會",
    },
    {
      id: "e2",
      school: "國立台灣科技大學",
      field: "資訊管理學系（輔系）",
      degree: "輔系",
      start: "2017-09",
      end: "2020-06",
      description: "",
    },
  ],
  projects: [
    {
      id: "p1",
      name: "開源履歷產生器",
      role: "作者",
      link: "https://github.com/ming-wang/resume",
      start: "2023-05",
      end: "2023-09",
      description:
        "以 Next.js 與 docx 打造可下載 Word 的履歷工具，支援中英雙語\nGitHub 獲得 800+ stars，登上 Trending 榜單首頁\n單元測試覆蓋率達 90%，配有完整 Playwright E2E 測試套件",
    },
    {
      id: "p2",
      name: "即時協作白板",
      role: "前端開發",
      link: "https://github.com/ming-wang/collab-board",
      start: "2022-11",
      end: "2023-02",
      description:
        "以 React + Yjs 實作多人即時協作的繪圖白板\n使用 WebSocket 延遲控制在 60ms 以內，支援 1,000+ 並發用戶\n獲選 2023 年黑客松最佳技術獎",
    },
    {
      id: "p3",
      name: "前端效能監控儀表板",
      role: "獨立開發",
      link: "",
      start: "2021-04",
      end: "2021-08",
      description:
        "串接 Google Analytics 4 API，視覺化呈現 Core Web Vitals 趨勢\n提供自動化週報，協助團隊每週快速掌握效能退化狀況",
    },
  ],
  skills: [
    { id: "s1", group: "前端框架與語言", items: "TypeScript, React, Next.js, Vue 3, Tailwind CSS, CSS Modules" },
    { id: "s2", group: "測試與工程實踐", items: "Vitest, Playwright, Jest, Storybook, CI/CD, Docker, Git" },
    { id: "s3", group: "後端與雲端", items: "Node.js, Express, PostgreSQL, Prisma, AWS (EC2, S3, CloudFront), Vercel" },
  ],
  certificates: [
    { id: "c1", name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", date: "2023-11" },
    { id: "c2", name: "CKAD（Certified Kubernetes Application Developer）", issuer: "Linux Foundation", date: "2024-02" },
    { id: "c3", name: "Google Analytics 認證", issuer: "Google", date: "2022-06" },
  ],
  languages: [
    { id: "g1", name: "中文", level: "母語" },
    { id: "g2", name: "英文", level: "TOEIC 885・具備閱讀技術文件及英文會議能力" },
    { id: "g3", name: "日文", level: "JLPT N3・基礎溝通" },
  ],
  autobiography:
    "我是一位熱愛打造好用產品的前端工程師，擅長把複雜需求拆解成清楚、可維護的介面。過去五年在電商與 SaaS 產業累積了大型專案經驗，從效能優化到設計系統，都有第一手的實戰心得。\n我重視工程品質與團隊合作，樂於帶領小型前端團隊建立開發流程與品質標準，也喜歡透過開源貢獻與技術分享和社群交流。期待在下一份工作中，能在更有挑戰性的產品環境中持續成長，與優秀的夥伴一起創造更好的使用者體驗。",
  meta: { resumeLocale: "zh-TW" },
};

const en = {
  basics: {
    name: "Ming Wang",
    title: "Senior Frontend Engineer",
    phone: "+886 912-345-678",
    email: "ming.wang@example.com",
    location: "Taipei, Taiwan",
    links: [
      { id: "l1", label: "GitHub", url: "https://github.com/ming-wang" },
      { id: "l2", label: "LinkedIn", url: "https://linkedin.com/in/ming-wang" },
      { id: "l3", label: "Portfolio", url: "https://ming-wang.dev" },
    ],
    desiredPosition: "Frontend Tech Lead",
    desiredSalary: "Negotiable",
  },
  work: [
    {
      id: "w1",
      company: "ABC Tech",
      position: "Senior Frontend Engineer",
      location: "Taipei",
      start: "2022-03",
      current: true,
      description:
        "Spearheaded design system rebuild, increasing component reuse by 40% and launching as the company's first open-source project\nIntroduced Vitest and Playwright, raising test coverage from 20% to 75% and reducing production incidents\nManaged a 4-person frontend team with code review, weekly tech talks, and on-call rotations\nCollaborated with PMs and designers to standardize Design Tokens, cutting design-to-code discrepancy by 60%\nOptimized CI/CD pipeline, reducing deployment time from 18 minutes to 6 minutes",
    },
    {
      id: "w2",
      company: "XYZ Commerce",
      position: "Frontend Engineer",
      location: "New Taipei",
      start: "2020-07",
      end: "2022-02",
      description:
        "Built the member center and checkout flow, lifting conversion rate by 12%\nCut homepage LCP from 4.1s to 1.8s, achieving a Lighthouse performance score of 92\nOwned the mobile redesign independently, reducing bounce rate by 18%\nSet up frontend monitoring with Sentry, shortening MTTR by 35%",
    },
    {
      id: "w3",
      company: "DEF Startup",
      position: "Frontend Engineer (Intern → Full-time)",
      location: "Taipei",
      start: "2019-07",
      end: "2020-06",
      description:
        "Developed an admin dashboard with Vue 2, serving 200+ internal users\nAuthored technical documentation and defined frontend–backend API collaboration standards\nPromoted to full-time three months ahead of schedule",
    },
  ],
  education: [
    {
      id: "e1",
      school: "National Taiwan University",
      field: "Computer Science and Information Engineering",
      degree: "B.S.",
      start: "2016-09",
      end: "2020-06",
      description:
        "Capstone: ML-based code quality prediction system, received departmental honorable mention\nServed as Academic Director of the CS Student Association",
    },
    {
      id: "e2",
      school: "National Taiwan University of Science and Technology",
      field: "Information Management (Minor)",
      degree: "Minor",
      start: "2017-09",
      end: "2020-06",
      description: "",
    },
  ],
  projects: [
    {
      id: "p1",
      name: "Open-source Resume Builder",
      role: "Author",
      link: "https://github.com/ming-wang/resume",
      start: "2023-05",
      end: "2023-09",
      description:
        "Built a bilingual resume tool with Next.js and docx that exports editable Word files\nEarned 800+ GitHub stars and reached the front page of GitHub Trending\nAchieved 90%+ unit test coverage with Vitest and Playwright",
    },
    {
      id: "p2",
      name: "Real-time Collaborative Whiteboard",
      role: "Frontend Developer",
      link: "https://github.com/ming-wang/collab-board",
      start: "2022-11",
      end: "2023-02",
      description:
        "Built a multiplayer drawing canvas using React and Yjs\nKept latency under 60ms via WebSocket, supporting 1,000+ concurrent users\nWon Best Technical Award at 2023 Hackathon",
    },
    {
      id: "p3",
      name: "Frontend Performance Dashboard",
      role: "Solo Developer",
      link: "",
      start: "2021-04",
      end: "2021-08",
      description:
        "Integrated Google Analytics 4 API to visualize Core Web Vitals trends\nGenerated automated weekly reports to help the team spot performance regressions",
    },
  ],
  skills: [
    { id: "s1", group: "Frontend", items: "TypeScript, React, Next.js, Vue 3, Tailwind CSS, CSS Modules" },
    { id: "s2", group: "Testing & Engineering", items: "Vitest, Playwright, Jest, Storybook, CI/CD, Docker, Git" },
    { id: "s3", group: "Backend & Cloud", items: "Node.js, Express, PostgreSQL, Prisma, AWS (EC2, S3, CloudFront), Vercel" },
  ],
  certificates: [
    { id: "c1", name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", date: "2023-11" },
    { id: "c2", name: "CKAD – Certified Kubernetes Application Developer", issuer: "Linux Foundation", date: "2024-02" },
    { id: "c3", name: "Google Analytics Certification", issuer: "Google", date: "2022-06" },
  ],
  languages: [
    { id: "g1", name: "Mandarin", level: "Native" },
    { id: "g2", name: "English", level: "Professional – TOEIC 885, comfortable in technical meetings" },
    { id: "g3", name: "Japanese", level: "JLPT N3 – basic conversational ability" },
  ],
  autobiography:
    "I am a frontend engineer passionate about building products that people actually enjoy using. Over the past five years I have tackled challenges across e-commerce and SaaS—from performance tuning to design systems—gaining hands-on experience at every layer of the frontend stack.\nI value engineering quality and team collaboration, and I enjoy mentoring teammates and contributing to the open-source community. I am looking forward to joining a high-impact product team where I can keep growing alongside talented people.",
  meta: { resumeLocale: "en" },
};

export function getSampleResume(locale: ResumeLocale): Resume {
  return resumeSchema.parse(locale === "en" ? en : zh);
}
