const colorPalette = [
    'a3e635', '60a5fa', 'f87171', 'fbbf24', 'c084fc',
    '34d399', 'fb923c', 'f472b6', '67e8f9',
];

const stringToHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash);
};

export const getProductImage = (productName) => {
    const words = productName.split(' ');
    const longWords = words.filter(w => w.length > 2);
    let displayText = longWords.length > 0 ? longWords[0] : words[0] || 'Product';
    displayText = displayText.charAt(0).toUpperCase() + displayText.slice(1);

    const hash = stringToHash(productName);
    const backgroundColor = colorPalette[hash % colorPalette.length];
    const textColor = '333';

    return `https://placehold.co/600x400/${backgroundColor}/${textColor}?text=${encodeURIComponent(displayText)}`;
};