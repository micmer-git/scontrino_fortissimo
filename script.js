const imageInput = document.getElementById('imageInput');
const analyzeButton = document.getElementById('analyzeButton');
const resultsDiv = document.getElementById('results');

analyzeButton.addEventListener('click',   
 () => {
    const file = imageInput.files[0];
    if (!file) {
        alert("Please select an image first.");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const base64Image = reader.result.split(',')[1];

        const prompt = `***
"Provide a comprehensive nutritional analysis of the grocery list in the image. Include the following:
1. A detailed table with these columns:   - Nutrient   - Total amount   - Percentage of Daily Value (based on a 2000 kcal diet)   - Top 3 contributing foods with their percentage of the total
2. Calculate precise values for:   - Macronutrients: Calories, Protein, Carbohydrates, Fat, Fiber   - Micronutrients: Calcium, Iron, Vitamins A, C, D, E, K, B12, Potassium, Sodium, Magnesium, Zinc, Selenium
3. Make reasonable assumptions about missing product information, but clearly state these assumptions.
4. List any unclear or missing information about products that would improve the accuracy of the analysis.
5. Provide a brief summary of key nutritional observations.
6. Double-check all calculations for accuracy and consistency.
7. Use standard nutritional databases for calculations if specific product information is not available.
8. Include a note about any potential nutritional imbalances or excesses.
9. Assume the egg whites are 500g unless otherwise specified.
Please reanalyze the grocery list with these guidelines, paying special attention to computational consistency and detail. If you need any clarification on specific products or quantities, please ask.".
***`;

        const data = {
            "model": "claude-2", // or the appropriate model name
            "messages": [
                { "role": "user", "content": prompt },
                { "role": "user", "content": `[Image of grocery list]` }, // Replace with how you send the image data
            ]
        };

        fetch('https://api.anthropic.com/v1/complete', { // Replace with your Claude.ai API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_CLAUDE_API_KEY' // Replace with your actual API key
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            resultsDiv.innerHTML = data.completion; // Assuming the response structure
        })
        .catch(error => {
            console.error('Error:', error);
            resultsDiv.innerHTML = "An error occurred while processing the request.";
        });
    };
    reader.readAsDataURL(file);
});
