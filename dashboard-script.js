// Financial Dashboard Interactivity

// Stock chart data - November 1-14, 2024
const stockChartData = {
    TSLA: {
        dates: ['2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05', '2024-11-06', '2024-11-07', '2024-11-08', '2024-11-09', '2024-11-10', '2024-11-11', '2024-11-12', '2024-11-13', '2024-11-14'],
        prices: [246.20, 245.80, 245.40, 244.90, 244.50, 243.80, 243.20, 242.80, 242.40, 242.10, 241.80, 242.00, 242.20, 242.60]
    },
    AAPL: {
        dates: ['2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05', '2024-11-06', '2024-11-07', '2024-11-08', '2024-11-09', '2024-11-10', '2024-11-11', '2024-11-12', '2024-11-13', '2024-11-14'],
        prices: [168.50, 169.80, 170.20, 171.50, 171.80, 173.00, 173.40, 174.60, 175.20, 176.10, 176.80, 177.20, 177.80, 178.50]
    },
    MSFT: {
        dates: ['2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05', '2024-11-06', '2024-11-07', '2024-11-08', '2024-11-09', '2024-11-10', '2024-11-11', '2024-11-12', '2024-11-13', '2024-11-14'],
        prices: [400.10, 400.80, 401.20, 401.80, 402.00, 402.30, 403.10, 403.50, 403.80, 404.20, 404.60, 404.90, 405.10, 405.20]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Financial Dashboard - Ready!');

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterCards(searchTerm);
        });
    }

    // Filter cards based on search term
    function filterCards(searchTerm) {
        const newsCards = document.querySelectorAll('.news-card');
        const stockCards = document.querySelectorAll('.stock-card');

        // Filter news cards
        newsCards.forEach(card => {
            const title = card.querySelector('.news-title').textContent.toLowerCase();
            const description = card.querySelector('.news-description').textContent.toLowerCase();
            const source = card.querySelector('.news-source').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm) || source.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // Filter stock cards
        stockCards.forEach(card => {
            const symbol = card.querySelector('.stock-symbol').textContent.toLowerCase();
            const name = card.querySelector('.stock-name').textContent.toLowerCase();

            if (symbol.includes(searchTerm) || name.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Read More button clicks
    const readMoreButtons = document.querySelectorAll('.read-more-button');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.news-card');
            const title = card.querySelector('.news-title').textContent;
            console.log('Read more clicked for:', title);
            // You can add navigation or modal logic here
            alert(`Opening article: ${title}`);
        });
    });

    // Bookmark buttons
    const bookmarkButtons = document.querySelectorAll('.action-bookmark');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            button.classList.toggle('bookmarked');

            // Visual feedback
            const isBookmarked = button.classList.contains('bookmarked');
            if (isBookmarked) {
                button.style.backgroundColor = 'var(--color-black)';
                console.log('Bookmarked');
            } else {
                button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                console.log('Bookmark removed');
            }
        });
    });

    // Share buttons
    const shareButtons = document.querySelectorAll('.action-share');
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.target.closest('.news-card, .stock-card');

            if (card.classList.contains('news-card')) {
                const title = card.querySelector('.news-title').textContent;
                console.log('Share clicked for news:', title);

                // Web Share API if available
                if (navigator.share) {
                    navigator.share({
                        title: title,
                        text: card.querySelector('.news-description').textContent,
                        url: window.location.href
                    }).catch(err => console.log('Share cancelled'));
                } else {
                    alert(`Share: ${title}`);
                }
            } else if (card.classList.contains('stock-card')) {
                const symbol = card.querySelector('.stock-symbol').textContent;
                console.log('Share clicked for stock:', symbol);

                if (navigator.share) {
                    navigator.share({
                        title: `${symbol} Stock`,
                        text: `Check out ${symbol} on FinBoard`,
                        url: window.location.href
                    }).catch(err => console.log('Share cancelled'));
                } else {
                    alert(`Share: ${symbol}`);
                }
            }
        });
    });

    // Portfolio button
    const portfolioButton = document.querySelector('.portfolio-button');
    if (portfolioButton) {
        portfolioButton.addEventListener('click', () => {
            console.log('Portfolio clicked');
            alert('Opening My Portfolio...');
        });
    }

    // FAB (Floating Action Button)
    const fab = document.querySelector('.fab');
    if (fab) {
        fab.addEventListener('click', () => {
            console.log('FAB clicked');
            alert('Add new card or create alert...');
        });
    }

    // Stock cards click
    const stockCards = document.querySelectorAll('.stock-card');
    stockCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking action buttons
            if (e.target.closest('.action-button')) return;

            const symbol = card.querySelector('.stock-symbol').textContent;
            console.log('Stock card clicked:', symbol);
            alert(`Opening detailed view for ${symbol}`);
        });
    });

    // News cards click
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking action buttons or read more button
            if (e.target.closest('.action-button') || e.target.closest('.read-more-button')) return;

            const title = card.querySelector('.news-title').textContent;
            console.log('News card clicked:', title);
        });
    });

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Track scroll for header shadow
    let lastScroll = 0;
    const header = document.querySelector('.app-header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 10) {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Simulate real-time stock updates (demo)
    function simulateStockUpdates() {
        const stockPrices = document.querySelectorAll('.stock-price');

        stockPrices.forEach(priceElement => {
            // This is just a demo - in a real app, you'd fetch from an API
            setInterval(() => {
                const currentPrice = parseFloat(priceElement.textContent.replace('$', ''));
                const change = (Math.random() - 0.5) * 0.1;
                const newPrice = (currentPrice + change).toFixed(2);
                // Uncomment below to see live updates (disabled by default)
                // priceElement.textContent = `$${newPrice}`;
            }, 5000);
        });
    }

    // Uncomment to enable simulated updates
    // simulateStockUpdates();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Focus search with '/' key
        if (e.key === '/' && !e.target.matches('input')) {
            e.preventDefault();
            searchInput.focus();
        }

        // Clear search with 'Escape' key
        if (e.key === 'Escape' && searchInput === document.activeElement) {
            searchInput.value = '';
            filterCards('');
            searchInput.blur();
        }
    });

    console.log('Tip: Press "/" to focus search, "Escape" to clear');

    // Initialize stock chart axes
    initializeChartAxes();

    // Initialize stock chart hover functionality
    initializeChartHover();
});

// Initialize Chart Axes
function initializeChartAxes() {
    const stockCharts = document.querySelectorAll('.stock-chart');

    stockCharts.forEach(chart => {
        const stockSymbol = chart.dataset.stock;
        const yAxisLabels = chart.querySelector('.y-axis-labels');
        const xAxisLabels = chart.querySelector('.x-axis-labels');

        if (!stockChartData[stockSymbol]) {
            console.warn(`No data found for ${stockSymbol}`);
            return;
        }

        const data = stockChartData[stockSymbol];

        // Generate Y-axis labels (price range)
        const minPrice = Math.min(...data.prices);
        const maxPrice = Math.max(...data.prices);
        const priceRange = maxPrice - minPrice;
        const numberOfYLabels = 5;

        // Create Y-axis labels
        for (let i = 0; i < numberOfYLabels; i++) {
            const label = document.createElement('div');
            label.className = 'y-axis-label';
            const price = maxPrice - (priceRange * i / (numberOfYLabels - 1));
            label.textContent = `$${price.toFixed(0)}`;
            yAxisLabels.appendChild(label);
        }

        // Generate X-axis labels (time duration)
        // Show 4 evenly spaced dates: Nov 1, Nov 5, Nov 10, Nov 14
        const xLabelIndices = [0, Math.floor(data.dates.length / 3), Math.floor(2 * data.dates.length / 3), data.dates.length - 1];

        xLabelIndices.forEach(index => {
            const label = document.createElement('div');
            label.className = 'x-axis-label';
            // Format date as "Nov 1", "Nov 5", etc.
            const dateStr = data.dates[index];
            const date = new Date(dateStr);
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            label.textContent = formattedDate;
            label.style.flex = '1';
            xAxisLabels.appendChild(label);
        });
    });
}

// Stock Chart Hover Functionality
function initializeChartHover() {
    const stockCharts = document.querySelectorAll('.stock-chart');

    stockCharts.forEach(chart => {
        const stockSymbol = chart.dataset.stock;
        const chartArea = chart.querySelector('.chart-area');
        const tooltip = chart.querySelector('.chart-tooltip');
        const crosshair = chart.querySelector('.chart-crosshair');
        const tooltipPrice = tooltip.querySelector('.tooltip-price');
        const tooltipDate = tooltip.querySelector('.tooltip-date');

        if (!stockChartData[stockSymbol]) {
            console.warn(`No data found for ${stockSymbol}`);
            return;
        }

        const data = stockChartData[stockSymbol];
        const dataPoints = data.prices.length;

        // Mouse enter - show tooltip and crosshair
        chartArea.addEventListener('mouseenter', () => {
            tooltip.classList.add('visible');
            crosshair.classList.add('visible');
        });

        // Mouse leave - hide tooltip and crosshair
        chartArea.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            crosshair.classList.remove('visible');
        });

        // Mouse move - update tooltip position and data
        chartArea.addEventListener('mousemove', (e) => {
            const rect = chartArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate which data point we're closest to based on X position
            const chartWidth = rect.width;
            const pointWidth = chartWidth / (dataPoints - 1);
            const index = Math.round(x / pointWidth);
            const clampedIndex = Math.max(0, Math.min(dataPoints - 1, index));

            // Get the price and date for this point
            const price = data.prices[clampedIndex];
            const dateStr = data.dates[clampedIndex];

            // Format date for tooltip
            const date = new Date(dateStr);
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            // Update tooltip content
            tooltipPrice.textContent = `$${price.toFixed(2)}`;
            tooltipDate.textContent = formattedDate;

            // Position tooltip
            const tooltipX = (clampedIndex / (dataPoints - 1)) * chartWidth;
            tooltip.style.left = `${tooltipX}px`;
            tooltip.style.top = `${Math.max(10, y - 10)}px`;

            // Position crosshair
            crosshair.style.left = `${tooltipX}px`;

            // Calculate Y position for the dot on the crosshair based on price
            const minPrice = Math.min(...data.prices);
            const maxPrice = Math.max(...data.prices);
            const priceRange = maxPrice - minPrice;
            const pricePercent = (price - minPrice) / priceRange;

            // Chart area typically starts around 10% from top and ends 20% from bottom
            // to account for labels
            const chartAreaHeight = rect.height * 0.7;
            const chartAreaTop = rect.height * 0.15;
            const dotY = chartAreaTop + (chartAreaHeight * (1 - pricePercent));

            crosshair.style.setProperty('--crosshair-y', `${dotY}px`);
        });

        // Prevent chart click from triggering card click
        chartArea.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// Helper function to interpolate between data points for smoother tooltip
function interpolatePrice(data, normalizedX) {
    const dataLength = data.prices.length;
    const exactIndex = normalizedX * (dataLength - 1);
    const lowerIndex = Math.floor(exactIndex);
    const upperIndex = Math.ceil(exactIndex);

    if (lowerIndex === upperIndex) {
        return {
            price: data.prices[lowerIndex],
            date: data.dates[lowerIndex]
        };
    }

    const fraction = exactIndex - lowerIndex;
    const interpolatedPrice = data.prices[lowerIndex] +
        (data.prices[upperIndex] - data.prices[lowerIndex]) * fraction;

    return {
        price: interpolatedPrice,
        date: data.dates[lowerIndex]
    };
}
