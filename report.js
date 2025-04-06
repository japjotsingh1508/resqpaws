document.addEventListener('DOMContentLoaded', function() {
    // Reporting form elements
    const reportForm = document.getElementById('stray-report-form');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const uploadArea = document.getElementById('upload-area');
    const animalPhoto = document.getElementById('animal-photo');
    const imagePreview = document.getElementById('image-preview');
    const previewImage = document.getElementById('preview-image');
    const removeImage = document.getElementById('remove-image');
    const useCurrentLocation = document.getElementById('use-current-location');
    const selectOnMap = document.getElementById('select-on-map');
    const mapContainer = document.getElementById('map-container');
    const mapSearch = document.getElementById('map-search');
    const searchButton = document.getElementById('search-button');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const aiModal = document.getElementById('ai-modal');
    const aiProgressFill = document.getElementById('ai-progress-fill');
    const aiFindings = document.getElementById('ai-findings');
    const successModal = document.getElementById('success-modal');
    const successDetails = document.getElementById('success-details');
    const trackReportBtn = document.getElementById('track-report');
    const newReportBtn = document.getElementById('new-report');
    
    let currentStep = 0;
    let map;
    let marker;
    
    // Initialize form steps
    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update current step
        currentStep = stepIndex;
    }
    
    // Next button click
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                showStep(currentStep + 1);
                
                // Initialize map when reaching step 3
                if (currentStep === 2 && !map) {
                    initMap();
                }
            }
        });
    });
    
    // Previous button click
    prevButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showStep(currentStep - 1);
        });
    });
    
    // Validate form step
    function validateStep(stepIndex) {
        let isValid = true;
        const currentStep = formSteps[stepIndex];
        const inputs = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--error-color)';
                isValid = false;
                
                // Remove error highlight after 2 seconds
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 2000);
            }
        });
        
        // Special validation for image upload
        if (stepIndex === 1 && !previewImage.src.includes('#')) {
            alert('Please upload a photo of the animal');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Image upload functionality
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            animalPhoto.click();
        });
        
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--primary-color)';
            this.style.backgroundColor = 'rgba(255, 127, 0, 0.05)';
        });
        
        uploadArea.addEventListener('dragleave', function() {
            this.style.borderColor = '';
            this.style.backgroundColor = '';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.backgroundColor = '';
            
            if (e.dataTransfer.files.length) {
                animalPhoto.files = e.dataTransfer.files;
                handleImageUpload(animalPhoto.files[0]);
            }
        });
    }
    
    if (animalPhoto) {
        animalPhoto.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                handleImageUpload(this.files[0]);
            }
        });
    }
    
    function handleImageUpload(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            uploadArea.style.display = 'none';
            imagePreview.style.display = 'block';
        }
        
        reader.readAsDataURL(file);
    }
    
    if (removeImage) {
        removeImage.addEventListener('click', function() {
            previewImage.src = '#';
            animalPhoto.value = '';
            uploadArea.style.display = 'block';
            imagePreview.style.display = 'none';
        });
    }
    
    // Location functionality
    if (useCurrentLocation) {
        useCurrentLocation.addEventListener('click', function() {
            if (navigator.geolocation) {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
                
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        useCurrentLocation.innerHTML = '<i class="fas fa-location-arrow"></i> Use My Current Location';
                        latitudeInput.value = position.coords.latitude;
                        longitudeInput.value = position.coords.longitude;
                        
                        // Show map
                        mapContainer.style.display = 'block';
                        
                        // Initialize map if not already done
                        if (!map) {
                            initMap();
                        }
                        
                        // Set marker at current location
                        if (marker) {
                            map.removeLayer(marker);
                        }
                        
                        marker = L.marker([position.coords.latitude, position.coords.longitude], {
                            draggable: true
                        }).addTo(map);
                        
                        map.setView([position.coords.latitude, position.coords.longitude], 15);
                        
                        // Update location description
                        const locationDesc = document.getElementById('location-description');
                        if (locationDesc.value.trim() === '') {
                            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                                .then(response => response.json())
                                .then(data => {
                                    if (data.display_name) {
                                        locationDesc.value = data.display_name;
                                    }
                                });
                        }
                        
                        // Update marker position when dragged
                        marker.on('dragend', function() {
                            const newPos = marker.getLatLng();
                            latitudeInput.value = newPos.lat;
                            longitudeInput.value = newPos.lng;
                        });
                    },
                    function(error) {
                        useCurrentLocation.innerHTML = '<i class="fas fa-location-arrow"></i> Use My Current Location';
                        alert('Unable to retrieve your location: ' + error.message);
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser');
            }
        });
    }
    
    if (selectOnMap) {
        selectOnMap.addEventListener('click', function() {
            mapContainer.style.display = 'block';
            
            if (!map) {
                initMap();
            }
            
            // Set default view if no location selected
            if (!latitudeInput.value || !longitudeInput.value) {
                map.setView([20.5937, 78.9629], 5); // Default to India view
            }
        });
    }
    
    // Initialize map
    function initMap() {
        map = L.map('map').setView([20.5937, 78.9629], 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add click event to set marker
        map.on('click', function(e) {
            if (marker) {
                map.removeLayer(marker);
            }
            
            marker = L.marker(e.latlng, {
                draggable: true
            }).addTo(map);
            
            latitudeInput.value = e.latlng.lat;
            longitudeInput.value = e.latlng.lng;
            
            // Update marker position when dragged
            marker.on('dragend', function() {
                const newPos = marker.getLatLng();
                latitudeInput.value = newPos.lat;
                longitudeInput.value = newPos.lng;
            });
        });
    }
    
    // Map search functionality
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const query = mapSearch.value.trim();
            
            if (query) {
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            const lat = parseFloat(data[0].lat);
                            const lon = parseFloat(data[0].lon);
                            
                            if (marker) {
                                map.removeLayer(marker);
                            }
                            
                            marker = L.marker([lat, lon], {
                                draggable: true
                            }).addTo(map);
                            
                            map.setView([lat, lon], 15);
                            
                            latitudeInput.value = lat;
                            longitudeInput.value = lon;
                            
                            // Update location description
                            const locationDesc = document.getElementById('location-description');
                            locationDesc.value = data[0].display_name;
                            
                            // Update marker position when dragged
                            marker.on('dragend', function() {
                                const newPos = marker.getLatLng();
                                latitudeInput.value = newPos.lat;
                                longitudeInput.value = newPos.lng;
                            });
                        } else {
                            alert('Location not found');
                        }
                    });
            }
        });
    }
    
    // Form submission
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show AI processing modal
            aiModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Simulate AI processing
            simulateAIProcessing();
        });
    }
    
    // Simulate AI processing with progress
    function simulateAIProcessing() {
        let progress = 0;
        const steps = ['step-analyzing', 'step-classifying', 'step-locating', 'step-notifying'];
        let currentStepIndex = 0;
        
        const interval = setInterval(() => {
            progress += 5;
            aiProgressFill.style.width = `${progress}%`;
            
            // Update active step
            if (progress >= 25 * (currentStepIndex + 1) && currentStepIndex < steps.length) {
                document.getElementById(steps[currentStepIndex]).classList.add('active');
                currentStepIndex++;
            }
            
            // Complete processing
            if (progress >= 100) {
                clearInterval(interval);
                
                // Display AI findings
                displayAIFindings();
                
                // Show success modal after a delay
                setTimeout(() => {
                    aiModal.classList.remove('active');
                    showSuccessModal();
                }, 1500);
            }
        }, 150);
    }
    
    // Display AI findings
    function displayAIFindings() {
        const animalType = document.getElementById('animal-type').value || 'animal';
        const conditions = Array.from(document.querySelectorAll('input[name="condition"]:checked')).map(c => c.value);
        
        let severity = 'Moderate';
        if (conditions.includes('injured') || conditions.includes('abused')) {
            severity = 'High';
        } else if (conditions.includes('trapped')) {
            severity = 'Critical';
        }
        
        aiFindings.innerHTML = `
            <h4>AI Analysis Results</h4>
            <ul>
                <li><strong>Animal Type:</strong> ${animalType}</li>
                <li><strong>Conditions Detected:</strong> ${conditions.join(', ') || 'None specified'}</li>
                <li><strong>Severity Level:</strong> ${severity}</li>
                <li><strong>Recommended Action:</strong> ${severity === 'Critical' ? 'Immediate rescue required' : 'Urgent attention recommended'}</li>
            </ul>
        `;
    }
    
    // Show success modal
    function showSuccessModal() {
        const reporterName = document.getElementById('reporter-name').value || 'User';
        const animalType = document.getElementById('animal-type').value || 'animal';
        const location = document.getElementById('location-description').value || 'the reported location';
        
        successDetails.innerHTML = `
            <p><span>Report ID:</span> <span>RP-${Date.now().toString().slice(-6)}</span></p>
            <p><span>Animal Type:</span> <span>${animalType}</span></p>
            <p><span>Location:</span> <span>${location}</span></p>
            <p><span>Status:</span> <span>NGO notified - rescue team dispatched</span></p>
            <p><span>Expected Response Time:</span> <span>30-45 minutes</span></p>
        `;
        
        successModal.classList.add('active');
    }
    
    // Track report button
    if (trackReportBtn) {
        trackReportBtn.addEventListener('click', function() {
            alert('In a real application, this would redirect to the case tracking page');
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // New report button
    if (newReportBtn) {
        newReportBtn.addEventListener('click', function() {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
            reportForm.reset();
            showStep(0);
            
            // Reset image preview
            previewImage.src = '#';
            uploadArea.style.display = 'block';
            imagePreview.style.display = 'none';
            
            // Reset map
            if (map && marker) {
                map.removeLayer(marker);
                marker = null;
            }
            mapContainer.style.display = 'none';
            latitudeInput.value = '';
            longitudeInput.value = '';
        });
    }
    
    // Close modals when clicking outside
    aiModal.addEventListener('click', function(e) {
        if (e.target === aiModal) {
            aiModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});