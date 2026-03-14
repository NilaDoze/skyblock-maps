// ==========================================
// QUEUE DATA - EDIT THIS SECTION EASILY
// ==========================================

// Set to false if you want to pause taking new commissions
const acceptingCommissions = false;

// Maximum items to show initially (3 by default)
const MAX_VISIBLE = 3;

// Active commissions (in progress)
const activeQueue = [
    // Example: { name: "PlayerName", size: "2x2", status: "Building" }
    // Remove the examples below and add your own:
    { name: "Jabe", size: "2x3", status: "Building 16%" },
    { name: "Lexii", size: "5x4", status: "Building" },
    { name: "Sodium", size: "2x3", status: "Pending" },
];

// Recently completed commissions
const completedQueue = [
    // Example: { name: "PlayerName", size: "2x2", completedDate: "Jan 15" }
    // Remove the examples below and add your own:
    { name: "Isha", size: "2x2", completedDate: "March 12" },
    { name: "Jinx", size: "2x3", completedDate: "February 26" },
];

// ==========================================
// END OF QUEUE DATA
// ==========================================

// Queue visibility state
let queueExpanded = {
    active: false,
    completed: false
};

// Render Queue Function
function renderQueue() {
    // Update status indicator
    const statusEl = document.getElementById('queueStatus');
    if (acceptingCommissions) {
        statusEl.className = 'queue-status open';
        statusEl.innerHTML = '<i class="fas fa-check-circle"></i><span>Accepting Commissions</span>';
    } else {
        statusEl.className = 'queue-status closed';
        statusEl.innerHTML = '<i class="fas fa-pause-circle"></i><span>Queue Full</span>';
    }

    // Render active queue
    renderQueueSection('active', activeQueue, 'activeQueue', 'activeCount', 'activeShowMore');
    
    // Render completed queue
    renderQueueSection('completed', completedQueue, 'completedQueue', 'completedCount', 'completedShowMore');

    // Update timestamp
    const now = new Date();
    document.getElementById('lastUpdated').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Render individual queue section
function renderQueueSection(type, data, listId, countId, buttonId) {
    const list = document.getElementById(listId);
    const count = document.getElementById(countId);
    const showMoreBtn = document.getElementById(buttonId);
    
    count.textContent = data.length;
    
    if (data.length === 0) {
        list.innerHTML = '<li class="queue-empty">No items in this queue</li>';
        showMoreBtn.style.display = 'none';
        return;
    }

    // Determine how many items to show
    const expanded = queueExpanded[type];
    const visibleCount = expanded ? data.length : Math.min(MAX_VISIBLE, data.length);
    const hasMore = data.length > MAX_VISIBLE;

    // Generate HTML for items
    const itemsHtml = data.map((item, index) => {
        const isVisible = index < visibleCount;
        const hiddenClass = isVisible ? '' : 'hidden';
        
        if (type === 'active') {
            return `
                <li class="queue-item ${hiddenClass}" data-index="${index}">
                    <div class="queue-item-info">
                        <div class="queue-avatar">${item.name.charAt(0).toUpperCase()}</div>
                        <div class="queue-item-details">
                            <h4>${item.name}</h4>
                            <p>Size: ${item.size} • #${index + 1} in queue</p>
                        </div>
                    </div>
                    <span class="queue-badge active">${item.status}</span>
                </li>
            `;
        } else {
            return `
                <li class="queue-item ${hiddenClass}" data-index="${index}">
                    <div class="queue-item-info">
                        <div class="queue-avatar" style="background: linear-gradient(135deg, #10b981, #059669);">${item.name.charAt(0).toUpperCase()}</div>
                        <div class="queue-item-details">
                            <h4>${item.name}</h4>
                            <p>Size: ${item.size} • Completed ${item.completedDate}</p>
                        </div>
                    </div>
                    <span class="queue-badge completed">Done</span>
                </li>
            `;
        }
    }).join('');

    list.innerHTML = itemsHtml;

    // Show/hide the Show More button
    if (hasMore) {
        showMoreBtn.style.display = 'flex';
        const btnText = showMoreBtn.querySelector('span');
        btnText.textContent = expanded ? 'Show Less' : `Show ${data.length - MAX_VISIBLE} More`;
        showMoreBtn.classList.toggle('expanded', expanded);
    } else {
        showMoreBtn.style.display = 'none';
    }
}

// Toggle queue expansion
function toggleQueue(type) {
    queueExpanded[type] = !queueExpanded[type];
    renderQueue();
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe step cards
document.querySelectorAll('.step-card').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(el);
});

// FAQ Toggle
function toggleFaq(button) {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close all other items
    document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        item.classList.add('active');
    }
}

// Copy to clipboard
function copyToClipboard(element, text) {
    navigator.clipboard.writeText(text).then(() => {
        element.classList.add('copied');
        setTimeout(() => {
            element.classList.remove('copied');
        }, 2000);
    });
}

// Mobile menu toggle - FIXED
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize queue on page load
renderQueue();
