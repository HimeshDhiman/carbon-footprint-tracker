// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all sections and links
            sections.forEach(section => section.classList.remove('active'));
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to current section and link
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
            this.classList.add('active');
        });
    });
    
    // Initialize dashboard as active
    document.getElementById('dashboard').classList.add('active');
    navLinks[0].classList.add('active');
});

// === THEME TOGGLE FUNCTIONALITY ===
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});

// === GET STARTED BUTTON FUNCTIONALITY ===
document.addEventListener('DOMContentLoaded', function() {
    const getStartedBtn = document.querySelector('.hero .btn-primary');
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            // Remove active class from all sections and links
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to calculator section and link
            document.getElementById('calculator').classList.add('active');
            document.querySelector('a[href="#calculator"]').classList.add('active');
            
            // Smooth scroll to calculator section
            document.getElementById('calculator').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
});

// Carbon calculation coefficients (kg CO2 per unit)
const CARBON_FACTORS = {
    transportation: {
        petrol: 2.31, // kg CO2 per km
        diesel: 2.68, // kg CO2 per km
        electric: 0.05 // kg CO2 per km (depends on electricity source)
    },
    energy: {
        electricity: 0.5, // kg CO2 per kWh
        gas: 2.0 // kg CO2 per m³
    },
    lifestyle: {
        diet: {
            vegetarian: 100, // kg CO2 per month
            'non-vegetarian': 200,
            vegan: 50
        },
        waste: 0.5 // kg CO2 per kg of waste
    }
};

// Calculator functionality
document.getElementById('calculate-btn').addEventListener('click', function() {
    calculateCarbonFootprint();
});

function calculateCarbonFootprint() {
    // Get input values
    const carDistance = parseFloat(document.getElementById('car-distance').value) || 0;
    const fuelType = document.getElementById('fuel-type').value;
    const electricityUsage = parseFloat(document.getElementById('electricity-usage').value) || 0;
    const gasUsage = parseFloat(document.getElementById('gas-usage').value) || 0;
    const dietType = document.getElementById('diet-type').value;
    const wasteProduction = parseFloat(document.getElementById('waste-production').value) || 0;

    // Calculate emissions
    const transportEmissions = carDistance * CARBON_FACTORS.transportation[fuelType];
    const energyEmissions = (electricityUsage * CARBON_FACTORS.energy.electricity) + 
                           (gasUsage * CARBON_FACTORS.energy.gas);
    const lifestyleEmissions = CARBON_FACTORS.lifestyle.diet[dietType] + 
                             (wasteProduction * 4 * CARBON_FACTORS.lifestyle.waste); // 4 weeks in month

    const totalEmissions = transportEmissions + energyEmissions + lifestyleEmissions;

    // Display results
    displayResults(transportEmissions, energyEmissions, lifestyleEmissions, totalEmissions);
}

function displayResults(transport, energy, lifestyle, total) {
    const resultContainer = document.getElementById('calculation-result');
    
    resultContainer.innerHTML = `
        <h3>📊 Calculation Results</h3>
        <div class="result-grid">
            <div class="result-item">
                <span>Transportation:</span>
                <span>${transport.toFixed(2)} kg CO₂</span>
            </div>
            <div class="result-item">
                <span>Energy:</span>
                <span>${energy.toFixed(2)} kg CO₂</span>
            </div>
            <div class="result-item">
                <span>Lifestyle:</span>
                <span>${lifestyle.toFixed(2)} kg CO₂</span>
            </div>
            <div class="result-item total">
                <strong>Total Monthly Footprint:</strong>
                <strong>${total.toFixed(2)} kg CO₂</strong>
            </div>
        </div>
        <button id="save-footprint" class="btn-secondary">Save to Dashboard</button>
    `;
    
    resultContainer.style.display = 'block';
    
    // Add event listener for save button
    document.getElementById('save-footprint').addEventListener('click', function() {
        saveFootprintToDashboard(total);
    });
}

function saveFootprintToDashboard(totalEmissions) {
    // Update dashboard
    document.getElementById('current-footprint').textContent = `${totalEmissions.toFixed(2)} kg CO₂`;
    
    // Calculate CDM credits (simplified: 1 credit per 1000 kg CO2 reduction)
    const creditsEarned = Math.floor(totalEmissions / 1000);
    document.getElementById('cdm-credits').textContent = creditsEarned;
    
    // Calculate equivalent trees planted (1 tree absorbs ~21 kg CO2 per year)
    const treesPlanted = Math.floor(totalEmissions / 21);
    document.getElementById('trees-planted').textContent = treesPlanted;
    
    // Save to localStorage
    localStorage.setItem('savedFootprint', `${totalEmissions.toFixed(2)} kg CO₂`);
    localStorage.setItem('savedCredits', creditsEarned);
    localStorage.setItem('savedTrees', treesPlanted);
    
    // Show success message with animation
    showNotification('Footprint saved to dashboard! CDM credits updated.');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// CDM Projects functionality
function loadCDMProjects() {
    // Simulated CDM projects data
    const projectsData = {
        projects: [
            {
                id: 1,
                name: "Solar Power Plant - Rajasthan",
                type: "Renewable Energy",
                description: "50MW solar power plant reducing coal-based electricity generation",
                co2Reduction: 45000,
                creditsAvailable: 4500,
                status: "active",
                location: "Rajasthan, India"
            },
            {
                id: 2,
                name: "Afforestation Project - Western Ghats",
                type: "Forestry",
                description: "Reforestation of degraded land with native species",
                co2Reduction: 25000,
                creditsAvailable: 2500,
                status: "active",
                location: "Karnataka, India"
            },
            {
                id: 3,
                name: "Biomass Energy - Punjab",
                type: "Waste Management",
                description: "Conversion of agricultural waste to energy",
                co2Reduction: 15000,
                creditsAvailable: 1500,
                status: "completed",
                location: "Punjab, India"
            },
            {
                id: 4,
                name: "Wind Farm - Tamil Nadu",
                type: "Renewable Energy",
                description: "100MW wind energy project replacing fossil fuel power",
                co2Reduction: 35000,
                creditsAvailable: 3500,
                status: "active",
                location: "Tamil Nadu, India"
            }
        ]
    };
    
    displayProjects(projectsData.projects);
    setupFilterButtons(projectsData.projects);
}

function displayProjects(projects) {
    const container = document.getElementById('projects-container');
    
    container.innerHTML = projects.map(project => `
        <div class="project-card" data-status="${project.status.toLowerCase()}">
            <div class="project-header">
                <h3>${project.name}</h3>
                <span class="project-type">${project.type}</span>
            </div>
            <div class="project-body">
                <p>${project.description}</p>
                <div class="project-stats">
                    <div class="project-stat">
                        <div class="project-stat-value">${project.co2Reduction.toLocaleString()}</div>
                        <div class="project-stat-label">CO₂ Reduction (tons)</div>
                    </div>
                    <div class="project-stat">
                        <div class="project-stat-value">${project.creditsAvailable}</div>
                        <div class="project-stat-label">CDM Credits</div>
                    </div>
                </div>
                <div class="project-info">
                    <p><strong>Location:</strong> ${project.location}</p>
                    <p><strong>Status:</strong> <span class="status-${project.status}">${project.status}</span></p>
                </div>
                <button class="btn-secondary invest-btn" data-project-id="${project.id}">
                    <i class="fas fa-hand-holding-usd"></i> Simulate Investment
                </button>
            </div>
        </div>
    `).join('');
    
    // Add status styling
    const statusStyle = document.createElement('style');
    statusStyle.textContent = `
        .status-active { color: var(--primary-color); font-weight: bold; }
        .status-completed { color: var(--secondary-color); font-weight: bold; }
    `;
    if (!document.querySelector('style[data-status]')) {
        statusStyle.setAttribute('data-status', 'true');
        document.head.appendChild(statusStyle);
    }
    
    // Add event listeners to investment buttons
    document.querySelectorAll('.invest-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project-id');
            simulateInvestment(projectId);
        });
    });
}

function setupFilterButtons(projects) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            const filter = this.getAttribute('data-filter');
            let filteredProjects = projects;
            
            if (filter !== 'all') {
                if (filter === 'renewable') {
                    filteredProjects = projects.filter(project => 
                        project.type.toLowerCase().includes('renewable')
                    );
                } else {
                    filteredProjects = projects.filter(project => 
                        project.status.toLowerCase() === filter
                    );
                }
            }
            
            displayProjects(filteredProjects);
        });
    });
}

function simulateInvestment(projectId) {
    // Find the project
    const projects = document.querySelectorAll('.project-card');
    const project = Array.from(projects).find(p => 
        p.querySelector('.invest-btn').getAttribute('data-project-id') === projectId
    );
    
    if (project) {
        const projectName = project.querySelector('h3').textContent;
        
        // Update user's CDM credits
        const currentCredits = parseInt(document.getElementById('cdm-credits').textContent) || 0;
        const newCredits = currentCredits + 5; // Add 5 credits for simulation
        document.getElementById('cdm-credits').textContent = newCredits;
        
        // Update trees planted
        const currentTrees = parseInt(document.getElementById('trees-planted').textContent) || 0;
        const newTrees = currentTrees + 25; // Add 25 trees for simulation
        document.getElementById('trees-planted').textContent = newTrees;
        
        // Save to localStorage
        localStorage.setItem('savedCredits', newCredits);
        localStorage.setItem('savedTrees', newTrees);
        
        showNotification(`Successfully invested in ${projectName}! +5 CDM Credits earned.`);
    }
}

// Load projects when CDM section is activated
document.querySelector('a[href="#cdm-projects"]').addEventListener('click', function(e) {
    e.preventDefault();
    loadCDMProjects();
});

// Reports functionality
document.getElementById('generate-report').addEventListener('click', generateReport);
document.getElementById('export-report').addEventListener('click', exportReport);

function generateReport() {
    const currentFootprint = document.getElementById('current-footprint').textContent;
    const cdmCredits = parseInt(document.getElementById('cdm-credits').textContent) || 0;
    const treesPlanted = parseInt(document.getElementById('trees-planted').textContent) || 0;
    
    const reportsOutput = document.getElementById('reports-output');
    
    reportsOutput.innerHTML = `
        <div class="report-section">
            <h3>📈 Monthly Carbon Report</h3>
            <div class="report-grid">
                <div class="report-item">
                    <div class="report-value">${currentFootprint}</div>
                    <div class="report-label">Current Footprint</div>
                </div>
                <div class="report-item">
                    <div class="report-value">${cdmCredits}</div>
                    <div class="report-label">CDM Credits</div>
                </div>
                <div class="report-item">
                    <div class="report-value">${treesPlanted}</div>
                    <div class="report-label">Trees Planted</div>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h3>🌱 Environmental Impact</h3>
            <p>Your carbon reduction efforts are equivalent to:</p>
            <ul class="impact-list">
                <li><i class="fas fa-tree"></i> Planting ${treesPlanted} trees annually</li>
                <li><i class="fas fa-car"></i> Removing ${Math.floor(cdmCredits * 2)} cars from the road for a year</li>
                <li><i class="fas fa-home"></i> Powering ${Math.floor(cdmCredits * 5)} homes with renewable energy</li>
                <li><i class="fas fa-recycle"></i> Recycling ${Math.floor(treesPlanted * 100)} kg of waste</li>
            </ul>
        </div>
        
        <div class="report-section">
            <h3>📊 CDM Contribution</h3>
            <p>Through your participation in CDM projects, you've contributed to:</p>
            <ul class="impact-list">
                <li><i class="fas fa-solar-panel"></i> Renewable energy development</li>
                <li><i class="fas fa-tree"></i> Forest conservation efforts</li>
                <li><i class="fas fa-recycle"></i> Sustainable waste management</li>
                <li><i class="fas fa-graduation-cap"></i> Community environmental education</li>
            </ul>
        </div>
        
        <div class="chart-container">
            <i class="fas fa-chart-bar" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <p>Carbon Footprint Trend Visualization</p>
            <p><small>Chart would show monthly footprint trends here</small></p>
        </div>
    `;
    
    reportsOutput.style.display = 'block';
}

function exportReport() {
    showNotification('Report exported successfully! In a real application, this would generate a PDF.');
    // window.print(); // Uncomment this if you want to enable printing
}

// Initialize application
function initApp() {
    // Load any saved data from localStorage
    loadSavedData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load CDM projects if on that section
    if (document.getElementById('cdm-projects').classList.contains('active')) {
        loadCDMProjects();
    }
}

function loadSavedData() {
    // Load saved footprint data if exists
    const savedFootprint = localStorage.getItem('savedFootprint');
    if (savedFootprint) {
        document.getElementById('current-footprint').textContent = savedFootprint;
    }
    
    const savedCredits = localStorage.getItem('savedCredits');
    if (savedCredits) {
        document.getElementById('cdm-credits').textContent = savedCredits;
    }
    
    const savedTrees = localStorage.getItem('savedTrees');
    if (savedTrees) {
        document.getElementById('trees-planted').textContent = savedTrees;
    }
}

function setupEventListeners() {
    // Additional event listeners can be added here
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);