
document.addEventListener('DOMContentLoaded', () => {
    // Only init if not already present
    if (document.getElementById('boma-editor')) return;

    const editorHTML = `
        <div id="boma-editor" style="position: fixed; top: 100px; right: 20px; width: 300px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid #ccc; border-radius: 12px; padding: 20px; z-index: 10000; box-shadow: 0 10px 30px rgba(0,0,0,0.2); font-family: sans-serif; transition: transform 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 1.2rem; color: #333;">Editor Visual</h3>
                <button id="toggle-editor" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;">➖</button>
            </div>
            
            <div id="editor-content">
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 0.9rem; text-transform: uppercase; color: #666;">Tipografía</h4>
                    
                    <label style="display: block; font-size: 0.8rem; margin-bottom: 5px;">Texto Base (px)</label>
                    <input type="range" id="body-size" min="12" max="24" step="1" style="width: 100%;">
                    <span id="body-size-val" style="font-size: 0.8rem; float: right;"></span>
                    
                    <label style="display: block; font-size: 0.8rem; margin-top: 10px; margin-bottom: 5px;">Título Hero (rem)</label>
                    <input type="range" id="hero-size" min="2" max="6" step="0.1" style="width: 100%;">
                    <span id="hero-size-val" style="font-size: 0.8rem; float: right;"></span>

                    <label style="display: block; font-size: 0.8rem; margin-top: 10px; margin-bottom: 5px;">Títulos Sección (rem)</label>
                    <input type="range" id="section-size" min="1.5" max="5" step="0.1" style="width: 100%;">
                    <span id="section-size-val" style="font-size: 0.8rem; float: right;"></span>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 0.9rem; text-transform: uppercase; color: #666;">Reordenar Secciones</h4>
                    <ul id="section-list" style="list-style: none; padding: 0; margin: 0;">
                        <!-- JS creates list here -->
                    </ul>
                </div>

                <button id="save-changes" style="width: 100%; padding: 10px; background: #366299; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">💾 Guardar Cambios</button>
                <div id="save-status" style="margin-top: 10px; font-size: 0.8rem; text-align: center; color: #666;"></div>
            </div>
        </div>
        <button id="open-editor-btn" style="position: fixed; top: 100px; right: 20px; z-index: 10000; background: #366299; color: white; border: none; padding: 10px 15px; border-radius: 50px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: none;">✏️ Editar</button>
    `;

    document.body.insertAdjacentHTML('beforeend', editorHTML);

    // -- LOGIC --

    const root = document.documentElement;
    const bodySizeInput = document.getElementById('body-size');
    const heroSizeInput = document.getElementById('hero-size');
    const sectionSizeInput = document.getElementById('section-size');

    // Init values
    const getVal = (prop) => getComputedStyle(root).getPropertyValue(prop).trim();

    bodySizeInput.value = parseFloat(getVal('--body-font-size')) || 15;
    document.getElementById('body-size-val').innerText = bodySizeInput.value + 'px';

    heroSizeInput.value = parseFloat(getVal('--hero-font-size')) || 3.5;
    document.getElementById('hero-size-val').innerText = heroSizeInput.value + 'rem';

    sectionSizeInput.value = parseFloat(getVal('--section-title-size')) || 3;
    document.getElementById('section-size-val').innerText = sectionSizeInput.value + 'rem';

    // Listeners
    bodySizeInput.addEventListener('input', (e) => {
        root.style.setProperty('--body-font-size', e.target.value + 'px');
        document.getElementById('body-size-val').innerText = e.target.value + 'px';
    });

    heroSizeInput.addEventListener('input', (e) => {
        root.style.setProperty('--hero-font-size', e.target.value + 'rem');
        document.getElementById('hero-size-val').innerText = e.target.value + 'rem';
    });

    sectionSizeInput.addEventListener('input', (e) => {
        root.style.setProperty('--section-title-size', e.target.value + 'rem');
        document.getElementById('section-size-val').innerText = e.target.value + 'rem';
    });

    // Reorder Logic
    const main = document.querySelector('main');
    const sections = Array.from(main.querySelectorAll('section[id]'));
    const list = document.getElementById('section-list');

    function renderList() {
        list.innerHTML = '';
        const currentSections = Array.from(main.querySelectorAll('section'));

        currentSections.forEach((sec, index) => {
            if (!sec.id && !sec.className) return; // Skip minor wrappers if any

            const name = sec.id || sec.className || `Sección ${index}`;
            const li = document.createElement('li');
            li.style.cssText = "padding: 8px; background: #eee; margin-bottom: 5px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;";
            li.innerHTML = `
                <span>${name}</span>
                <div>
                    <button class="move-up" data-idx="${index}" style="cursor: pointer;">⬆️</button>
                    <button class="move-down" data-idx="${index}" style="cursor: pointer;">⬇️</button>
                </div>
            `;
            list.appendChild(li);
        });

        // Add listeners to buttons
        list.querySelectorAll('.move-up').forEach(btn => {
            btn.addEventListener('click', () => moveSection(parseInt(btn.dataset.idx), -1));
        });
        list.querySelectorAll('.move-down').forEach(btn => {
            btn.addEventListener('click', () => moveSection(parseInt(btn.dataset.idx), 1));
        });
    }

    function moveSection(index, direction) {
        const currentSections = Array.from(main.querySelectorAll('section'));
        if (index + direction < 0 || index + direction >= currentSections.length) return;

        const sec = currentSections[index];
        const swapSec = currentSections[index + direction];

        if (direction === -1) {
            main.insertBefore(sec, swapSec);
        } else {
            main.insertBefore(swapSec, sec);
        }
        renderList();
    }

    renderList();

    // Toggle UI
    const editorEl = document.getElementById('boma-editor');
    const toggleBtn = document.getElementById('toggle-editor');
    const openBtn = document.getElementById('open-editor-btn');

    toggleBtn.addEventListener('click', () => {
        editorEl.style.display = 'none';
        openBtn.style.display = 'block';
    });

    openBtn.addEventListener('click', () => {
        editorEl.style.display = 'block';
        openBtn.style.display = 'none';
    });

    // Save Logic
    document.getElementById('save-changes').addEventListener('click', async () => {
        const status = document.getElementById('save-status');
        status.innerText = "Guardando...";

        try {
            // Check for File System Access API
            if ('showDirectoryPicker' in window) {
                const handle = await window.showDirectoryPicker();

                // 1. Read and Update CSS
                // We need to fetch the original CSS or just regex replace the 3 variables
                let cssContent = await (await fetch('style.css')).text();

                cssContent = cssContent.replace(/--body-font-size:\s*[^;]+;/, `--body-font-size: ${bodySizeInput.value}px;`);
                cssContent = cssContent.replace(/--hero-font-size:\s*[^;]+;/, `--hero-font-size: ${heroSizeInput.value}rem;`);
                cssContent = cssContent.replace(/--section-title-size:\s*[^;]+;/, `--section-title-size: ${sectionSizeInput.value}rem;`);

                const cssFile = await handle.getFileHandle('style.css', { create: true });
                const cssWritable = await cssFile.createWritable();
                await cssWritable.write(cssContent);
                await cssWritable.close();

                // 2. Update HTML (Order)
                // We need the current HTML but we must be careful not to include the editor itself if it was injected
                // Actually, the editor was injected via JS, so document.documentElement.outerHTML MIGHT not include it if we look at source, 
                // but usually it does in modern browsers if we serialize DOM.
                // Safest bet: Fetch original index.html, parse it, and reorder main children based on current DOM order.

                let htmlContent = await (await fetch('index.html')).text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                const docMain = doc.querySelector('main');

                // Get Current Order of IDs
                const currentOrderIds = Array.from(main.querySelectorAll('section')).map(sec => sec.id || sec.className);

                // Sort docMain children
                const frag = doc.createDocumentFragment();
                currentOrderIds.forEach(id => {
                    // Try ID first
                    let el = docMain.querySelector(`#${id}`);
                    if (!el && id) {
                        // Try class
                        el = docMain.querySelector(`.${id.split(' ')[0]}`);
                    }
                    if (el) frag.appendChild(el);
                });
                // Append anything remaining (that wasn't moved)
                Array.from(docMain.children).forEach(child => {
                    if (!frag.contains(child)) frag.appendChild(child);
                });

                docMain.innerHTML = '';
                docMain.appendChild(frag);

                // Add editor script if not present (it should be there already in our plan)
                if (!doc.body.innerHTML.includes('editor.js')) {
                    const script = doc.createElement('script');
                    script.src = 'editor.js';
                    doc.body.appendChild(script);
                }

                const htmlFile = await handle.getFileHandle('index.html', { create: true });
                const htmlWritable = await htmlFile.createWritable();
                await htmlWritable.write(doc.documentElement.outerHTML);
                await htmlWritable.close();

                status.innerText = "✅ ¡Guardado Exitosamente!";
                setTimeout(() => status.innerText = "", 3000);

            } else {
                alert("Tu navegador no soporta guardado directo. Descargando archivos...");
                // Fallback to download
                downloadString(generateUpdatedCSS(), "text/css", "style.css");
                // downloadString(...) for html
            }
        } catch (err) {
            console.error(err);
            status.innerText = "❌ Error al guardar (o cancelado)";
        }
    });

    function generateUpdatedCSS() {
        // Simple helper for fallback
        // In real usage, we should fetch current style.css styles. 
        // For this demo, assuming we just need to alert the user.
        return "Implementación completa requiere soporte de API de Archivos.";
    }
});
