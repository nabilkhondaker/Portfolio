fetch('projects.json')
  .then(res => res.json())
  .then(projects => {
    const featuredContainer = document.getElementById("projects-container");
    const olderContainer = document.getElementById("older-projects-container");

    projects.forEach(p => {
      const card = document.createElement("div");
      
      // Style differently if it's an older project for visual hierarchy
      card.className = p.older ? "older-project-card" : "project-card";
      
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
        
      const siteLink = p.link ? `<p><a href="${p.link}" class="highlight-link" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> visit site</a></p>` : "";

      card.innerHTML = `
        ${badgeHTML}
        
        <!-- Default Visible Content -->
        <div class="project-content">
          <h3>${p.title}</h3>
          ${p.tag ? `<div class="project-tag">${p.tag}</div>` : ""}
          <p>${p.description}</p>
          <div class="project-links default-links">
            ${repoLinks ? `<p>${repoLinks}</p>` : ""}
            ${siteLink}
          </div>
        </div>

        <!-- Hover Reveal Tech Specs Overlay -->
        <div class="project-tech-overlay">
          <div class="tech-specs-content">
            <h4><i class="fa-solid fa-microchip"></i> under the hood</h4>
            <p>${p.techSpecs || "Technical documentation currently unavailable."}</p>
          </div>
          <div class="project-links overlay-links">
            ${repoLinks ? `<p>${repoLinks}</p>` : ""}
            ${siteLink}
          </div>
        </div>
      `;

      // Route to correct layout section based on its file flag
      if (p.older && olderContainer) {
        olderContainer.appendChild(card);
      } else if (featuredContainer) {
        featuredContainer.appendChild(card);
      }
    });
  })
  .catch(err => {
    console.error("Error loading projects.json", err);
  });
