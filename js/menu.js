(function () {
  // --- DOM elements
  const utilityBar = document.querySelector(".nav-utility");
  const mainHeader = document.querySelector(".nav-main-header");
  const osbRow = document.querySelector(".nav-osb");
  const bodyEl = document.body;

  // --- Helper: update sticky state based on exact combined height of top sections
  function updateSticky() {
    if (!mainHeader || !osbRow) return;

    // Get actual visible heights (utility might be display:none on mobile -> offsetHeight = 0)
    const utilityHeight = utilityBar ? utilityBar.offsetHeight : 0;
    const mainHeaderHeight = mainHeader.offsetHeight;
    const totalTopHeight = utilityHeight + mainHeaderHeight;

    const scrollY = window.scrollY;
    const shouldStick = scrollY > totalTopHeight;

    if (shouldStick) {
      if (!bodyEl.classList.contains("nav-scrolled")) {
        bodyEl.classList.add("nav-scrolled");
        // Dynamically set padding-top to match OSB row height to prevent content jump
        const osbHeight = osbRow.offsetHeight;
        bodyEl.style.paddingTop = osbHeight + "px";
      } else {
        // Already sticky, but ensure padding matches height on resize
        const osbHeight = osbRow.offsetHeight;
        bodyEl.style.paddingTop = osbHeight + "px";
      }
    } else {
      if (bodyEl.classList.contains("nav-scrolled")) {
        bodyEl.classList.remove("nav-scrolled");
        bodyEl.style.paddingTop = "";
      }
    }
  }

  // --- Debounced resize listener to recalc thresholds & padding
  let resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSticky();
    }, 100);
  }

  // --- Event binding
  window.addEventListener("scroll", updateSticky);
  window.addEventListener("resize", handleResize);
  updateSticky(); // initial check

  // --- Mobile overlay toggle
  const burger = document.getElementById("burgerBtn");
  const overlay = document.getElementById("mobileOverlay");
  const closeBtn = document.getElementById("closeOverlayBtn");
  function openOverlay() {
    overlay.classList.add("open");
    bodyEl.classList.add("menu-open");
  }
  function closeOverlay() {
    overlay.classList.remove("open");
    bodyEl.classList.remove("menu-open");
  }
  if (burger) burger.addEventListener("click", openOverlay);
  if (closeBtn) closeBtn.addEventListener("click", closeOverlay);
  if (overlay)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeOverlay();
    });

  // --- Build mobile data
  const mainNavData = [
    {
      title: "About AUB",
      sub: {
        University: [
          "Overview",
          "History",
          "Mission & Vision",
          "Facts & Figures",
          "Title IX",
        ],
        "Leadership & Media": [
          "AUB Leadership",
          "Office of the President",
          "New York Office",
          "MainGate Magazine",
          "Advancement",
        ],
        "Campus & Heritage": [
          "Campus",
          "Beirut & Lebanon",
          "Accreditation",
          "AUB 150",
        ],
      },
    },
    {
      title: "Academics",
      sub: {
        "Programs & Faculties": [
          "Faculties",
          "Departments & Centers",
          "Majors & Programs",
          "Course Search",
        ],
        "Innovation & Support": [
          "Academic Innovation",
          "Graduate Council",
          "General Education",
          "International Programs",
        ],
        Resources: ["Office of the Provost", "Registrar", "Libraries"],
      },
    },
    {
      title: "Admissions",
      sub: {
        "Apply & Aid": [
          "Admissions",
          "Financial Aid",
          "Tuition Calculator",
          "Visiting Student",
        ],
        Scholarships: ["Scholarships", "LEAD opportunities", "Student Affairs"],
        Pathways: ["Majors", "Graduate Council", "International Programs"],
      },
    },
    {
      title: "Research",
      sub: {
        "Research Enterprise": [
          "Office of Research",
          "Research by Faculty",
          "Research Centers",
          "University Research Board",
        ],
        "Funding & Integrity": [
          "Research Funding",
          "Research Integrity",
          "Human Research / IRB",
        ],
        Opportunities: [
          "Medical Research Volunteer",
          "Undergraduate Research",
          "Research News",
        ],
      },
    },
    {
      title: "Outreach",
      sub: {
        Community: [
          "Community Engagement",
          "Neighborhood Initiative",
          "Nature Conservation",
          "University for Seniors",
        ],
        Institutes: [
          "Issam Fares Institute",
          "iPark",
          "Knowledge to Policy Center",
          "Masri Institute",
        ],
        "Global Impact": [
          "AI Hub",
          "Environment & Sustainable Dev",
          "Global Health Institute",
        ],
      },
    },
    {
      title: "Boldly Campaign",
      sub: {
        Campaign: [
          "Campaign Overview",
          "Impact Stories",
          "Campaign Objectives",
          "Ways to Support",
          "Campaign Progress",
          "Join the Campaign",
        ],
      },
    },
  ];
  const osbNavData = [
    {
      title: "About OSB",
      links: [
        "Meet the Dean",
        "Mission And Vision",
        "About Suliman Saleh Olayan",
        "Advisory Board",
        "Global Recognitions",
        "Governance",
        "Faculty & Staff Resources",
        "OSB 125",
        "Strategic Plan 2029",
      ],
    },
    {
      title: "Academic Programs",
      links: [
        "Undergraduate Program",
        "Specialized Masters",
        "MBA",
        "MBA Online",
        "Executive MBA",
      ],
    },
    { title: "Executive Education", links: null },
    {
      title: "OSB Online",
      links: [
        "Entrepreneurship & Innovation",
        "Trade-Based Crime Certificate",
        "Strategic Branding Diploma",
        "Investment Analysis Diploma",
      ],
    },
    { title: "Faculty", links: null },
    { title: "Research", links: null },
    { title: "News", links: null },
    { title: "OSB Impacts", links: null },
  ];

  function buildMobileMain() {
    const container = document.getElementById("mobileMainNav");
    if (!container) return;
    container.innerHTML = "";
    mainNavData.forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.className = "mobile-nav-item";
      const linkDiv = document.createElement("div");
      linkDiv.className = "mobile-nav-link has-sub";
      linkDiv.innerHTML = `<span>${item.title}</span><span class="chevron-icon"></span>`;
      const submenu = document.createElement("div");
      submenu.className = "mobile-submenu";
      for (let [cat, links] of Object.entries(item.sub)) {
        const catTitle = document.createElement("div");
        catTitle.className = "subcategory-title";
        catTitle.innerText = cat;
        submenu.appendChild(catTitle);
        links.forEach((link) => {
          const a = document.createElement("a");
          a.href = "#";
          a.innerText = link;
          submenu.appendChild(a);
        });
      }
      linkDiv.addEventListener("click", (e) => {
        e.preventDefault();
        linkDiv.classList.toggle("open");
        submenu.classList.toggle("open");
      });
      wrapper.appendChild(linkDiv);
      wrapper.appendChild(submenu);
      container.appendChild(wrapper);
    });
  }
  function buildMobileOsb() {
    const container = document.getElementById("mobileOsbNav");
    if (!container) return;
    container.innerHTML = "";
    osbNavData.forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.className = "mobile-nav-item";
      const linkDiv = document.createElement("div");
      const hasSub = item.links && item.links.length;
      linkDiv.className = hasSub
        ? "mobile-nav-link has-sub"
        : "mobile-nav-link";
      linkDiv.innerHTML = `<span>${item.title}</span>${hasSub ? '<span class="chevron-icon"></span>' : ""}`;
      if (hasSub) {
        const submenu = document.createElement("div");
        submenu.className = "mobile-submenu";
        item.links.forEach((link) => {
          const a = document.createElement("a");
          a.href = "#";
          a.innerText = link;
          submenu.appendChild(a);
        });
        linkDiv.addEventListener("click", (e) => {
          e.preventDefault();
          linkDiv.classList.toggle("open");
          submenu.classList.toggle("open");
        });
        wrapper.appendChild(linkDiv);
        wrapper.appendChild(submenu);
      } else {
        wrapper.appendChild(linkDiv);
      }
      container.appendChild(wrapper);
    });
  }
  function buildUtilityGrid() {
    const gridContainer = document.getElementById("mobileUtilityGrid");
    if (!gridContainer) return;
    const links = [
      { href: "/Pages/AZ.aspx", label: "A–Z" },
      { href: "/Search/Pages/People.aspx", label: "Find People" },
      { href: "https://aubmc.org.lb/", label: "AUBMC" },
      { href: "/libraries", label: "Libraries" },
      { href: "/Employment", label: "Jobs" },
      { href: "http://alumni.aub.edu.lb/", label: "Alumni" },
      { href: "https://online.aub.edu.lb", label: "AUB Online" },
      { href: "https://www.aubmed.ac.cy/", label: "Mediterraneo" },
      { href: "https://myaubhealth.aubmc.org.lb/", label: "Telehealth" },
      {
        href: "/advancement/Development/Pages/HowToMakeAGift.aspx",
        label: "Give",
      },
    ];
    gridContainer.innerHTML = links
      .map((l) => `<a href="${l.href}">${l.label}</a>`)
      .join("");
  }
  buildMobileMain();
  buildMobileOsb();
  buildUtilityGrid();
})();
