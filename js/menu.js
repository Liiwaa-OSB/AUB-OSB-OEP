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

  // ========================
  // MOBILE MENU DATA (UPDATED)
  // Exactly matching the HTML structure and href links
  // ========================

  // Main navigation (desktop mega menu) data with real URLs
  const mainNavData = [
    {
      title: "About AUB",
      sub: [
        {
          category: "About AUB",
          links: [
            { text: "Overview", href: "/AboutUs/Pages/default.aspx" },
            { text: "History", href: "/aboutus/Pages/history.aspx" },
            { text: "Mission and Vision", href: "/aboutus/Pages/mission.aspx" },
            { text: "Facts and Figures", href: "/aboutus/Pages/facts.aspx" },
            { text: "Title IX", href: "/President/oeo-titleix" },
          ],
        },
        {
          category: "Leadership & Media",
          links: [
            { text: "AUB Leadership", href: "/AboutUs/Pages/leadership.aspx" },
            { text: "Office of the President", href: "/president" },
            { text: "New York Office", href: "/nyo" },
            { text: "The MainGate Magazine", href: "/maingate" },
            { text: "Office of Advancement", href: "/advancement" },
          ],
        },
        {
          category: "Campus & Heritage",
          links: [
            { text: "Campus", href: "/aboutus/Pages/campus.aspx" },
            {
              text: "About Beirut and Lebanon",
              href: "/aboutus/Pages/beirut-lb.aspx",
            },
            { text: "Accreditation", href: "/accreditation" },
            { text: "AUB 150", href: "https://150.aub.edu.lb/", external: true },
          ],
        },
      ],
    },
    {
      title: "Academics",
      sub: [
        {
          category: "Programs & Faculties",
          links: [
            { text: "Faculties", href: "/academics/Pages/faculties.aspx" },
            { text: "Departments and Centers", href: "/Pages/AZ.aspx" },
            {
              text: "Majors and Programs",
              href: "/academics/pages/majors_programs.aspx",
            },
            {
              text: "Search for a Course",
              href: "https://www-banner.aub.edu.lb/pls/weba/bwckctlg.p_disp_dyn_ctlg",
              external: true,
            },
          ],
        },
        {
          category: "Innovation & Support",
          links: [
            {
              text: "Institute for Academic Innovation and Development",
              href: "/theinstitute",
            },
            { text: "Graduate Council", href: "/graduatecouncil" },
            {
              text: "General Education Program",
              href: "/generaleducation",
            },
            {
              text: "Office of International Programs",
              href: "/oip",
            },
          ],
        },
        {
          category: "Resources",
          links: [
            { text: "Office of the Provost", href: "/provost" },
            { text: "Office of the Registrar", href: "/registrar" },
            { text: "Libraries", href: "/libraries" },
          ],
        },
      ],
    },
    {
      title: "Admissions",
      sub: [
        {
          category: "Apply & Aid",
          links: [
            { text: "Admissions", href: "/admissions" },
            { text: "Financial Aid", href: "/faid" },
            {
              text: "Tuition and Fees Calculator",
              href: "http://www.aub.edu.lb/admissions/Pages/TC/index.html",
              external: true,
            },
            {
              text: "Visiting Student",
              href: "https://www.aub.edu.lb/admissions/applications/Pages/SpecialVisiting.aspx",
              external: true,
            },
          ],
        },
        {
          category: "Scholarships",
          links: [
            { text: "Scholarships", href: "/faid/Pages/Scholarships.aspx" },
            {
              text: "LEAD scholarship opportunities",
              href: "/lead",
            },
            { text: "Office of Student Affairs", href: "/sao" },
          ],
        },
        {
          category: "Pathways",
          links: [
            {
              text: "Majors and Programs",
              href: "/academics/pages/majors_programs.aspx",
            },
            { text: "Graduate Council", href: "/graduatecouncil" },
            { text: "Office of International Programs", href: "/oip" },
          ],
        },
      ],
    },
    {
      title: "Research",
      sub: [
        {
          category: "Research Enterprise",
          links: [
            { text: "Office of Research", href: "/research" },
            {
              text: "Research by Faculty/School",
              href: "/Pages/ResearchbyFaculty.aspx",
            },
            {
              text: "Interfaculty Research Centers",
              href: "/Pages/ResearchCenters.aspx",
            },
            { text: "University Research Board", href: "/urb" },
          ],
        },
        {
          category: "Funding & Integrity",
          links: [
            { text: "Research Funding", href: "/Pages/ResearchSupport.aspx" },
            {
              text: "Research Integrity",
              href: "/urb/Pages/Researchintegrity.aspx",
            },
            {
              text: "Human Research Protection Program / Institutional Review Board",
              href: "/irb",
            },
          ],
        },
        {
          category: "Opportunities",
          links: [
            {
              text: "Medical Research Volunteer Program",
              href: "/MRVP",
            },
            {
              text: "Undergraduate Research Volunteer Program",
              href: "/provost/urvp",
            },
            { text: "Research News", href: "/articles/Pages/research.aspx" },
          ],
        },
      ],
    },
    {
      title: "Outreach",
      sub: [
        {
          category: "Community",
          links: [
            { text: "Community Engagement", href: "/CCE" },
            { text: "Neighborhood Initiative", href: "/Neighborhood" },
            { text: "Nature Conservation", href: "/natureconservation" },
            { text: "University for Seniors", href: "/seniors" },
          ],
        },
        {
          category: "Institutes",
          links: [
            { text: "Issam Fares Institute", href: "/ifi" },
            {
              text: "iPark",
              href: "https://sites.aub.edu.lb/ipark/",
              external: true,
            },
            { text: "Knowledge to Policy Center", href: "/k2p" },
            {
              text: "The Munib and Angela Masri Institute of Energy and Natural Resources",
              href: "/masri_institute",
            },
          ],
        },
        {
          category: "Global Impact",
          links: [
            {
              text: "AI Hub",
              href: "https://www.aub.edu.lb/hub/Pages/default.aspx",
              external: true,
            },
            {
              text: "Environment and Sustainable Development",
              href: "/fafs/esdu",
            },
            {
              text: "Global Health Institute",
              href: "https://ghi.aub.edu.lb/",
              external: true,
            },
          ],
        },
      ],
    },
    {
      title: "Boldly Campaign",
      sub: [
        {
          category: "Campaign",
          links: [
            {
              text: "Campaign Overview",
              href: "http://boldly.aub.edu.lb/",
              external: true,
            },
            {
              text: "Impact Stories",
              href: "http://boldly.aub.edu.lb/impact-stories/",
              external: true,
            },
            {
              text: "Campaign Objectives",
              href: "http://boldly.aub.edu.lb/campaign-objectives/",
              external: true,
            },
            {
              text: "Ways to Support",
              href: "http://boldly.aub.edu.lb/ways-to-support/",
              external: true,
            },
            {
              text: "Campaign Progress",
              href: "http://boldly.aub.edu.lb/#funding-v2",
              external: true,
            },
            {
              text: "Join the Campaign",
              href: "https://secureca.imodules.com/s/1716/interior.aspx?sid=1716&gid=2&pgid=618&cid=2462",
              external: true,
            },
          ],
        },
      ],
    },
  ];

  // OSB navigation data (from nav-osb section) with real URLs
  const osbNavData = [
    {
      title: "About",
      links: [
        { text: "Meet the Dean", href: "/osb/about/Pages/Meet-the-Dean.aspx" },
        { text: "Mission And Vision", href: "/osb/about/Pages/default.aspx" },
        {
          text: "About Suliman Saleh Olayan",
          href: "/osb/about/Pages/Olayan-.aspx",
        },
        {
          text: "International Advisory Board",
          href: "https://www.aub.edu.lb/osb/Pages/advisoryboard.aspx",
          external: true,
        },
        {
          text: "Global Recognitions & Labels",
          href: "/osb/about/Pages/Global-Recognition-.aspx",
        },
        { text: "Governance", href: "/osb/about/Pages/Governance.aspx" },
        {
          text: "Faculty and Staff Resources",
          href: "/osb/about/Pages/recources.aspx",
        },
        {
          text: "OSB 125",
          href: "/osb/125/Pages/default.aspx",
          external: true,
        },
        {
          text: "OSB Strategic Plan 2029",
          href: "https://sites.aub.edu.lb/osb2029/",
          external: true,
        },
        {
          text: "Job Opportunities",
          href: "https://www.aub.edu.lb/osb/about/Pages/Employment.aspx",
          external: true,
        },
      ],
    },
    {
      title: "Academic Programs",
      links: [
        {
          text: "Undergraduate Program",
          href: "/osb/UndergradProgram",
          external: true,
        },
        {
          text: "Specialized Masters",
          href: "/osb/Pages/SpecializedMasters.aspx",
          external: true,
        },
        { text: "MBA", href: "/osb/MBA", external: true },
        {
          text: "MBA Online",
          href: "/osb/OMBA/Pages/default.aspx",
          external: true,
        },
        { text: "Executive MBA", href: "/osb/EMBA", external: true },
      ],
    },
    {
      title: "Executive Education",
      href: "https://www.aub.edu.lb/osb/executiveeducation/Pages/default.aspx",
      external: true,
    },
    {
      title: "OSB Online",
      links: [
        {
          text: "Entrepreneurship & Innovation Online Graduate Professional Diploma",
          href: "https://www.aub.edu.lb/online/Entrepreneurship-Innovation-online-diploma/Pages/default.aspx",
          external: true,
        },
        {
          text: "Combating Trade-Based Financial Crime Online Certificate",
          href: "https://www.aub.edu.lb/osb/online/combating-trade-based-financial-crime-certificate/Pages/default.aspx",
          external: true,
        },
        {
          text: "Strategic Branding in the Digital Era Online Diploma",
          href: "https://www.aub.edu.lb/osb/online/strategic_branding/Pages/default.aspx",
          external: true,
        },
        {
          text: "Investment Analysis and Modern Portfolio Management Online Graduate Professional Diploma",
          href: "https://www.aub.edu.lb/osb/online/investment-analysis-modern-portfolio-management/Pages/default.aspx",
          external: true,
        },
      ],
    },
    {
      title: "Faculty",
      href: "/osb/Pages/Faculty.aspx",
    },
    {
      title: "Research",
      href: "https://www.aub.edu.lb/osb/facultyresearch/Pages/default.aspx",
      external: true,
    },
    {
      title: "News",
      href: "https://www.aub.edu.lb/osb/news/Pages/default.aspx",
    },
    {
      title: "OSB Impacts",
      href: "https://www.aub.edu.lb/osb/impact/Pages/default.aspx",
      external: true,
    },
  ];

  // Utility links data (matches .nav-utility and mobile utility grid)
  const utilityLinksData = [
    { text: "A - Z", href: "/Pages/AZ.aspx" },
    { text: "Find People", href: "/Search/Pages/People.aspx" },
    { text: "AUBMC", href: "https://aubmc.org.lb/", external: true },
    { text: "Libraries", href: "/libraries" },
    { text: "Jobs", href: "/Employment" },
    {
      text: "Alumni",
      href: "http://alumni.aub.edu.lb/s/1716/start.aspx?gid=2&pgid=61",
      external: true,
    },
    { text: "AUB Online", href: "https://online.aub.edu.lb", external: true },
    {
      text: "AUB – Mediterraneo",
      href: "https://www.aubmed.ac.cy/",
      external: true,
    },
    {
      text: "Telehealth",
      href: "https://myaubhealth.aubmc.org.lb/mychartprd/Authentication/Login",
      external: true,
    },
    {
      text: "Give",
      href: "/advancement/Development/Pages/HowToMakeAGift.aspx",
    },
  ];

  // Helper to create anchor element with proper href and target
  function createLink(linkData, className = "") {
    const a = document.createElement("a");
    a.href = linkData.href;
    a.textContent = linkData.text;
    if (className) a.className = className;
    if (linkData.external) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  // Build mobile main navigation (from mainNavData)
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

      // Loop through sub categories
      item.sub.forEach((category) => {
        const catTitle = document.createElement("div");
        catTitle.className = "subcategory-title";
        // catTitle.innerText = category.category;
        submenu.appendChild(catTitle);

        category.links.forEach((link) => {
          const anchor = createLink(link);
          submenu.appendChild(anchor);
        });
      });

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

  // Build mobile OSB navigation
  function buildMobileOsb() {
    const container = document.getElementById("mobileOsbNav");
    if (!container) return;
    container.innerHTML = "";

    osbNavData.forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.className = "mobile-nav-item";

      const linkDiv = document.createElement("div");

      // Check if item has sub-links OR a direct href
      const hasSub = item.links && item.links.length > 0;
      const hasDirectLink = item.href && !hasSub;

      if (hasDirectLink) {
        // Single link without submenu
        linkDiv.className = "mobile-nav-link";
        const anchor = createLink(
          { text: item.title, href: item.href, external: item.external },
          ""
        );
        linkDiv.appendChild(anchor);
        wrapper.appendChild(linkDiv);
      } else if (hasSub) {
        // Item with dropdown
        linkDiv.className = "mobile-nav-link has-sub";
        linkDiv.innerHTML = `<span>${item.title}</span><span class="chevron-icon"></span>`;

        const submenu = document.createElement("div");
        submenu.className = "mobile-submenu";

        item.links.forEach((link) => {
          const anchor = createLink(link);
          submenu.appendChild(anchor);
        });

        linkDiv.addEventListener("click", (e) => {
          e.preventDefault();
          linkDiv.classList.toggle("open");
          submenu.classList.toggle("open");
        });

        wrapper.appendChild(linkDiv);
        wrapper.appendChild(submenu);
      } else {
        // Fallback: just text with no action (should not happen)
        linkDiv.className = "mobile-nav-link";
        linkDiv.innerHTML = `<span>${item.title}</span>`;
        wrapper.appendChild(linkDiv);
      }

      container.appendChild(wrapper);
    });
  }

  // Build utility grid for mobile
  function buildUtilityGrid() {
    const gridContainer = document.getElementById("mobileUtilityGrid");
    if (!gridContainer) return;

    gridContainer.innerHTML = "";
    utilityLinksData.forEach((link) => {
      const anchor = createLink(link);
      gridContainer.appendChild(anchor);
    });
  }

  // Initialize mobile menus
  buildMobileMain();
  buildMobileOsb();
  buildUtilityGrid();
})();