// Seed analysis standards
const seedStandards = {
    sizeGrades: {
        'A': { minLength: 8, maxLength: 10, minWidth: 5, maxWidth: 6.5 },
        'B': { minLength: 7, maxLength: 9, minWidth: 4.5, maxWidth: 5.5 },
        'C': { minLength: 6, maxLength: 8, minWidth: 4, maxWidth: 5 }
    },
    
    qualityGrades: {
        'A': { 
            minWeight: 14, 
            maxWeight: 16,
            color: ['dark-brown'],
            minUniformity: 95,
            maxDamage: 1
        },
        'B': { 
            minWeight: 12, 
            maxWeight: 14,
            color: ['medium-brown', 'dark-brown'],
            minUniformity: 85,
            maxDamage: 3
        },
        'C': { 
            minWeight: 10, 
            maxWeight: 12,
            color: ['light-brown', 'medium-brown', 'mixed'],
            minUniformity: 75,
            maxDamage: 5
        }
    }
};

// DOM Elements
const manualInputForm = document.getElementById('manual-input-form');
const imagePreviewContainer = document.getElementById('image-preview-container');
const resultsContainer = document.getElementById('results-container');
const uniformitySlider = document.getElementById('seed-uniformity');
const uniformityValue = document.getElementById('uniformity-value');
const damageSlider = document.getElementById('seed-damage');
const damageValue = document.getElementById('damage-value');

// Event Listeners
uniformitySlider.addEventListener('input', (e) => {
    uniformityValue.textContent = ${e.target.value};
});

damageSlider.addEventListener('input', (e) => {
    damageValue.textContent = ${e.target.value};
});

// Input Methods
function showManualInput() {
    manualInputForm.style.display = 'block';
    imagePreviewContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
}

function triggerImageUpload() {
    document.getElementById('seed-image').click();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImage = document.getElementById('preview-image');
            previewImage.src = e.target.result;
            manualInputForm.style.display = 'none';
            imagePreviewContainer.style.display = 'block';
            resultsContainer.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
}

// Analysis Functions
function analyzeSeeds() {
    // Get input values
    const length = parseFloat(document.getElementById('seed-length').value);
    const width = parseFloat(document.getElementById('seed-width').value);
    const weight = parseFloat(document.getElementById('seed-weight').value);
    const color = document.getElementById('seed-color').value;
    const uniformity = parseInt(document.getElementById('seed-uniformity').value);
    const damage = parseInt(document.getElementById('seed-damage').value);
    
    // Validate inputs
    if (!length || !width || !weight || !color) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Analyze size grade
    const sizeGrade = getSizeGrade(length, width);
    
    // Analyze quality grade
    const qualityGrade = getQualityGrade(weight, color, uniformity, damage);
    
    // Determine overall classification
    const overallClass = getOverallClassification(sizeGrade, qualityGrade);
    
    // Display results
    displayResults(sizeGrade, qualityGrade, overallClass, {
        length, width, weight, color, uniformity, damage
    });
}

function analyzeImage() {
    // Simulate image analysis - in real implementation, use image processing
    const simulatedData = {
        length: 8.5,
        width: 5.2,
        weight: 15.3,
        color: 'dark-brown',
        uniformity: 92,
        damage: 2
    };
    
    const sizeGrade = getSizeGrade(simulatedData.length, simulatedData.width);
    const qualityGrade = getQualityGrade(
        simulatedData.weight, 
        simulatedData.color, 
        simulatedData.uniformity, 
        simulatedData.damage
    );
    const overallClass = getOverallClassification(sizeGrade, qualityGrade);
    
    displayResults(sizeGrade, qualityGrade, overallClass, simulatedData);
}

function getSizeGrade(length, width) {
    if (length >= 8 && width >= 5) return 'A';
    if (length >= 7 && width >= 4.5) return 'B';
    return 'C';
}

function getQualityGrade(weight, color, uniformity, damage) {
    if (weight >= 14 && uniformity >= 95 && damage <= 1 && color === 'dark-brown') return 'A';
    if (weight >= 12 && uniformity >= 85 && damage <= 3 && 
        ['dark-brown', 'medium-brown'].includes(color)) return 'B';
    return 'C';
}

function getOverallClassification(sizeGrade, qualityGrade) {
    const grades = { 'A': 3, 'B': 2, 'C': 1 };
    const totalScore = grades[sizeGrade] + grades[qualityGrade];
    
    if (totalScore >= 5) return 'Premium';
    if (totalScore >= 4) return 'Standard';
    return 'Regular';
}

function displayResults(sizeGrade, qualityGrade, overallClass, data) {
    // Update grade displays
    document.getElementById('size-grade').textContent = sizeGrade;
    document.getElementById('size-grade').className = grade-display grade-${sizeGrade.toLowerCase()};
    
    document.getElementById('quality-grade').textContent = qualityGrade;
    document.getElementById('quality-grade').className = grade-display grade-${qualityGrade.toLowerCase()};
    
    document.getElementById('overall-class').textContent = overallClass;
    
    // Update details
    document.getElementById('size-details').textContent = 
        Length: ${data.length}mm, Width: ${data.width}mm;
    
    document.getElementById('quality-details').textContent = 
        Weight: ${data.weight}g/100 seeds, Uniformity: ${data.uniformity}%;
    
    document.getElementById('class-details').textContent = 
        Suitable for ${getRecommendedUse(overallClass)};
    
    // Update metrics table
    updateMetricsTable(data);
    
    // Update recommendations
    updateRecommendations(data, sizeGrade, qualityGrade);
    
    // Show results
    resultsContainer.style.display = 'block';
}

function updateMetricsTable(data) {
    const tableBody = document.getElementById('metrics-table');
    tableBody.innerHTML = '';
    
    const metrics = [
        { param: 'Seed Length', value: ${data.length} mm, standard: '8-10mm (A)', status: data.length >= 8 ? '✓ Pass' : '✗ Fail' },
        { param: 'Seed Width', value: ${data.width} mm, standard: '5-6.5mm (A)', status: data.width >= 5 ? '✓ Pass' : '✗ Fail' },
        { param: 'Weight Density', value: ${data.weight} g/100 seeds, standard: '14-16g (A)', status: data.weight >= 14 ? '✓ Pass' : '✗ Fail' },
        { param: 'Color Grade', value: formatColor(data.color), standard: 'Dark Brown', status: data.color === 'dark-brown' ? '✓ Pass' : '⚠ Acceptable' },
        { param: 'Uniformity', value: ${data.uniformity}%, standard: '≥95%', status: data.uniformity >= 95 ? '✓ Pass' : '⚠ Acceptable' },
        { param: 'Damage/Impurities', value: ${data.damage}%, standard: '≤1%', status: data.damage <= 1 ? '✓ Pass' : '⚠ Acceptable' }
    ];
    
    metrics.forEach(metric => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${metric.param}</td>
            <td>${metric.value}</td>
            <td>${metric.standard}</td>
            <td>${metric.status}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateRecommendations(data, sizeGrade, qualityGrade) {
    const list = document.getElementById('recommendations-list');
    list.innerHTML = '';
    
    let recommendations = [];
    
    if (sizeGrade === 'A' && qualityGrade === 'A') {
        recommendations = [
            'Export quality - suitable for international markets',
            'Certified planting material',
            'Premium pricing recommended'
        ];
    } else if (sizeGrade === 'B' && qualityGrade === 'B') {
        recommendations = [
            'Commercial farming suitable',
            'Good for oil extraction',
            'Standard market pricing'
        ];
    } else {
        recommendations = [
            'Best for local markets',
            'Suitable for industrial processing',
            'Consider for value-added products'
        ];
    }
    
    if (data.damage > 3) {
        recommendations.push('Consider additional cleaning to reduce impurities');
    }
    
    if (data.uniformity < 85) {
        recommendations.push('Improve sorting process for better uniformity');
    }
    
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        list.appendChild(li);
    });
}

function formatColor(color) {
    const colorMap = {
        'dark-brown': 'Dark Brown',
        'medium-brown': 'Medium Brown',
        'light-brown': 'Light Brown',
        'mixed': 'Mixed Colors'
    };
    return colorMap[color] || color;
}

function getRecommendedUse(classification) {
    const uses = {
        'Premium': 'export and certified planting',
        'Standard': 'commercial farming and processing',
        'Regular': 'local markets and industrial use'
    };
    return uses[classification] || 'general use';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior:
                    'smooth' });
                }
            });
        });
        //initialize range values
    uniformityValue.textContent = {uniformitySlider.value};
    damageValue.textContent = ${damageSlider.value};
});
