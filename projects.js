fetch('projects.json')
  .then(res => res.json())
  .then(projects => {
    const featuredContainer = document.getElementById("featured-projects-grid");
    const allProjectsContainer = document.getElementById("all-projects-grid");

    const featuredTitles = [
        "fea playground 2D <i class='fab fa-html5'></i> <i class='fab fa-css3-alt'></i> <i class='fab fa-js'></i>",
        "fea generative cto engine <i class=\"fab fa-python\"></i>",
        "2R planar robot paddle <i class=\"fab fa-python\"></i>"
    ];

    const createCard = (p) => {
      const card = document.createElement("div");
      card.className = "project-card";
      
      let repoLinks = "";
      if (p.repos) {
        repoLinks = p.repos.map(r =>
          `<a href="${r.url}" class="highlight-link" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> ${r.name} Repo</a>`
        ).join(" | ");
      } else if (p.repo) {
        repoLinks = `<a href="${p.repo}" class="highlight-link" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> repo</a>`;
      }

      const badgeHTML = p.inProgress 
        ? `<div class="in-progress-badge"><i class="fa-solid fa-screwdriver-wrench"></i> in progress</div>` 
        : '';
        
      const siteLink = p.link ? `<a href="${p.link}" class="highlight-link" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> visit site</a>` : "";
      
      const overviewHtml = `<button class="mini-btn overview-btn"><i class="fa-solid fa-circle-info"></i> overview</button>`;

      card.innerHTML = `
        ${badgeHTML}
        
        <div class="project-content">
          <h3>${p.title}</h3>
          ${p.tag ? `<div class="project-tag">${p.tag}</div>` : ""}
          <p>${p.description}</p>
          <div class="project-links default-links">
            ${repoLinks}
            ${siteLink}
          </div>
        </div>

        <!-- Giant Detailed Glass Bubble Tooltip with Flex Centering and scroll handling -->
        <div class="glass-bubble">
          <div class="glass-bubble-inner">
              <h4><i class="fa-solid fa-microchip"></i> Deeper Dive</h4>
              <p>${p.techSpecs || "Technical documentation currently unavailable."}</p>
              <div class="project-links overlay-links">
                ${repoLinks}
                ${siteLink}
                ${overviewHtml}
              </div>
          </div>
        </div>
      `;

      const overviewBtn = card.querySelector('.overview-btn');
      if (overviewBtn) {
          overviewBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              if (window.openOverviewModal) {
                  window.openOverviewModal(
                      p.title,
                      p.description,
                      p.why || "Why you built this project...",
                      p.learned || "What you learned building this...",
                      p.challenges || "The specific challenges you faced..."
                  );
              }
          });
      }

      return card;
    };

    projects.forEach(p => {
      if (allProjectsContainer) {
        allProjectsContainer.appendChild(createCard(p));
      }
      if (featuredContainer && featuredTitles.includes(p.title)) {
        featuredContainer.appendChild(createCard(p));
      }
    });
  })
  .catch(err => {
    console.error("Error loading projects.json", err);
  });
