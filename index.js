// Photo Gallery for Cloudflare Workers
// Fetches image URLs from GitHub and displays them in a gallery

const URL_SOURCES = [
    'https://raw.githubusercontent.com/fff122/PhotoVerse/refs/heads/main/1.txt',
    'https://raw.githubusercontent.com/fff122/PhotoVerse/refs/heads/main/2.txt',
    'https://raw.githubusercontent.com/fff122/PhotoVerse/refs/heads/main/3.txt'
    'https://raw.githubusercontent.com/fff122/PhotoVerse/refs/heads/main/4.txt'
];

// HTML template for the gallery
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PhotoVerse Gallery</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            min-height: 100vh;
            color: #1565c0;
        }
        
        .header {
            text-align: center;
            padding: 2rem 1rem 1rem;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(21, 101, 192, 0.1);
            margin-bottom: 1rem;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 300;
            color: #0d47a1;
            margin-bottom: 0.5rem;
        }
        
        .header p {
            color: #1976d2;
            font-size: 1.1rem;
            opacity: 0.8;
        }
        
        .control-panel {
            max-width: 800px;
            margin: 0 auto 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(21, 101, 192, 0.1);
        }
        
        .control-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 1rem;
        }
        
        .control-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .control-group label {
            color: #1565c0;
            font-weight: 500;
            white-space: nowrap;
        }
        
        .control-group input {
            padding: 0.5rem 0.75rem;
            border: 2px solid #bbdefb;
            border-radius: 8px;
            font-size: 1rem;
            width: 100px;
            text-align: center;
            transition: border-color 0.3s ease;
        }
        
        .control-group input:focus {
            outline: none;
            border-color: #2196f3;
            box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
        }
        
        .control-buttons {
            display: flex;
            gap: 0.75rem;
        }
        
        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #2196f3, #1976d2);
            color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
            background: linear-gradient(135deg, #1976d2, #1565c0);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
        }
        
        .btn-secondary {
            background: rgba(33, 150, 243, 0.1);
            color: #1976d2;
            border: 2px solid #bbdefb;
        }
        
        .btn-secondary:hover:not(:disabled) {
            background: rgba(33, 150, 243, 0.2);
            border-color: #90caf9;
            transform: translateY(-2px);
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }
        
        .control-status {
            text-align: center;
            color: #1976d2;
            font-size: 0.9rem;
            min-height: 1.2rem;
        }
        
        .status-loading {
            color: #ff9800;
        }
        
        .status-success {
            color: #4caf50;
        }
        
        .status-error {
            color: #f44336;
        }
        
        .loading {
            text-align: center;
            padding: 3rem;
            font-size: 1.2rem;
            color: #1976d2;
        }
        
        .gallery {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 1rem 2rem;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
        }
        
        .photo-item {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(21, 101, 192, 0.1);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .photo-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(21, 101, 192, 0.2);
        }
        
        .photo-item img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .photo-item:hover img {
            transform: scale(1.05);
        }
        
        .photo-info {
            padding: 1rem;
            text-align: center;
        }
        
        .photo-id {
            font-size: 0.9rem;
            color: #64b5f6;
            font-weight: 500;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90vw;
            max-height: 90vh;
        }
        
        .modal img {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 8px;
        }
        
        .close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1001;
        }
        
        .close:hover {
            opacity: 0.7;
        }
        
        .stats {
            text-align: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.8);
            margin: 2rem auto;
            max-width: 400px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(21, 101, 192, 0.1);
        }
        
        .error {
            text-align: center;
            padding: 2rem;
            color: #d32f2f;
            background: rgba(255, 255, 255, 0.9);
            margin: 2rem auto;
            max-width: 600px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(211, 47, 47, 0.1);
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .header {
                padding: 1.5rem 1rem 0.5rem;
            }
            
            .control-panel {
                margin: 0 1rem 1.5rem;
                padding: 1rem;
            }
            
            .control-row {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }
            
            .control-group {
                justify-content: center;
            }
            
            .control-group input {
                width: 120px;
            }
            
            .control-buttons {
                justify-content: center;
            }
            
            .btn {
                min-height: 44px;
                padding: 0.75rem 1.25rem;
                font-size: 1rem;
            }
            
            .gallery {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1rem;
                padding: 0 1rem 2rem;
            }
            
            .photo-item img {
                height: 200px;
            }
            
            .modal-content {
                max-width: 95vw;
                max-height: 85vh;
            }
            
            .close {
                top: 10px;
                right: 15px;
                font-size: 30px;
            }
        }
        
        @media (max-width: 480px) {
            .control-group {
                flex-direction: column;
                text-align: center;
                gap: 0.5rem;
            }
            
            .control-buttons {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .btn {
                width: 100%;
            }
            
            .gallery {
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PhotoVerse Gallery</h1>
        <p>精美图片收藏</p>
    </div>
    
    <div class="control-panel">
        <div class="control-row">
            <div class="control-group">
                <label for="imageCount">显示图片数量:</label>
                <input type="number" id="imageCount" min="1" max="9999" value="100">
            </div>
            <div class="control-buttons">
                <button id="loadImages" class="btn btn-primary">加载图片</button>
                <button id="refreshGallery" class="btn btn-secondary">随机刷新</button>
            </div>
        </div>
        <div class="control-status" id="controlStatus">准备加载图片...</div>
    </div>
    
    <div class="stats" id="stats" style="display: none;">
        <p>显示 <strong id="displayCount">0</strong> 张，共 <strong id="totalCount">0</strong> 张图片</p>
    </div>
    
    <div class="gallery" id="gallery"></div>
    
    <div class="modal" id="modal">
        <span class="close" id="closeModal">&times;</span>
        <div class="modal-content">
            <img id="modalImg" src="" alt="">
        </div>
    </div>
    
    <script>
        // Session State Management
        class SessionState {
            constructor() {
                this.imageCount = this.getStoredCount() || 100;
                this.currentImages = [];
                this.totalAvailable = 0;
                this.isLoading = false;
            }
            
            setImageCount(count) {
                this.imageCount = count;
                try {
                    sessionStorage.setItem('imageCount', count.toString());
                } catch (e) {
                    console.warn('Session storage not available');
                }
            }
            
            getStoredCount() {
                try {
                    const stored = sessionStorage.getItem('imageCount');
                    return stored ? parseInt(stored) : null;
                } catch (e) {
                    return null;
                }
            }
            
            setCurrentImages(images, total) {
                this.currentImages = images;
                this.totalAvailable = total;
            }
        }
        
        // Gallery Manager
        class GalleryManager {
            constructor() {
                this.container = document.getElementById('gallery');
                this.state = new SessionState();
                this.setupEventListeners();
                this.updateUI();
            }
            
            setupEventListeners() {
                const imageCountInput = document.getElementById('imageCount');
                const loadButton = document.getElementById('loadImages');
                const refreshButton = document.getElementById('refreshGallery');
                
                // Set initial value from state
                imageCountInput.value = this.state.imageCount;
                
                // Input validation with debouncing
                let inputTimeout;
                imageCountInput.addEventListener('input', (e) => {
                    clearTimeout(inputTimeout);
                    inputTimeout = setTimeout(() => {
                        this.validateAndUpdateCount(e.target.value);
                    }, 300);
                });
                
                loadButton.addEventListener('click', () => this.loadImages());
                refreshButton.addEventListener('click', () => this.refreshGallery());
                
                // Enter key support
                imageCountInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.loadImages();
                    }
                });
            }
            
            validateAndUpdateCount(value) {
                const count = parseInt(value);
                const input = document.getElementById('imageCount');
                
                if (isNaN(count) || count < 1) {
                    input.style.borderColor = '#f44336';
                    this.updateStatus('请输入有效的数字 (1-9999)', 'error');
                    return false;
                } else if (count > 9999) {
                    input.style.borderColor = '#f44336';
                    this.updateStatus('数量不能超过 9999', 'error');
                    return false;
                } else {
                    input.style.borderColor = '#bbdefb';
                    this.state.setImageCount(count);
                    this.updateStatus('准备加载图片...', '');
                    return true;
                }
            }
            
            async loadImages() {
                if (this.state.isLoading) return;
                
                const count = this.state.imageCount;
                if (!this.validateAndUpdateCount(count)) return;
                
                this.state.isLoading = true;
                this.updateLoadingState(true);
                this.updateStatus('正在加载图片...', 'loading');
                
                try {
                    const response = await fetch(\`/api/images?count=\${count}\`);
                    const data = await response.json();
                    
                    if (!data.success) {
                        throw new Error(data.error || '加载失败');
                    }
                    
                    this.state.setCurrentImages(data.images, data.total);
                    this.renderGallery(data.images);
                    this.updateStats(data.count, data.total);
                    this.updateStatus(\`成功加载 \${data.count} 张图片\`, 'success');
                    
                } catch (error) {
                    console.error('Error loading images:', error);
                    this.updateStatus('加载图片失败，请稍后重试', 'error');
                } finally {
                    this.state.isLoading = false;
                    this.updateLoadingState(false);
                }
            }
            
            async refreshGallery() {
                await this.loadImages();
            }
            
            updateLoadingState(loading) {
                const loadButton = document.getElementById('loadImages');
                const refreshButton = document.getElementById('refreshGallery');
                const imageCountInput = document.getElementById('imageCount');
                
                loadButton.disabled = loading;
                refreshButton.disabled = loading;
                imageCountInput.disabled = loading;
                
                if (loading) {
                    loadButton.textContent = '加载中...';
                    refreshButton.textContent = '加载中...';
                } else {
                    loadButton.textContent = '加载图片';
                    refreshButton.textContent = '随机刷新';
                }
            }
            
            updateStatus(message, type) {
                const statusElement = document.getElementById('controlStatus');
                statusElement.textContent = message;
                statusElement.className = 'control-status' + (type ? \` status-\${type}\` : '');
            }
            
            updateStats(count, total) {
                const statsElement = document.getElementById('stats');
                const displayCountElement = document.getElementById('displayCount');
                const totalCountElement = document.getElementById('totalCount');
                
                displayCountElement.textContent = count;
                totalCountElement.textContent = total;
                statsElement.style.display = 'block';
            }
            
            updateUI() {
                // Set initial UI state
                document.getElementById('imageCount').value = this.state.imageCount;
            }
            
            renderGallery(images) {
                this.container.innerHTML = '';
                
                images.forEach((url, index) => {
                    const photoItem = document.createElement('div');
                    photoItem.className = 'photo-item';
                    
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = \`Photo \${index + 1}\`;
                    img.loading = 'lazy';
                    
                    // Handle image load errors
                    img.onerror = function() {
                        this.parentElement.style.display = 'none';
                    };
                    
                    const photoInfo = document.createElement('div');
                    photoInfo.className = 'photo-info';
                    
                    const photoId = document.createElement('div');
                    photoId.className = 'photo-id';
                    photoId.textContent = \`#\${index + 1}\`;
                    
                    photoInfo.appendChild(photoId);
                    photoItem.appendChild(img);
                    photoItem.appendChild(photoInfo);
                    
                    // Add click event for modal
                    photoItem.addEventListener('click', () => openModal(url));
                    
                    this.container.appendChild(photoItem);
                });
            }
        }
        
        function openModal(imageSrc) {
            const modal = document.getElementById('modal');
            const modalImg = document.getElementById('modalImg');
            
            modal.style.display = 'block';
            modalImg.src = imageSrc;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
        
        function closeModal() {
            const modal = document.getElementById('modal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Event listeners
        document.getElementById('closeModal').addEventListener('click', closeModal);
        document.getElementById('modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
        
        // Initialize gallery manager when page loads
        let galleryManager;
        document.addEventListener('DOMContentLoaded', function() {
            galleryManager = new GalleryManager();
            // Auto-load images on first visit
            galleryManager.loadImages();
        });
    </script>
</body>
</html>
`;

// Cloudflare Workers event handler
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);

    // Handle API endpoint for getting images
    if (url.pathname === '/api/images') {
        return await getImages(request);
    }

    // Serve the main HTML page
    return new Response(HTML_TEMPLATE, {
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=3600'
        }
    });
}

async function getImages(request) {
    try {
        const url = new URL(request.url);
        const countParam = url.searchParams.get('count');
        const requestedCount = countParam ? parseInt(countParam) : 100;

        // Validate count parameter
        if (isNaN(requestedCount) || requestedCount < 1 || requestedCount > 9999) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid count parameter. Must be between 1 and 9999.'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const promises = URL_SOURCES.map(async (url) => {
            const response = await fetch(url);
            const text = await response.text();
            return text.split('\n')
                .map(line => line.trim())
                .filter(line => line && line.startsWith('https://'));
        });

        const results = await Promise.all(promises);
        const allImages = results.flat();

        // Remove duplicates
        const uniqueImages = [...new Set(allImages)];

        // Fisher-Yates shuffle algorithm for random selection
        const shuffleArray = (array) => {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };

        const shuffledImages = shuffleArray(uniqueImages);
        const selectedImages = shuffledImages.slice(0, Math.min(requestedCount, uniqueImages.length));

        return new Response(JSON.stringify({
            success: true,
            count: selectedImages.length,
            total: uniqueImages.length,
            images: selectedImages,
            seed: Date.now().toString() // Simple seed for debugging
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=300' // Reduced cache time for randomization
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
