/**
 * Profile Loader - Dynamically loads and renders profile data from JSON
 * This script fetches profile data and populates the HTML template
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        dataPath: 'data/profile.json',
        selectors: {
            // Header & Navigation
            siteLogo: '#header-logo',
            navMenu: '#nav-menu',
            navLinks: '#nav-links',
            
            // Banner/Hero Section
            profileName: '#profile-name',
            profileTitle: '#profile-title',
            profileImage: '#profile-image',
            profileIntro: '#profile-intro',
            profileBackground: '#profile-background',
            profileResearch: '#profile-research',
            cvButton: '#cv-button',
            
            // Publications
            publicationsGrid: '#publications-grid',
            
            // Projects
            projectsGrid: '#projects-grid',
            
            // Contact
            contactEmail: '#contact-email',
            contactLinks: '#contact-links',
            
            // Page
            pageTitle: 'title'
        }
    };

    /**
     * Main initialization function
     */
    async function init() {
        try {
            const data = await fetchProfileData();
            if (data) {
                renderProfile(data);
                console.log('Profile loaded successfully');
            }
        } catch (error) {
            console.error('Error initializing profile:', error);
            showError('Failed to load profile data');
        }
    }

    /**
     * Fetch profile data from JSON file
     */
    async function fetchProfileData() {
        try {
            const response = await fetch(CONFIG.dataPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching profile data:', error);
            return null;
        }
    }

    /**
     * Main render function that delegates to section renderers
     */
    function renderProfile(data) {
        renderPageMeta(data);
        renderHeader(data);
        renderBanner(data);
        renderPublications(data.publications);
        renderProjects(data.projects);
        renderSkills(data.skills);
        renderCertifications(data.certifications);
        renderEducation(data);
        applyThemeColors(data.siteConfig);
    }

    /**
     * Render page metadata
     */
    function renderPageMeta(data) {
        if (data.profile && data.profile.name) {
            document.title = data.profile.name;
        }
    }

    /**
     * Render header section
     */
    function renderHeader(data) {
        // Logo/Name
        const logo = document.querySelector(CONFIG.selectors.siteLogo);
        if (logo && data.profile) {
            logo.innerHTML = `<strong>${data.profile.name}</strong>`;
        }

        // Navigation
        const navLinks = document.querySelector(CONFIG.selectors.navLinks);
        if (navLinks && data.navigation) {
            navLinks.innerHTML = '';
            data.navigation.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${item.href}">${item.label}</a>`;
                navLinks.appendChild(li);
            });
        }

        // Contact links in header
        if (data.contact) {
            const contactLinks = navLinks || document.querySelector(CONFIG.selectors.navLinks);
            if (contactLinks) {
                if (data.contact.email) {
                    const emailLi = document.createElement('li');
                    emailLi.innerHTML = `<a href="mailto:${data.contact.email}">${data.contact.email}</a>`;
                    contactLinks.appendChild(emailLi);
                }
                if (data.contact.linkedin) {
                    const linkedinLi = document.createElement('li');
                    linkedinLi.innerHTML = `<a href="${data.contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`;
                    contactLinks.appendChild(linkedinLi);
                }
                if (data.contact.github) {
                    const githubLi = document.createElement('li');
                    githubLi.innerHTML = `<a href="${data.contact.github}" target="_blank" rel="noopener">GitHub</a>`;
                    contactLinks.appendChild(githubLi);
                }
                if (data.contact.googleScholar) {
                    const scholarLi = document.createElement('li');
                    scholarLi.innerHTML = `<a href="${data.contact.googleScholar}" target="_blank" rel="noopener">Google Scholar</a>`;
                    contactLinks.appendChild(scholarLi);
                }
            }
        }
    }

    /**
     * Render banner/hero section
     */
    function renderBanner(data) {
        if (!data.profile) return;

        // Name
        const nameEl = document.querySelector(CONFIG.selectors.profileName);
        if (nameEl) {
            nameEl.textContent = data.profile.name;
        }

        // Title
        const titleEl = document.querySelector(CONFIG.selectors.profileTitle);
        if (titleEl) {
            titleEl.textContent = `${data.profile.title} | ${data.profile.organization}`;
        }

        // Profile Image
        const imageEl = document.querySelector(CONFIG.selectors.profileImage);
        if (imageEl && data.profile.profileImage) {
            imageEl.src = data.profile.profileImage;
            imageEl.alt = data.profile.name;
        }

        // Bio sections
        if (data.bio) {
            const introEl = document.querySelector(CONFIG.selectors.profileIntro);
            if (introEl && data.bio.introduction) {
                introEl.innerHTML = data.bio.introduction;
            }

            const bgEl = document.querySelector(CONFIG.selectors.profileBackground);
            if (bgEl && data.bio.background) {
                bgEl.innerHTML = data.bio.background;
            }

            const researchEl = document.querySelector(CONFIG.selectors.profileResearch);
            if (researchEl && data.bio.researchFocus) {
                researchEl.innerHTML = data.bio.researchFocus;
            }
        }

        // Hero Metrics
        const metricsEl = document.querySelector('#hero-metrics');
        if (metricsEl && data.profile.metrics) {
            metricsEl.innerHTML = data.profile.metrics.map(metric => {
                const parts = metric.split(' ');
                const value = parts[0];
                const label = parts.slice(1).join(' ');
                return `
                    <div class="metric-item">
                        <div class="metric-value">${value}</div>
                        <div class="metric-label">${label}</div>
                    </div>
                `;
            }).join('');
        }

        // CV Button
        const cvBtn = document.querySelector(CONFIG.selectors.cvButton);
        if (cvBtn && data.profile.cvPath) {
            cvBtn.href = data.profile.cvPath;
        }
    }

    /**
     * Render publications section
     */
    function renderPublications(publications) {
        const container = document.querySelector(CONFIG.selectors.publicationsGrid);
        if (!container || !publications) return;

        container.innerHTML = '';
        
        publications.forEach(pub => {
            const article = createPublicationCard(pub);
            container.appendChild(article);
        });
    }

    /**
     * Create a publication card element
     */
    function createPublicationCard(pub) {
        const article = document.createElement('article');
        article.className = 'publication-card';
        
        let linksHtml = '';
        if (pub.links) {
            if (pub.links.paper) {
                linksHtml += `<li><a href="${pub.links.paper}" class="button">Read Paper</a></li>`;
            } else if (pub.links.status) {
                linksHtml += `<li><a href="#" class="button">Paper (${pub.links.status})</a></li>`;
            }
            if (pub.links.github) {
                linksHtml += `<li><a href="${pub.links.github}" class="button">View Project</a></li>`;
            }
        }

        article.innerHTML = `
            <div class="image">
                <img src="${pub.image || 'images/pic01.jpg'}" alt="${pub.title}" />
            </div>
            <div class="content">
                <h3>${pub.title}</h3>
                ${pub.authors ? `<p class="authors">${pub.authors}${pub.venue ? ', ' + pub.venue : ''}</p>` : ''}
                ${pub.venue && !pub.authors ? `<p class="authors">${pub.venue}</p>` : ''}
                <p class="description">${pub.description}</p>
                ${linksHtml ? `<ul class="actions">${linksHtml}</ul>` : ''}
            </div>
        `;
        
        return article;
    }

    /**
     * Render projects section
     */
    function renderProjects(projects) {
        const container = document.querySelector(CONFIG.selectors.projectsGrid);
        if (!container || !projects) return;

        container.innerHTML = '';
        
        projects.forEach(project => {
            const article = createProjectCard(project);
            container.appendChild(article);
        });
    }

    /**
     * Create a project card element
     */
    function createProjectCard(project) {
        const article = document.createElement('article');
        article.className = 'project-card';
        
        // Extract metrics from project data
        let metricsHtml = '';
        if (project.metrics) {
            metricsHtml = `
                <div class="project-metrics">
                    ${project.metrics.map(metric => `
                        <div class="metric-item">
                            <div class="metric-badge">${metric.value}</div>
                            <div class="metric-label">${metric.label}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // Tech stack - limit to 4 most important
        let techPillsHtml = '';
        if (project.techStack && project.techStack.length > 0) {
            const techsToShow = project.techStack.slice(0, 4);
            techPillsHtml = `
                <div class="tech-pills">
                    ${techsToShow.map(tech => 
                        `<span class="tech-pill">${tech}</span>`
                    ).join('')}
                </div>
            `;
        }
        
        article.innerHTML = `
            <h3 class="project-title">
                ${project.title}
                ${project.year ? `<span class="project-year">${project.year}</span>` : ''}
            </h3>
            ${metricsHtml}
            <p class="project-description">${project.shortDescription}</p>
            ${techPillsHtml}
        `;
        
        return article;
    }

    /**
     * Apply theme colors from configuration
     */
    /**
     * Render certifications section
     */
    function renderCertifications(certifications) {
        const container = document.getElementById('certifications-grid');
        if (!container) {
            console.error('Certifications container not found');
            return;
        }
        if (!certifications || certifications.length === 0) {
            console.log('No certifications data found');
            return;
        }
        console.log('Rendering certifications (v3):', certifications);
        console.log('Container found:', container);
        console.log('Current container HTML before update:', container.innerHTML);

        container.innerHTML = certifications.map(cert => `
            <div class="certification-item">
                <div class="cert-name">${cert.name}</div>
                <div class="cert-id">${cert.credentialId || ''}</div>
                <div class="cert-date">${cert.date ? cert.date.replace('January', 'Jan').replace('February', 'Feb').replace('March', 'Mar').replace('April', 'Apr').replace('May', 'May').replace('June', 'Jun').replace('July', 'Jul').replace('August', 'Aug').replace('September', 'Sep').replace('October', 'Oct').replace('November', 'Nov').replace('December', 'Dec') : ''}</div>
            </div>
        `).join('');
        console.log('Container HTML after update:', container.innerHTML);
    }

    function renderEducation(data) {
        const educationGrid = document.querySelector('#education-grid');
        if (!educationGrid || !data.education) return;

        educationGrid.innerHTML = data.education.map(edu => {
            // Simplify degree names
            let degree = edu.degree
                .replace('Diploma in ', '')
                .replace("Bachelor's in ", '')
                .replace("Master's in ", "Master's ");
            
            return `
                <div class="education-item">
                    <div class="edu-degree">${degree}</div>
                    <div class="edu-institution">${edu.institution}, ${edu.location}</div>
                </div>
            `;
        }).join('');
    }

    /**
     * Render skills section
     */
    function renderSkills(skills) {
        const container = document.querySelector('#skills-container');
        if (!container || !skills) return;
        
        const categories = [
            { key: 'salesforceTechnologies', label: 'Salesforce Platform' },
            { key: 'integrationTools', label: 'Integration & Tools' },
            { key: 'analyticsTools', label: 'Analytics & Data' },
            { key: 'otherTools', label: 'Productivity Tools' },
            { key: 'softSkills', label: 'Professional Skills' }
        ];
        
        container.innerHTML = categories.map(cat => {
            if (!skills[cat.key] || skills[cat.key].length === 0) return '';
            
            return `
                <div class="skills-category">
                    <h4>${cat.label}</h4>
                    <div class="skills-list">
                        ${skills[cat.key].map(skill => 
                            `<span class="skill-item">${skill}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    function applyThemeColors(config) {
        if (!config || !config.themeColors) return;

        const root = document.documentElement;
        const colors = config.themeColors;
        
        if (colors.primaryRed) root.style.setProperty('--primary-red', colors.primaryRed);
        if (colors.lightRed) root.style.setProperty('--light-red', colors.lightRed);
        if (colors.darkRed) root.style.setProperty('--dark-red', colors.darkRed);
        if (colors.textDark) root.style.setProperty('--text-dark', colors.textDark);
        if (colors.textLight) root.style.setProperty('--text-light', colors.textLight);
        if (colors.bgLight) root.style.setProperty('--bg-light', colors.bgLight);
        if (colors.white) root.style.setProperty('--white', colors.white);
    }

    /**
     * Show error message
     */
    function showError(message) {
        console.error(message);
        // Could implement a user-facing error display here
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();