// Function to darken a given color
function darkenColor(color, percent) {
    var num = parseInt(color.slice(1), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) - amt,
        G = (num >> 8 & 0x00FF) - amt,
        B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 0 ? 0 : R > 255 ? 255 : R) * 0x10000 + 
                  (G < 0 ? 0 : G > 255 ? 255 : G) * 0x100 + 
                  (B < 0 ? 0 : B > 255 ? 255 : B)).toString(16).slice(1).toUpperCase();
}

// Example usage
document.addEventListener("DOMContentLoaded", function() {
    // Define the original color
    var originalColor = "#FF0000"; // Red color example
    
    // Darken the color by 30%
    var darkenedColor = darkenColor(originalColor, 30);
    
    // Apply the darkened color to elements as needed
    document.body.style.backgroundColor = darkenedColor;
    
    // Additional example
    var headerText = document.querySelector(".header-text");
    if (headerText) {
        headerText.style.color = darkenColor("#0000FF", 30); // Darken blue color by 30%
    }
});
