// Sidebar History and Suggestions

// Database of all possible content (for generating suggestions)
const contentDatabase = {
    news: [
        {
            id: 'news-pool-1',
            title: 'Central Banks Signal Coordinated Policy Shift',
            source: 'The Economist',
            category: 'Markets',
            summary: 'Major central banks hint at synchronized monetary policy changes in response to global economic indicators.'
        },
        {
            id: 'news-pool-2',
            title: 'AI Chip Demand Surges Beyond Expectations',
            source: 'TechCrunch',
            category: 'Technology',
            summary: 'Semiconductor manufacturers struggle to meet unprecedented demand for AI-specific processing chips.'
        },
        {
            id: 'news-pool-3',
            title: 'Electric Vehicle Sales Hit New Record',
            source: 'Reuters',
            category: 'Technology',
            summary: 'Global EV adoption accelerates as battery costs decline and charging infrastructure expands.'
        },
        {
            id: 'news-pool-4',
            title: 'Banking Sector Faces Regulatory Changes',
            source: 'Financial Times',
            category: 'Markets',
            summary: 'New capital requirements and stress tests announced for major financial institutions.'
        },
        {
            id: 'news-pool-5',
            title: 'Renewable Energy Investment Doubles',
            source: 'Bloomberg',
            category: 'Economy',
            summary: 'Clean energy sector attracts record capital as governments accelerate climate commitments.'
        },
        {
            id: 'news-pool-6',
            title: 'Digital Currency Trials Expand Globally',
            source: 'CoinDesk',
            category: 'Crypto',
            summary: 'Central bank digital currency pilots show promising results in multiple countries.'
        },
        {
            id: 'news-pool-7',
            title: 'Manufacturing Output Exceeds Forecasts',
            source: 'Wall Street Journal',
            category: 'Economy',
            summary: 'Industrial production data suggests stronger economic recovery than anticipated.'
        },
        {
            id: 'news-pool-8',
            title: 'Cloud Computing Market Consolidation',
            source: 'The Verge',
            category: 'Technology',
            summary: 'Major cloud providers expand market share through strategic acquisitions and partnerships.'
        },
    ],
    stocks: [
        {
            id: 'stock-pool-1',
            symbol: 'GOOGL',
            name: 'Alphabet Inc.',
            sector: 'Technology'
        },
        {
            id: 'stock-pool-2',
            symbol: 'AMZN',
            name: 'Amazon.com Inc.',
            sector: 'Technology'
        },
        {
            id: 'stock-pool-3',
            symbol: 'META',
            name: 'Meta Platforms Inc.',
            sector: 'Technology'
        },
        {
            id: 'stock-pool-4',
            symbol: 'NVDA',
            name: 'NVIDIA Corporation',
            sector: 'Technology'
        },
        {
            id: 'stock-pool-5',
            symbol: 'JPM',
            name: 'JPMorgan Chase',
            sector: 'Finance'
        },
        {
            id: 'stock-pool-6',
            symbol: 'BAC',
            name: 'Bank of America',
            sector: 'Finance'
        },
        {
            id: 'stock-pool-7',
            symbol: 'DIS',
            name: 'The Walt Disney Company',
            sector: 'Entertainment'
        },
        {
            id: 'stock-pool-8',
            symbol: 'V',
            name: 'Visa Inc.',
            sector: 'Finance'
        },
    ]
};

// State
let viewHistory = [];
let suggestions = [];
let displayedCardIds = new Set(); // Track what's currently on the dashboard

// Initialize sidebar
function initializeSidebar() {
    // Get all current card IDs on the dashboard
    document.querySelectorAll('.news-card, .stock-card').forEach(card => {
        const cardId = getCardIdentifier(card);
        displayedCardIds.add(cardId);
    });

    // Add click listeners to all cards
    attachCardClickListeners();

    console.log('Sidebar initialized with', displayedCardIds.size, 'displayed cards');
}

// Get unique identifier for a card
function getCardIdentifier(card) {
    if (card.classList.contains('news-card')) {
        const title = card.querySelector('.news-title')?.textContent || '';
        return `news-${title.substring(0, 30)}`;
    } else {
        const symbol = card.querySelector('.stock-symbol')?.textContent || '';
        return `stock-${symbol}`;
    }
}

// Attach click listeners to cards
function attachCardClickListeners() {
    // News cards
    document.querySelectorAll('.news-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger on button clicks
            if (e.target.closest('.action-button') || e.target.closest('.read-more-button')) {
                return;
            }

            const title = card.querySelector('.news-title')?.textContent || '';
            const source = card.querySelector('.news-source')?.textContent || '';
            const category = card.querySelector('.badge')?.textContent || '';

            addToHistory({
                id: getCardIdentifier(card),
                type: 'news',
                title: title,
                subtitle: source,
                category: category.trim()
            });
        });
    });

    // Stock cards
    document.querySelectorAll('.stock-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger on chart hover
            if (e.target.closest('.chart-area')) {
                return;
            }

            const symbol = card.querySelector('.stock-symbol')?.textContent || '';
            const name = card.querySelector('.stock-name')?.textContent || '';

            addToHistory({
                id: getCardIdentifier(card),
                type: 'stock',
                title: symbol,
                subtitle: name,
                category: 'Technology' // Could be derived from data
            });
        });
    });
}

// Add item to history
function addToHistory(item) {
    const now = new Date();

    // Don't add if it's already the most recent item
    if (viewHistory.length > 0 && viewHistory[viewHistory.length - 1].id === item.id) {
        return;
    }

    // Add to history
    const historyItem = {
        ...item,
        timestamp: now
    };

    viewHistory.push(historyItem);

    // Generate suggestions for this item
    generateSuggestions(historyItem);

    // Update UI
    updateSidebarUI();

    console.log('Added to history:', item.title);
}

// Generate suggestions based on viewed item
function generateSuggestions(viewedItem) {
    const newSuggestions = [];

    // Get items that are NOT currently displayed on the dashboard
    if (viewedItem.type === 'news') {
        // Find related news in the same category
        const relatedNews = contentDatabase.news.filter(news => {
            const newsId = `news-${news.title.substring(0, 30)}`;
            return news.category === viewedItem.category &&
                   !displayedCardIds.has(newsId) &&
                   !suggestions.some(s => s.id === news.id);
        }).slice(0, 2);

        relatedNews.forEach(news => {
            newSuggestions.push({
                id: news.id,
                type: 'news',
                title: news.title,
                subtitle: news.source,
                relatedTo: viewedItem.id,
                data: news
            });
        });

        // Find a related stock
        const techStocks = contentDatabase.stocks.filter(stock => {
            const stockId = `stock-${stock.symbol}`;
            return stock.sector === 'Technology' &&
                   !displayedCardIds.has(stockId) &&
                   !suggestions.some(s => s.id === stock.id);
        }).slice(0, 1);

        techStocks.forEach(stock => {
            newSuggestions.push({
                id: stock.id,
                type: 'stock',
                title: stock.symbol,
                subtitle: stock.name,
                relatedTo: viewedItem.id,
                data: stock
            });
        });
    } else {
        // For stocks, suggest other stocks and related news
        const otherStocks = contentDatabase.stocks.filter(stock => {
            const stockId = `stock-${stock.symbol}`;
            return stockId !== viewedItem.id &&
                   !displayedCardIds.has(stockId) &&
                   !suggestions.some(s => s.id === stock.id);
        }).slice(0, 2);

        otherStocks.forEach(stock => {
            newSuggestions.push({
                id: stock.id,
                type: 'stock',
                title: stock.symbol,
                subtitle: stock.name,
                relatedTo: viewedItem.id,
                data: stock
            });
        });

        // Find tech or market news
        const relatedNews = contentDatabase.news.filter(news => {
            const newsId = `news-${news.title.substring(0, 30)}`;
            return (news.category === 'Technology' || news.category === 'Markets') &&
                   !displayedCardIds.has(newsId) &&
                   !suggestions.some(s => s.id === news.id);
        }).slice(0, 1);

        relatedNews.forEach(news => {
            newSuggestions.push({
                id: news.id,
                type: 'news',
                title: news.title,
                subtitle: news.source,
                relatedTo: viewedItem.id,
                data: news
            });
        });
    }

    // Add new suggestions
    suggestions.push(...newSuggestions);

    console.log('Generated', newSuggestions.length, 'new suggestions for', viewedItem.title);
}

// Update sidebar UI
function updateSidebarUI() {
    const emptyState = document.querySelector('.sidebar-empty-state');
    const timeline = document.querySelector('.history-timeline');
    const countElement = document.querySelector('.sidebar-count');

    // Update count
    countElement.textContent = `${viewHistory.length} ${viewHistory.length === 1 ? 'item' : 'items'} viewed`;

    // Show/hide empty state
    if (viewHistory.length === 0) {
        emptyState.style.display = 'flex';
        timeline.classList.remove('has-items');
        return;
    }

    emptyState.style.display = 'none';
    timeline.classList.add('has-items');

    // Clear timeline
    timeline.innerHTML = '<div class="timeline-line"></div>';

    // Render history items
    viewHistory.forEach((item, index) => {
        const itemElement = createHistoryItemElement(item, index);
        timeline.appendChild(itemElement);
    });
}

// Create history item element
function createHistoryItemElement(item, index) {
    const container = document.createElement('div');
    container.className = 'timeline-item';

    // Get icon
    const icon = item.type === 'news'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>';

    const timeSince = getTimeSince(item.timestamp);

    container.innerHTML = `
        <div class="timeline-node">
            <div class="timeline-dot">
                ${icon}
            </div>
            <div class="timeline-content">
                <button class="history-item-button" data-history-index="${index}">
                    <div class="history-item-title">${item.title}</div>
                    <div class="history-item-meta">
                        <span class="history-item-subtitle">${item.subtitle}</span>
                        <span class="history-item-time">${timeSince}</span>
                    </div>
                </button>
            </div>
        </div>
    `;

    // Add suggestions for this item
    const itemSuggestions = suggestions.filter(s => s.relatedTo === item.id);
    if (itemSuggestions.length > 0) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'suggestions-container';

        suggestionsContainer.innerHTML = `
            <div class="suggestions-divider">
                <div class="line"></div>
                <div class="suggestions-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 3v18m9-9H3m15.36-6.36L5.64 18.36m12.72 0L5.64 5.64"/>
                    </svg>
                    Related
                </div>
                <div class="line"></div>
            </div>
        `;

        itemSuggestions.forEach(suggestion => {
            const suggestionEl = createSuggestionElement(suggestion);
            suggestionsContainer.appendChild(suggestionEl);
        });

        container.appendChild(suggestionsContainer);
    }

    return container;
}

// Create suggestion element
function createSuggestionElement(suggestion) {
    const button = document.createElement('button');
    button.className = 'suggestion-item';
    button.dataset.suggestionId = suggestion.id;
    button.dataset.suggestionType = suggestion.type;

    const icon = suggestion.type === 'news'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>';

    button.innerHTML = `
        <div class="suggestion-icon">${icon}</div>
        <div class="suggestion-content">
            <div class="suggestion-title">${suggestion.title}</div>
            <div class="suggestion-subtitle">${suggestion.subtitle}</div>
        </div>
        <div class="suggestion-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5l7 7-7 7"/>
            </svg>
        </div>
    `;

    // Add click handler
    button.addEventListener('click', () => {
        handleSuggestionClick(suggestion);
    });

    return button;
}

// Handle suggestion click
function handleSuggestionClick(suggestion) {
    console.log('Suggestion clicked:', suggestion.title);

    // Add the card to the dashboard
    if (suggestion.type === 'news') {
        addNewsCardToDashboard(suggestion.data);
    } else {
        addStockCardToDashboard(suggestion.data);
    }

    // Mark as displayed
    displayedCardIds.add(suggestion.id);

    // Add to history
    addToHistory({
        id: suggestion.id,
        type: suggestion.type,
        title: suggestion.title,
        subtitle: suggestion.subtitle,
        category: suggestion.data.category || suggestion.data.sector || 'General'
    });

    // Remove this suggestion from the list (it's now on the dashboard)
    suggestions = suggestions.filter(s => s.id !== suggestion.id);

    // Scroll to the new card
    setTimeout(() => {
        const newCard = document.querySelector(`[data-card-id="${suggestion.id}"]`);
        if (newCard) {
            newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            newCard.classList.add('card-highlight');
            setTimeout(() => newCard.classList.remove('card-highlight'), 2000);
        }
    }, 100);
}

// Calculate time since
function getTimeSince(date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

// Add news card to dashboard
function addNewsCardToDashboard(newsData) {
    const cardsGrid = document.querySelector('.cards-grid');
    const firstColumn = cardsGrid.querySelector('.cards-column:first-child');

    const article = document.createElement('article');
    article.className = 'news-card';
    article.dataset.cardId = newsData.id;

    // Generate random time ago
    const timeOptions = ['2h ago', '4h ago', '6h ago', '8h ago', '1d ago'];
    const timeAgo = timeOptions[Math.floor(Math.random() * timeOptions.length)];

    // Use placeholder image or a random unsplash image
    const imageUrl = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop';

    article.innerHTML = `
        <div class="news-image-container">
            <img src="${imageUrl}" alt="${newsData.category}" class="news-image">
            <span class="badge badge-${newsData.category.toLowerCase()}">${newsData.category}</span>
            <div class="card-actions">
                <button class="action-button action-bookmark">
                    <img src="assets/icon-bookmark.svg" alt="Bookmark">
                </button>
                <button class="action-button action-share">
                    <img src="assets/icon-share.svg" alt="Share">
                </button>
            </div>
        </div>
        <div class="news-content">
            <h3 class="news-title">${newsData.title}</h3>
            <p class="news-description">${newsData.summary}</p>
            <div class="news-meta">
                <span class="news-source">${newsData.source}</span>
                <div class="news-time">
                    <img src="assets/icon-clock.svg" alt="Clock" class="time-icon">
                    <span>${timeAgo}</span>
                </div>
            </div>
            <button class="read-more-button">
                <img src="assets/icon-arrow.svg" alt="Arrow" class="read-more-icon">
                Read More
            </button>
        </div>
    `;

    // Insert at the top of the first column
    firstColumn.insertBefore(article, firstColumn.firstChild);

    // Attach click listener to the new card
    article.addEventListener('click', (e) => {
        if (e.target.closest('.action-button') || e.target.closest('.read-more-button')) {
            return;
        }

        addToHistory({
            id: newsData.id,
            type: 'news',
            title: newsData.title,
            subtitle: newsData.source,
            category: newsData.category
        });
    });

    console.log('Added news card:', newsData.title);
}

// Add stock card to dashboard
function addStockCardToDashboard(stockData) {
    const cardsGrid = document.querySelector('.cards-grid');
    const columns = cardsGrid.querySelectorAll('.cards-column');
    // Add to second column for variety
    const targetColumn = columns[1] || columns[0];

    const article = document.createElement('article');
    article.className = 'stock-card';
    article.dataset.cardId = stockData.id;

    // Generate random stock data
    const basePrice = Math.random() * 500 + 100; // Random price between 100-600
    const change = (Math.random() - 0.5) * 20; // Random change -10 to +10
    const changePercent = (change / basePrice) * 100;

    // Generate chart data for the stock
    const chartData = generateStockChartData(basePrice);

    article.innerHTML = `
        <div class="stock-header">
            <div class="stock-info">
                <h3 class="stock-symbol">${stockData.symbol}</h3>
                <span class="badge ${change >= 0 ? 'badge-positive' : 'badge-negative'}">
                    <img src="assets/${change >= 0 ? 'icon-up' : 'icon-down'}.svg" alt="${change >= 0 ? 'Up' : 'Down'}" class="badge-icon">
                    ${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%
                </span>
            </div>
            <div class="card-actions">
                <button class="action-button action-bookmark">
                    <img src="assets/icon-bookmark.svg" alt="Bookmark">
                </button>
                <button class="action-button action-share">
                    <img src="assets/icon-share.svg" alt="Share">
                </button>
            </div>
        </div>
        <p class="stock-name">${stockData.name}</p>
        <div class="stock-price-info">
            <div class="stock-price">$${basePrice.toFixed(2)}</div>
            <div class="stock-change ${change >= 0 ? 'positive' : 'negative'}">${change >= 0 ? '+' : ''}${change.toFixed(2)} today</div>
        </div>
        <div class="stock-chart" data-stock="${stockData.symbol}">
            <div class="chart-y-axis">
                <div class="y-axis-labels"></div>
            </div>
            <div class="chart-area">
                <svg class="chart-image" viewBox="0 0 200 120" preserveAspectRatio="none">
                    ${generateChartSVG(chartData)}
                </svg>
                <div class="chart-tooltip">
                    <div class="tooltip-content">
                        <span class="tooltip-price">$${basePrice.toFixed(2)}</span>
                        <span class="tooltip-date">Nov 14</span>
                    </div>
                    <div class="tooltip-pointer"></div>
                </div>
                <div class="chart-crosshair"></div>
            </div>
            <div class="chart-x-axis">
                <div class="x-axis-labels"></div>
            </div>
        </div>
    `;

    // Insert at the top of the column
    targetColumn.insertBefore(article, targetColumn.firstChild);

    // Initialize chart axes for the new stock card
    initializeNewStockChart(article, stockData.symbol, chartData);

    // Attach click listener to the new card
    article.addEventListener('click', (e) => {
        if (e.target.closest('.chart-area')) {
            return;
        }

        addToHistory({
            id: stockData.id,
            type: 'stock',
            title: stockData.symbol,
            subtitle: stockData.name,
            category: stockData.sector
        });
    });

    console.log('Added stock card:', stockData.symbol);
}

// Generate stock chart data
function generateStockChartData(basePrice) {
    const data = {
        dates: [],
        prices: []
    };

    for (let i = 1; i <= 14; i++) {
        const date = new Date(2024, 10, i); // November 1-14
        data.dates.push(date.toISOString().split('T')[0]);

        // Add some volatility
        const volatility = basePrice * 0.02; // 2% volatility
        const change = (Math.random() - 0.5) * volatility;
        basePrice += change;
        data.prices.push(parseFloat(basePrice.toFixed(2)));
    }

    return data;
}

// Generate SVG path for chart
function generateChartSVG(chartData) {
    const prices = chartData.prices;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    // Generate path
    let path = 'M ';
    prices.forEach((price, index) => {
        const x = (index / (prices.length - 1)) * 200;
        const y = 100 - ((price - minPrice) / priceRange) * 80; // 80 is the usable height
        path += `${x},${y} `;
    });

    return `
        <path d="${path}" fill="none" stroke="#3b82f6" stroke-width="2" />
    `;
}

// Initialize chart for newly added stock card
function initializeNewStockChart(cardElement, symbol, chartData) {
    const chart = cardElement.querySelector('.stock-chart');
    const yAxisLabels = chart.querySelector('.y-axis-labels');
    const xAxisLabels = chart.querySelector('.x-axis-labels');

    // Generate Y-axis labels
    const minPrice = Math.min(...chartData.prices);
    const maxPrice = Math.max(...chartData.prices);
    const priceRange = maxPrice - minPrice;
    const numberOfYLabels = 5;

    for (let i = 0; i < numberOfYLabels; i++) {
        const label = document.createElement('div');
        label.className = 'y-axis-label';
        const price = maxPrice - (priceRange * i / (numberOfYLabels - 1));
        label.textContent = `$${price.toFixed(0)}`;
        yAxisLabels.appendChild(label);
    }

    // Generate X-axis labels
    const xLabelIndices = [0, Math.floor(chartData.dates.length / 3), Math.floor(2 * chartData.dates.length / 3), chartData.dates.length - 1];

    xLabelIndices.forEach(index => {
        const label = document.createElement('div');
        label.className = 'x-axis-label';
        const dateStr = chartData.dates[index];
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        label.textContent = formattedDate;
        label.style.flex = '1';
        xAxisLabels.appendChild(label);
    });

    // Add chart data to stockChartData for hover functionality
    if (typeof stockChartData !== 'undefined') {
        stockChartData[symbol] = chartData;
    }

    // Initialize hover functionality for this chart
    const chartArea = chart.querySelector('.chart-area');
    const tooltip = chart.querySelector('.chart-tooltip');
    const crosshair = chart.querySelector('.chart-crosshair');
    const tooltipPrice = tooltip.querySelector('.tooltip-price');
    const tooltipDate = tooltip.querySelector('.tooltip-date');

    const dataPoints = chartData.prices.length;

    chartArea.addEventListener('mouseenter', () => {
        tooltip.classList.add('visible');
        crosshair.classList.add('visible');
    });

    chartArea.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
        crosshair.classList.remove('visible');
    });

    chartArea.addEventListener('mousemove', (e) => {
        const rect = chartArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const chartWidth = rect.width;
        const pointWidth = chartWidth / (dataPoints - 1);
        const index = Math.round(x / pointWidth);
        const clampedIndex = Math.max(0, Math.min(dataPoints - 1, index));

        const price = chartData.prices[clampedIndex];
        const dateStr = chartData.dates[clampedIndex];
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        tooltipPrice.textContent = `$${price.toFixed(2)}`;
        tooltipDate.textContent = formattedDate;

        const tooltipX = (clampedIndex / (dataPoints - 1)) * chartWidth;
        tooltip.style.left = `${tooltipX}px`;
        tooltip.style.top = `${Math.max(10, y - 10)}px`;

        crosshair.style.left = `${tooltipX}px`;

        const pricePercent = (price - minPrice) / priceRange;
        const chartAreaHeight = rect.height * 0.7;
        const chartAreaTop = rect.height * 0.15;
        const dotY = chartAreaTop + (chartAreaHeight * (1 - pricePercent));

        crosshair.style.setProperty('--crosshair-y', `${dotY}px`);
    });

    chartArea.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    console.log('Sidebar ready!');
});
