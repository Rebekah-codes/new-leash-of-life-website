// Auto-load reusable components
async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (element) {
        try {
            const response = await fetch(`/components/${file}`);
            const html = await response.text();
            element.innerHTML = html;
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }
}

loadComponent("site-header", "header.html");
loadComponent("site-nav", "nav.html");
loadComponent("site-footer", "footer.html");
