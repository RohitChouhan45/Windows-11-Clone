document.addEventListener('DOMContentLoaded', () => {
    // Initialize system
    let taskbar = document.getElementsByClassName("taskbar")[0];
    let startmenu = document.getElementsByClassName("startmenu")[0];
    let startmenuIframe = document.getElementById('start-menu-iframe');
    
    // Sound effects
    const sounds = {
        startup: document.getElementById('startup-sound'),
        notification: document.getElementById('notification-sound'),
        click: document.getElementById('click-sound')
    };
    
    // System startup
    const startupSequence = async () => {
        // Play startup sound
        try {
            await sounds.startup.play();
        } catch (error) {
            console.log('Auto-play prevented by browser. Click to interact with the page first.');
        }
        updateClock();
        setInterval(updateClock, 1000);
    };
    
    // Update clock in taskbar
    function updateClock() {
        const now = new Date();
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        
        // Format time: HH:MM AM/PM
        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes} ${ampm}`;
        
        // Format date using Intl.DateTimeFormat
        dateElement.textContent = new Intl.DateTimeFormat('en-US', {
            month: 'numeric', 
            day: 'numeric',
            year: 'numeric'
        }).format(now);
    }
    
    // Function to create a new window
    function createWindow(options, callback) {
        const { title, content, width = 500, height = 400, x = 100, y = 100 } = options;
        
        const windowElement = document.createElement('div');
        windowElement.classList.add('window');
        windowElement.style.width = `${width}px`;
        windowElement.style.height = `${height}px`;
        windowElement.style.top = `${y}px`;
        windowElement.style.left = `${x}px`;
        windowElement.style.position = 'absolute';
        windowElement.style.zIndex = '1000';
        windowElement.style.borderRadius = '8px';  // More rounded corners

        windowElement.innerHTML = `
            <div class="window-titlebar">
                <div class="window-title">${title}</div>
                <div class="window-controls">
                    <div class="window-control-button minimize">─</div>
                    <div class="window-control-button maximize">☐</div>
                    <div class="window-control-button close">✕</div>
                </div>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;

        // Make window draggable
        let isDragging = false;
        let startX, startY;
        const titlebar = windowElement.querySelector('.window-titlebar');
        
        titlebar.addEventListener('mousedown', (e) => {
            if (e.target === titlebar) {
                isDragging = true;
                startX = e.clientX - windowElement.offsetLeft;
                startY = e.clientY - windowElement.offsetTop;
                windowElement.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                windowElement.style.left = `${e.clientX - startX}px`;
                windowElement.style.top = `${e.clientY - startY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            windowElement.style.cursor = 'default';
        });

        // Window control buttons
        const minimizeBtn = windowElement.querySelector('.minimize');
        const maximizeBtn = windowElement.querySelector('.maximize');
        const closeBtn = windowElement.querySelector('.close');

        minimizeBtn.addEventListener('click', () => {
            windowElement.classList.toggle('minimized');
        });

        maximizeBtn.addEventListener('click', () => {
            windowElement.classList.toggle('maximized');
        });

        closeBtn.addEventListener('click', () => {
            windowElement.remove();
        });

        document.getElementById('desktop').appendChild(windowElement);

        // Execute callback if provided
        if (callback && typeof callback === 'function') {
            callback(windowElement);
        }

        return windowElement;
    }

    // Enhanced App Launch Function
    function launchApp(appName) {
        // Play click sound
        try {
            sounds.click.play();
        } catch (error) {
            console.log('Audio playback prevented');
        }

        // Close start menu if open
        if(startmenu.style.bottom == "50px"){
            startmenu.style.bottom = "-555px";
        }

        // More specific app launches
        switch(appName) {
            case 'word':
                launchWord();
                break;
            case 'notepad':
                launchNotepad();
                break;
            case 'mail':
                launchMail();
                break;
            case 'settings':
                launchSettings();
                break;
            case 'file-explorer':
                createWindow({
                    title: 'File Explorer',
                    width: 1024,
                    height: 768,
                    content: `
                        <div style="display: flex; flex-direction: column; height: 100%; background-color: #f0f0f0;">
                            <!-- Ribbon/Tabs -->
                            <div style="background-color: #f0f0f0; padding: 10px; display: flex; align-items: center;">
                                <div style="display: flex; gap: 15px; margin-right: 20px;">
                                    <button style="background-color: #0078d4; color: white; padding: 5px 10px; border: none; border-radius: 4px;">File</button>
                                    <button style="background-color: #e1e1e1; padding: 5px 10px; border: none; border-radius: 4px;">Home</button>
                                    <button style="background-color: #e1e1e1; padding: 5px 10px; border: none; border-radius: 4px;">Share</button>
                                    <button style="background-color: #e1e1e1; padding: 5px 10px; border: none; border-radius: 4px;">View</button>
                                </div>
                            </div>
                            
                            <!-- Main Content Area -->
                            <div style="display: flex; flex-grow: 1;">
                                <!-- Navigation Pane -->
                                <div style="width: 250px; background-color: #f6f6f6; padding: 15px; border-right: 1px solid #e0e0e0;">
                                    <h3 style="margin-bottom: 10px; font-size: 14px; color: #666;">Navigation</h3>
                                    <ul style="list-style-type: none; padding: 0;">
                                        <li style="padding: 8px; display: flex; align-items: center; border-radius: 4px; margin-bottom: 5px;">
                                            <img src="/desktop.ico" style="width: 20px; margin-right: 10px;"> Desktop
                                        </li>
                                        <li style="padding: 8px; display: flex; align-items: center; border-radius: 4px; margin-bottom: 5px;">
                                            <img src="/documents.ico" style="width: 20px; margin-right: 10px;"> Documents
                                        </li>
                                        <li style="padding: 8px; display: flex; align-items: center; border-radius: 4px; margin-bottom: 5px;">
                                            <img src="/downloads.ico" style="width: 20px; margin-right: 10px;"> Downloads
                                        </li>
                                        <li style="padding: 8px; display: flex; align-items: center; border-radius: 4px; margin-bottom: 5px;">
                                            <img src="/pictures.ico" style="width: 20px; margin-right: 10px;"> Pictures
                                        </li>
                                        <li style="padding: 8px; display: flex; align-items: center; border-radius: 4px; margin-bottom: 5px;">
                                            <img src="/audio.ico" style="width: 20px; margin-right: 10px;"> Music
                                        </li>
                                        <li style="padding: 8px; display: flex; align-items: center; border-radius: 4px; margin-bottom: 5px;">
                                            <img src="/video.ico" style="width: 20px; margin-right: 10px;"> Videos
                                        </li>
                                        <li style="padding: 8px; display: flex; align-items: center; border-radius: 4px; margin-bottom: 5px;">
                                            <img src="/this_pc_icon__windows_11__by_satellitedish555_dgv3zid-fullview.png" style="width: 20px; margin-right: 10px;"> This PC
                                        </li>
                                        <li style="padding: 8px; display: flex; align-items: center; border-radius: 4px; margin-bottom: 5px;">
                                            <img src="/Windows 11 Recycling Bin Empty.png" style="width: 20px; margin-right: 10px;"> Recycle Bin
                                        </li>
                                    </ul>
                                </div>
                                
                                <!-- Main Content -->
                                <div style="flex-grow: 1; padding: 15px;">
                                    <h2 style="margin-bottom: 15px; font-size: 16px;">Quick access</h2>
                                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px;">
                                        <div style="text-align: center; padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px;">
                                            <img src="/desktop.ico" style="width: 40px; margin-bottom: 10px;">
                                            <div>Desktop</div>
                                        </div>
                                        <div style="text-align: center; padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px;">
                                            <img src="/documents.ico" style="width: 40px; margin-bottom: 10px;">
                                            <div>Documents</div>
                                        </div>
                                        <div style="text-align: center; padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px;">
                                            <img src="/downloads.ico" style="width: 40px; margin-bottom: 10px;">
                                            <div>Downloads</div>
                                        </div>
                                        <div style="text-align: center; padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px;">
                                            <img src="/pictures.ico" style="width: 40px; margin-bottom: 10px;">
                                            <div>Pictures</div>
                                        </div>
                                        <div style="text-align: center; padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px;">
                                            <img src="/video.ico" style="width: 40px; margin-bottom: 10px;">
                                            <div>Videos</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                });
                break;
            case 'edge':
                createWindow({
                    title: 'Microsoft Edge',
                    width: 1200,
                    height: 800,
                    content: `
                        <div style="display: flex; flex-direction: column; height: 100%; background-color: #f0f0f0;">
                            <!-- Top Navigation Bar -->
                            <div style="display: flex; align-items: center; background-color: #e0e0e0; padding: 10px;" class="edge-nav-bar">
                                <div style="display: flex; align-items: center; margin-right: 15px;">
                                    <button style="background: none; border: none; margin-right: 10px;">◀</button>
                                    <button style="background: none; border: none; margin-right: 10px;">▶</button>
                                    <button style="background: none; border: none; margin-right: 10px;">🔄</button>
                                </div>
                                <div style="flex-grow: 1; display: flex; align-items: center; background-color: white; border-radius: 20px; padding: 5px 10px; margin-right: 15px;" class="edge-url-bar">
                                    <span style="margin-right: 5px;">🔒</span>
                                    <input type="text" value="https://www.bing.com/"  style="flex-grow: 1; border: none; outline: none;" class="edge-url-input">
                                </div>
                                <div style="display: flex; align-items: center;">
                                    <button style="background: none; border: none; margin-right: 10px;">⭐</button>
                                    <button style="background: none; border: none; margin-right: 10px;" class="edge-fullscreen">⛶</button>
                                    <button style="background: none; border: none;">⋮</button>
                                </div>
                            </div>

                            <!-- Tabs Bar -->
                            <div style="display: flex; background-color: #f0f0f0; padding: 5px 10px; align-items: center;" class="edge-tabs-bar">
                                <div style="display: flex; align-items: center; margin-right: 10px;">
                                    <div style="background-color: white; border-radius: 4px; padding: 5px 10px; margin-right: 10px; display: flex; align-items: center;">
                                        <img src="/Microsoft Edge.png" style="width: 16px; margin-right: 5px;"> Bing
                                    </div>
                                    <button style="background: none; border: none; padding: 5px;" class="edge-new-tab">+</button>
                                </div>
                            </div>

                            <!-- Web Content Area -->
                            <div style="flex-grow: 1; background-color: white; display: flex; flex-direction: column; overflow: hidden;" class="edge-content">
                                <iframe src="https://www.bing.com" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" style="flex-grow: 1; border: none; width: 100%; height: 100%;" class="edge-iframe"></iframe>
                            </div>
                            
                            <!-- Fullscreen Exit Button (Hidden by default) -->
                            <button style="position: absolute; top: 10px; right: 10px; background: none; border: none; display: none; z-index: 9999;" class="edge-exit-fullscreen">⟲</button>
                        </div>
                    `
                }, (windowElement) => {
                    // Initialize Edge browser functionality
                    const urlInput = windowElement.querySelector('.edge-url-input');
                    const navBar = windowElement.querySelector('.edge-nav-bar');
                    const urlBar = windowElement.querySelector('.edge-url-bar');
                    const tabsBar = windowElement.querySelector('.edge-tabs-bar');
                    const iframe = windowElement.querySelector('.edge-iframe');
                    const newTabBtn = windowElement.querySelector('.edge-new-tab');
                    const fullscreenBtn = windowElement.querySelector('.edge-fullscreen');
                    const exitFullscreenBtn = windowElement.querySelector('.edge-exit-fullscreen');
                    
                    // Function to navigate to a URL
                    const navigateTo = (url) => {
                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            url = 'https://' + url;
                        }
                        
                        urlInput.value = url;
                        
                        // Check if URL is actually changing to prevent unnecessary reloads
                        const currentUrl = iframe.src;
                        if (url !== currentUrl) {
                            iframe.src = url;
                        }
                    };
                    
                    // URL bar handling
                    urlInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            navigateTo(urlInput.value);
                        }
                    });
                    
                    // New tab button
                    if (newTabBtn) {
                        newTabBtn.addEventListener('click', () => {
                            // Explicitly set to Bing only when new tab is clicked
                            iframe.src = 'https://www.bing.com';
                            urlInput.value = 'https://www.bing.com/';
                        });
                    }
                    
                    // Fullscreen button functionality
                    if (fullscreenBtn) {
                        fullscreenBtn.addEventListener('click', () => {
                            navBar.style.display = 'none';
                            urlBar.style.display = 'none';
                            tabsBar.style.display = 'none';
                            exitFullscreenBtn.style.display = 'block';
                            sounds.click.play().catch(err => console.log('Audio playback prevented'));
                        });
                    }
                    
                    // Exit fullscreen button functionality
                    if (exitFullscreenBtn) {
                        exitFullscreenBtn.style.display = 'none';  
                        exitFullscreenBtn.classList.add('window-control-button');  
                        exitFullscreenBtn.innerHTML = '⟲';  
                        exitFullscreenBtn.addEventListener('click', () => {
                            navBar.style.display = 'flex';
                            urlBar.style.display = 'flex';
                            tabsBar.style.display = 'flex';
                            exitFullscreenBtn.style.display = 'none';
                            sounds.click.play().catch(err => console.log('Audio playback prevented'));
                        });
                    }
                });
                break;
            case 'store':
                createWindow({
                    title: 'Microsoft Store',
                    width: 1200,
                    height: 800,
                    content: `
                        <div style="display: flex; flex-direction: column; height: 100%; background-color: #f0f0f0;">
                            <!-- Search Bar -->
                            <div style="background-color: white; padding: 15px; display: flex; align-items: center;">
                                <input type="text" placeholder="Search apps, games, movies & more" 
                                    style="flex-grow: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px;">
                                <button style="background-color: #0078d4; color: white; border: none; padding: 10px 20px; border-radius: 4px;">
                                    Search
                                </button>
                            </div>

                            <!-- Navigation Menu -->
                            <div style="display: flex; background-color: #f5f5f5; padding: 10px; gap: 20px;">
                                <a href="#" style="color: #0078d4; text-decoration: none;">Home</a>
                                <a href="#" style="color: #333; text-decoration: none;">Apps</a>
                                <a href="#" style="color: #333; text-decoration: none;">Games</a>
                                <a href="#" style="color: #333; text-decoration: none;">Entertainment</a>
                                <a href="#" style="color: #333; text-decoration: none;">Deals</a>
                            </div>

                            <!-- Featured Apps Section -->
                            <div style="padding: 20px; flex-grow: 1; overflow-y: auto;">
                                <h2>Featured Apps</h2>
                                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                                    ${[
                                        {name: 'Disney+', icon: '/microsoftstore-Photoroom.png'},
                                        {name: 'Discord', icon: '/discord.png'},
                                        {name: 'Spotify', icon: '/spotify-2.svg'},
                                        {name: 'Reddit', icon: '/reddit.png'},
                                        {name: 'Netflix', icon: '/netflix-logo-icon.svg'},
                                        {name: 'TikTok', icon: '/tiktok.png'}
                                    ].map(app => `
                                        <div style="text-align: center; background-color: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                                            <img src="${app.icon}" style="width: 64px; height: 64px; margin-bottom: 10px;">
                                            <div style="font-weight: bold;">${app.name}</div>
                                            <button style="margin-top: 10px; background-color: #0078d4; color: white; border: none; padding: 5px 10px; border-radius: 4px;">
                                                Get
                                            </button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `
                });
                break;
            case 'this-pc':
                // Redirect to File Explorer with 'This PC' view
                launchApp('file-explorer');
                break;
            case 'recyclebin':
                // Redirect to File Explorer with Recycle Bin view
                launchApp('file-explorer');
                break;
            case 'photos':
                createWindow({
                    title: 'Photos',
                    width: 1024,
                    height: 768,
                    content: `
                        <div style="display: flex; flex-direction: column; height: 100%; background-color: #f0f0f0;">
                            <!-- Top Navigation Bar -->
                            <div style="display: flex; background-color: #e0e0e0; padding: 10px; align-items: center;">
                                <button style="background: none; border: none; margin-right: 10px;"> Import</button>
                                <button style="background: none; border: none; margin-right: 10px;"> Edit</button>
                            </div>

                            <!-- Photo Grid -->
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; padding: 15px; background-color: white; flex-grow: 1; overflow-y: auto;">
                                ${['vacation_photo.jpg', 'sunset.jpg', 'beach.jpg', 'mountains.jpg', 'city.jpg', 'nature.jpg'].map(photo => `
                                    <div style="background-color: #f5f5f5; padding: 10px; text-align: center; border-radius: 8px;">
                                        <img src="/pictures.ico" style="width: 100%; max-height: 200px; object-fit: contain;">
                                        <p style="margin-top: 10px;">${photo}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `
                });
                break;
            case 'settings':
                launchSettings();
                break;
            case 'terminal':
                createWindow({
                    title: 'Windows PowerShell',
                    width: 800,
                    height: 500,
                    content: `
                        <div style="background-color: black; color: white; height: 100%; padding: 15px; font-family: monospace;">
                            <p>Windows PowerShell</p>
                            <p>Copyright (C) Microsoft Corporation. All rights reserved.</p>
                            <br>
                            <p>PS C:\\Users\\User></p>
                            <input type="text" style="background-color: black; color: white; border: none; width: 100%; outline: none; font-family: monospace;">
                        </div>
                    `
                });
                break;
            case 'chrome':
                createWindow({
                    title: 'Google Chrome',
                    width: 1200,
                    height: 800,
                    content: `
                        <div style="display: flex; flex-direction: column; height: 100%; background-color: #f0f0f0;">
                            <!-- Top Navigation Bar -->
                            <div style="display: flex; align-items: center; background-color: #e0e0e0; padding: 10px;">
                                <div style="display: flex; align-items: center; margin-right: 15px;">
                                    <button style="background: none; border: none; margin-right: 10px;">◀</button>
                                    <button style="background: none; border: none; margin-right: 10px;">▶</button>
                                    <button style="background: none; border: none; margin-right: 10px;">🔄</button>
                                </div>
                                <div style="flex-grow: 1; display: flex; align-items: center; background-color: white; border-radius: 20px; padding: 5px 10px; margin-right: 15px;">
                                    🔒 https://www.google.com
                                </div>
                            </div>

                            <!-- Chrome Default Page -->
                            <div style="flex-grow: 1; background-color: white; display: flex; justify-content: center; align-items: center;">
                                <div style="text-align: center;">
                                    <img src="/google-Photoroom.png" style="width: 200px; margin-bottom: 20px;">
                                    <div style="display: flex; justify-content: center; gap: 15px;">
                                        <button style="background-color: #f0f0f0; padding: 10px 20px; border: none; border-radius: 5px;">New Tab</button>
                                        <button style="background-color: #f0f0f0; padding: 10px 20px; border: none; border-radius: 5px;">New Window</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                });
                break;
            case 'spotify':
                createWindow({
                    title: 'Spotify',
                    width: 1000,
                    height: 700,
                    content: `
                        <div style="display: flex; height: 100%;">
                            <!-- Sidebar -->
                            <div style="width: 250px; background-color: #121212; color: white; padding: 15px;">
                                <h2>Spotify</h2>
                                <ul style="list-style-type: none; padding: 0;">
                                    <li style="padding: 10px; border-radius: 4px; background-color: #282828;">Home</li>
                                    <li style="padding: 10px;">Search</li>
                                    <li style="padding: 10px;">Your Library</li>
                                </ul>
                            </div>

                            <!-- Main Content -->
                            <div style="flex-grow: 1; background-color: #1e1e1e; padding: 20px; color: white;">
                                <h1>Good afternoon</h1>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                                    ${['Liked Songs', 'Discover Weekly', 'Release Radar'].map(playlist => `
                                        <div style="background-color: #282828; padding: 15px; border-radius: 8px;">
                                            <h3>${playlist}</h3>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `
                });
                break;
            case 'netflix':
                createWindow({
                    title: 'Netflix',
                    width: 1200,
                    height: 800,
                    content: `
                        <div style="background-color: black; color: white; height: 100%; display: flex; flex-direction: column;">
                            <!-- Top Navigation -->
                            <div style="display: flex; padding: 15px; align-items: center; background-color: #141414;">
                                <img src="/video.ico" style="width: 50px; margin-right: 20px;">
                                <nav style="display: flex; gap: 20px;">
                                    <a href="#" style="color: white; text-decoration: none;">Home</a>
                                    <a href="#" style="color: white; text-decoration: none;">TV Shows</a>
                                    <a href="#" style="color: white; text-decoration: none;">Movies</a>
                                </nav>
                            </div>

                            <!-- Content Grid -->
                            <div style="flex-grow: 1; padding: 20px; overflow-y: auto;">
                                <h2>Popular on Netflix</h2>
                                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px;">
                                    ${['Movie 1', 'Movie 2', 'Movie 3', 'Movie 4', 'Movie 5'].map(() => `
                                        <div style="background-color: #222; height: 200px; border-radius: 8px;"></div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `
                });
                break;
                
            default:
                console.log(`Attempting to launch ${appName}`);
        }
    }

    function launchWord() {
        createWindow({
            title: 'Microsoft Word',
            width: 1024,
            height: 768,
            content: `
                <div style="display: flex; flex-direction: column; height: 100%; font-family: 'Segoe UI', sans-serif;">
                    <!-- Ribbon -->
                    <div style="background-color: #f3f3f3; padding: 10px; display: flex; align-items: center;">
                        <div style="display: flex; gap: 15px; margin-right: 20px;">
                            <button style="background-color: #0078d4; color: white; padding: 5px 10px; border: none; border-radius: 4px;">File</button>
                            <button style="background-color: #e1e1e1; padding: 5px 10px; border: none; border-radius: 4px;">Home</button>
                            <button style="background-color: #e1e1e1; padding: 5px 10px; border: none; border-radius: 4px;">Insert</button>
                            <button style="background-color: #e1e1e1; padding: 5px 10px; border: none; border-radius: 4px;">Design</button>
                            <button style="background-color: #e1e1e1; padding: 5px 10px; border: none; border-radius: 4px;">Layout</button>
                        </div>
                    </div>
                    
                    <!-- Toolbar -->
                    <div style="background-color: #f9f9f9; padding: 10px; display: flex; align-items: center; border-bottom: 1px solid #e0e0e0;">
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <select style="padding: 5px; margin-right: 10px;">
                                <option>Calibri</option>
                                <option>Arial</option>
                                <option>Times New Roman</option>
                            </select>
                            <select style="padding: 5px; margin-right: 10px;">
                                <option>11</option>
                                <option>12</option>
                                <option>14</option>
                            </select>
                            <button style="background: none; border: none;">B</button>
                            <button style="background: none; border: none; font-style: italic;">I</button>
                            <button style="background: none; border: none; text-decoration: underline;">U</button>
                        </div>
                    </div>
                    
                    <!-- Main Content Area -->
                    <textarea style="flex-grow: 1; width: 100%; border: none; padding: 20px; resize: none; outline: none; font-size: 14px; line-height: 1.6;" 
                        placeholder="Start typing your document..."></textarea>
                </div>
            `
        });
    }

    function launchNotepad() {
        createWindow({
            title: 'Notepad',
            width: 800,
            height: 600,
            content: `
                <div style="display: flex; flex-direction: column; height: 100%; font-family: 'Segoe UI', sans-serif;">
                    <!-- Menu Bar -->
                    <div style="background-color: #f3f3f3; padding: 5px; display: flex; align-items: center;">
                        <div style="display: flex; gap: 15px;">
                            <div style="position: relative;">
                                <button style="background: none; border: none; padding: 5px 10px;">File</button>
                                <div style="display: none; position: absolute; background-color: white; border: 1px solid #e0e0e0; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 10px;">
                                    <div>New</div>
                                    <div>Open</div>
                                    <div>Save</div>
                                    <div>Save As</div>
                                    <div>Print</div>
                                    <div>Exit</div>
                                </div>
                            </div>
                            <button style="background: none; border: none; padding: 5px 10px;">Edit</button>
                            <button style="background: none; border: none; padding: 5px 10px;">Format</button>
                            <button style="background: none; border: none; padding: 5px 10px;">View</button>
                            <button style="background: none; border: none; padding: 5px 10px;">Help</button>
                        </div>
                    </div>
                    
                    <!-- Tabs (Optional) -->
                    <div style="background-color: #f9f9f9; padding: 5px; display: flex; align-items: center; border-bottom: 1px solid #e0e0e0;">
                        <div style="display: flex; align-items: center;">
                            <button style="background-color: white; border: 1px solid #0078d4; padding: 5px 10px; border-radius: 4px; margin-right: 10px;">
                                Untitled - Notepad
                            </button>
                            <button style="background: none; border: none; padding: 5px;">+</button>
                        </div>
                    </div>
                    
                    <!-- Main Content Area -->
                    <textarea style="flex-grow: 1; width: 100%; border: none; padding: 20px; resize: none; outline: none; font-size: 14px; line-height: 1.6; font-family: 'Consolas', monospace;" 
                        placeholder="Type your notes here..."></textarea>
                </div>
            `
        });
    }

    function launchMail() {
        createWindow({
            title: 'Mail',
            width: 1200,
            height: 800,
            content: `
                <div style="display: flex; height: 100%; font-family: 'Segoe UI', sans-serif;">
                    <div style="width: 250px; background-color: white; border-right: 1px solid #e0e0e0; padding: 15px;">
                        <h3 style="margin-bottom: 15px;">Folders</h3>
                        <ul style="list-style-type: none; padding: 0;">
                            <li style="padding: 10px; border-radius: 4px; background-color: #f0f0f0; margin-bottom: 5px;">Inbox</li>
                            <li style="padding: 10px; border-radius: 4px; margin-bottom: 5px;">Sent Items</li>
                            <li style="padding: 10px; border-radius: 4px; margin-bottom: 5px;">Drafts</li>
                            <li style="padding: 10px; border-radius: 4px; margin-bottom: 5px;">Junk</li>
                        </ul>
                    </div>
                    <div style="flex-grow: 1; display: flex;">
                        <div style="width: 350px; background-color: white; border-right: 1px solid #e0e0e0; padding: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                <h3>Inbox</h3>
                                <button style="background: none; border: none;">🔍</button>
                            </div>
                            <div style="border-bottom: 1px solid #e0e0e0; padding: 10px;">
                                <strong>Microsoft Team</strong>
                                <p style="color: #666;">Weekly Update</p>
                            </div>
                            <div style="border-bottom: 1px solid #e0e0e0; padding: 10px;">
                                <strong>News Alert</strong>
                                <p style="color: #666;">Latest Technology News</p>
                            </div>
                        </div>
                        <div style="flex-grow: 1; background-color: white; padding: 15px;">
                            <h2>Email Content</h2>
                            <p>Select an email to view its contents.</p>
                        </div>
                    </div>
                </div>
            `
        });
    }

    function launchSettings() {
        createWindow({
            title: 'Settings',
            width: 1000,
            height: 700,
            content: `
                <div style="display: flex; height: 100%; font-family: 'Segoe UI', sans-serif;">
                    <div style="width: 250px; background-color: #f3f3f3; padding: 15px; border-right: 1px solid #e0e0e0;">
                        <h2>Settings</h2>
                        <ul style="list-style-type: none; padding: 0;">
                            <li style="padding: 10px; border-radius: 4px; background-color: #e0e0e0; margin-bottom: 5px;">System</li>
                            <li style="padding: 10px; border-radius: 4px; margin-bottom: 5px;">Devices</li>
                            <li style="padding: 10px; border-radius: 4px; margin-bottom: 5px;">Network & Internet</li>
                            <li style="padding: 10px; border-radius: 4px; margin-bottom: 5px;">Personalization</li>
                            <li style="padding: 10px; border-radius: 4px; margin-bottom: 5px;">Apps</li>
                            <li style="padding: 10px; border-radius: 4px; margin-bottom: 5px;">Accounts</li>
                        </ul>
                    </div>
                    <div style="flex-grow: 1; padding: 20px;">
                        <h1>System</h1>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px;">
                                <h3>Display</h3>
                                <p>Brightness, color, night light</p>
                                <div style="margin-top: 10px;">
                                    <label>Brightness: </label>
                                    <input type="range" min="0" max="100" value="50">
                                </div>
                            </div>
                            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px;">
                                <h3>Sound</h3>
                                <p>Volume, output devices</p>
                                <div style="margin-top: 10px;">
                                    <label>Volume: </label>
                                    <input type="range" min="0" max="100" value="50">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        });
    }

    // Enhanced Start Menu App Launch Function
    function launchStartMenuApp(appName) {
        // Play click sound
        try {
            sounds.click.play();
        } catch (error) {
            console.log('Audio playback prevented');
        }

        // Close start menu
        startmenu.style.bottom = "-555px";

        // Launch the app using existing launchApp function
        launchApp(appName);
    }

    // Add event listeners to start menu apps after iframe loads
    startmenuIframe.addEventListener('load', () => {
        const startMenuDocument = startmenuIframe.contentDocument || startmenuIframe.contentWindow.document;
        
        // Cache the apps collection to avoid repeated DOM queries
        const startMenuApps = startMenuDocument.querySelectorAll('.app-item');
        
        // Add event listeners to each app
        startMenuApps.forEach(app => {
            app.addEventListener('click', (e) => {
                const appName = app.getAttribute('data-app');
                if (appName) {
                    launchStartMenuApp(appName);
                }
            });
        });
    });

    // Toggle start menu
    document.getElementById("start-button").addEventListener("click", () => {
        console.log("clicked");
        try {
            sounds.click.play();
        } catch (error) {
            console.log('Audio playback prevented');
        }
        
        if(startmenu.style.bottom == "50px"){
            startmenu.style.bottom = "-555px";
        }
        else{
            startmenu.style.bottom = "50px";
        }
    });
    
    // Close start menu when clicking outside
    document.addEventListener('click', (e) => {
        // Check if start menu is open
        if (startmenu.style.bottom === "50px") {
            // Check if click is outside start menu and start button
            if (!e.target.closest('#start-button') && 
                !e.target.closest('.startmenu') && 
                !e.target.closest('#start-menu-iframe')) {
                startmenu.style.bottom = "-555px";
            }
        }
    });

    // Prevent iframe from capturing clicks that should close the start menu
    startmenuIframe.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Toggle widgets panel
    const widgetsButton = document.getElementById('widgets-button');
    const widgetsPanel = document.getElementById('widgets-panel');

    widgetsButton.addEventListener('click', () => {
        try {
            sounds.click.play();
        } catch (error) {
            console.log('Audio playback prevented');
        }
        
        widgetsPanel.classList.toggle('open');
    });

    // Close widgets when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#widgets-button') && !e.target.closest('.widgets-panel') && 
            widgetsPanel.classList.contains('open')) {
            widgetsPanel.classList.remove('open');
        }
    });

    // App Launch Event Listeners
    document.querySelectorAll('.desktop-icon, .taskbar-icon, .app-item').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const appName = icon.getAttribute('data-app') || icon.querySelector('span')?.textContent.toLowerCase();
            if (appName) {
                launchApp(appName);
            }
        });
    });

    // Initialize system on page load
    setTimeout(startupSequence, 1000);
});