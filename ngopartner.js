document.addEventListener('DOMContentLoaded', function() {
    // NGO Partners page functionality
    const cityFilter = document.getElementById('city-filter');
    const specialtyFilter = document.getElementById('specialty-filter');
    const partnersContainer = document.getElementById('partners-container');
    const pagination = document.getElementById('pagination');
    const partnerForm = document.getElementById('partner-form');
    
    // Sample NGO data
    const ngoData = [
        {
            id: 1,
            name: 'Paws & Care',
            city: 'mumbai',
            specialty: ['rescue', 'medical'],
            description: 'Dedicated to rescuing and providing medical care to street animals in Mumbai.',
            image: 'images/ngo1.jpg'
        },
        {
            id: 2,
            name: 'Street Tails',
            city: 'delhi',
            specialty: ['rescue', 'rehab'],
            description: 'Focusing on rescue and rehabilitation of stray dogs in Delhi NCR.',
            image: 'images/ngo2.jpg'
        },
        {
            id: 3,
            name: 'Animal Aid Unlimited',
            city: 'bangalore',
            specialty: ['rescue', 'medical', 'rehab'],
            description: 'Comprehensive care for injured and sick street animals in Bangalore.',
            image: 'images/ngo3.jpg'
        },
        {
            id: 4,
            name: 'Friendicoes',
            city: 'delhi',
            specialty: ['rescue', 'adoption'],
            description: 'Rescuing animals and finding them loving forever homes.',
            image: 'images/ngo4.jpg'
        },
        {
            id: 5,
            name: 'The Welfare of Stray Dogs',
            city: 'mumbai',
            specialty: ['rescue', 'medical', 'adoption'],
            description: 'Working to improve the lives of stray dogs through rescue and adoption.',
            image: 'images/ngo5.jpg'
        },
        {
            id: 6,
            name: 'CUPA',
            city: 'bangalore',
            specialty: ['rescue', 'medical', 'rehab'],
            description: 'Compassion Unlimited Plus Action - helping animals in distress.',
            image: 'images/ngo6.jpg'
        },
        {
            id: 7,
            name: 'Sanjay Gandhi Animal Care Centre',
            city: 'delhi',
            specialty: ['medical', 'rehab'],
            description: 'Providing medical care and rehabilitation to injured animals.',
            image: 'images/ngo7.jpg'
        },
        {
            id: 8,
            name: 'VOSD',
            city: 'bangalore',
            specialty: ['rescue', 'rehab'],
            description: 'Voice of Stray Dogs - sanctuary and care for rescued animals.',
            image: 'images/ngo8.jpg'
        },
        {
            id: 9,
            name: 'Red Paws Rescue',
            city: 'mumbai',
            specialty: ['rescue', 'adoption'],
            description: 'Specializing in rescue and adoption of street dogs.',
            image: 'images/ngo9.jpg'
        }
    ];
    
    // Current page and items per page
    let currentPage = 1;
    const itemsPerPage = 6;
    
    // Filter and display NGOs
    function displayNGOs() {
        const city = cityFilter.value;
        const specialty = specialtyFilter.value;
        
        // Filter NGOs
        let filteredNGOs = ngoData.filter(ngo => {
            const cityMatch = city === 'all' || ngo.city === city;
            const specialtyMatch = specialty === 'all' || ngo.specialty.includes(specialty);
            return cityMatch && specialtyMatch;
        });
        
        // Pagination
        const totalPages = Math.ceil(filteredNGOs.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedNGOs = filteredNGOs.slice(startIndex, startIndex + itemsPerPage);
        
        // Clear container
        partnersContainer.innerHTML = '';
        
        // Display NGOs
        if (paginatedNGOs.length > 0) {
            paginatedNGOs.forEach(ngo => {
                const ngoCard = document.createElement('div');
                ngoCard.className = 'partner-card';
                ngoCard.innerHTML = `
                    <div class="partner-image">
                        <img src="${ngo.image}" alt="${ngo.name}">
                    </div>
                    <div class="partner-info">
                        <h3>${ngo.name}</h3>
                        <div class="partner-location">
                            <i class="fas fa-map-marker-alt"></i> ${formatCity(ngo.city)}
                        </div>
                        <span class="partner-specialty">${formatSpecialty(ngo.specialty[0])}</span>
                        <p class="partner-description">${ngo.description}</p>
                        <a href="#" class="partner-link">Learn More <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                partnersContainer.appendChild(ngoCard);
            });
        } else {
            partnersContainer.innerHTML = '<p class="no-results">No NGOs found matching your criteria.</p>';
        }
        
        // Update pagination
        updatePagination(totalPages);
    }
    
    // Format city name
    function formatCity(city) {
        const cityNames = {
            'mumbai': 'Mumbai',
            'delhi': 'Delhi',
            'bangalore': 'Bangalore',
            'hyderabad': 'Hyderabad',
            'chennai': 'Chennai',
            'kolkata': 'Kolkata'
        };
        return cityNames[city] || city;
    }
    
    // Format specialty
    function formatSpecialty(specialty) {
        const specialtyNames = {
            'rescue': 'Rescue',
            'medical': 'Medical Care',
            'rehab': 'Rehabilitation',
            'adoption': 'Adoption'
        };
        return specialtyNames[specialty] || specialty;
    }
    
    // Update pagination controls
    function updatePagination(totalPages) {
        pagination.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        // Previous button
        if (currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '&laquo;';
            prevBtn.addEventListener('click', function() {
                currentPage--;
                displayNGOs();
            });
            pagination.appendChild(prevBtn);
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.addEventListener('click', function() {
                currentPage = i;
                displayNGOs();
            });
            pagination.appendChild(pageBtn);
        }
        
        // Next button
        if (currentPage < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '&raquo;';
            nextBtn.addEventListener('click', function() {
                currentPage++;
                displayNGOs();
            });
            pagination.appendChild(nextBtn);
        }
    }
    
    // Filter event listeners
    cityFilter.addEventListener('change', function() {
        currentPage = 1;
        displayNGOs();
    });
    
    specialtyFilter.addEventListener('change', function() {
        currentPage = 1;
        displayNGOs();
    });
    
    // Form submission
    if (partnerForm) {
        partnerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--error-color)';
                    isValid = false;
                    
                    // Remove error highlight after 2 seconds
                    setTimeout(() => {
                        field.style.borderColor = '';
                    }, 2000);
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Here you would typically send the data to your server
            alert('Thank you for your application! We will review your information and contact you soon.');
            this.reset();
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Initial display
    displayNGOs();
});