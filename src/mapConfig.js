const categoricalColors = [
    '#e41a1c', '#377eb8', '#4daf4a', '#984ea3',
    '#ff7f00', '#ffff33', '#a65628', '#f781bf',
    '#999999', '#66c2a5', '#fc8d62', '#8da0cb'
];

export const layerConfig = {
    'Potensi': {
        title: 'Potensi Air Tanah',
        dataKey: 'Potensi',
        getColor: v => {
            const num = Number(v);
            if (isNaN(num)) return '#808080';
            if (num >= 5) return '#2b83ba';
            if (num >= 4) return '#abdda4';
            if (num >= 3) return '#ffffbf';
            if (num >= 2) return '#fdae61';
            return '#d7191c';
        },
        legend: [
            { color: '#2b83ba', label: 'Sangat Tinggi (5)' },
            { color: '#abdda4', label: 'Tinggi (4)' },
            { color: '#ffffbf', label: 'Sedang (3)' },
            { color: '#fdae61', label: 'Rendah (2)' },
            { color: '#d7191c', label: 'Sangat Rendah (1)' }
        ],
        getChartLabel: v => {
            const labels = { 1: 'Sangat Rendah', 2: 'Rendah', 3: 'Sedang', 4: 'Tinggi', 5: 'Sangat Tinggi' };
            return labels[v] || v;
        }
    },
    'Elevation': {
        title: 'Elevasi (mdpl)',
        dataKey: 'Elevation',
        getColor: v => {
            const num = Number(v);
            if (isNaN(num)) return '#808080';
            if (num > 1000) return '#5e3c99';
            if (num > 500) return '#b2abd2';
            if (num > 200) return '#f7f7f7';
            if (num > 50) return '#d8daeb';
            return '#fde0ef';
        },
        legend: [
            { color: '#5e3c99', label: '> 1000m' },
            { color: '#b2abd2', label: '500-1000m' },
            { color: '#f7f7f7', label: '200-500m' },
            { color: '#d8daeb', label: '50-200m' },
            { color: '#fde0ef', label: '< 50m' }
        ]
    },
    'Slope': {
        title: 'Kemiringan Lereng',
        dataKey: 'Slope',
        getColor: v => {
            const num = Number(v);
            if (isNaN(num)) return '#808080';
            if (num > 40) return '#d7191c';
            if (num > 25) return '#fdae61';
            if (num > 15) return '#ffffbf';
            if (num > 5) return '#abdda4';
            return '#2b83ba';
        },
        legend: [
            { color: '#d7191c', label: 'Sgt. Curam (>40°)' },
            { color: '#fdae61', label: 'Curam (25-40°)' },
            { color: '#ffffbf', label: 'Miring (15-25°)' },
            { color: '#abdda4', label: 'Landai (5-15°)' },
            { color: '#2b83ba', label: 'Datar (0-5°)' }
        ]
    },
    'NDVI': {
        title: 'Indeks Vegetasi (NDVI)',
        dataKey: 'NDVI',
        getColor: v => {
            const num = Number(v);
            if (isNaN(num)) return '#808080';
            if (num > 0.8) return '#00441b';
            if (num > 0.6) return '#238b45';
            if (num > 0.4) return '#66c2a4';
            if (num > 0.2) return '#b2e2e2';
            return '#edf8fb';
        },
        legend: [
            { color: '#00441b', label: '> 0.8' },
            { color: '#238b45', label: '0.6 - 0.8' },
            { color: '#66c2a4', label: '0.4 - 0.6' },
            { color: '#b2e2e2', label: '0.2 - 0.4' },
            { color: '#edf8fb', label: '< 0.2' }
        ]
    },
    'Rainfall': {
        title: 'Curah Hujan (mm/tahun)',
        dataKey: 'Rainfall',
        getColor: v => {
            const num = Number(v);
            if (isNaN(num)) return '#808080';
            if (num > 3000) return '#081d58';
            if (num > 2500) return '#253494';
            if (num > 2000) return '#225ea8';
            if (num > 1500) return '#1d91c0';
            return '#41b6c4';
        },
        legend: [
            { color: '#081d58', label: '> 3000' },
            { color: '#253494', label: '2500-3000' },
            { color: '#225ea8', label: '2000-2500' },
            { color: '#1d91c0', label: '1500-2000' },
            { color: '#41b6c4', label: '< 1500' }
        ]
    },
    'TWI': {
        title: 'Indeks Topografi Basah',
        dataKey: 'TWI',
        getColor: v => {
            const num = Number(v);
            if (isNaN(num)) return '#808080';
            if (num > 15) return '#0c2c84';
            if (num > 10) return '#225ea8';
            if (num > 5) return '#1d91c0';
            if (num > 2) return '#7fcdbb';
            return '#ccece6';
        },
        legend: [
            { color: '#0c2c84', label: '> 15' },
            { color: '#225ea8', label: '10 - 15' },
            { color: '#1d91c0', label: '5 - 10' },
            { color: '#7fcdbb', label: '2 - 5' },
            { color: '#ccece6', label: '< 2' }
        ]
    },
    'Curvature': {
        title: 'Kelengkungan',
        dataKey: 'Curvature',
        getColor: v => {
            const num = Number(v);
            if (isNaN(num)) return '#808080';
            if (num > 0.5) return '#d73027';
            if (num > 0.1) return '#fc8d59';
            if (num > -0.1) return '#fee08b';
            if (num > -0.5) return '#91cf60';
            return '#1a9850';
        },
        legend: [
            { color: '#d73027', label: 'Sgt. Cembung' },
            { color: '#fc8d59', label: 'Cembung' },
            { color: '#fee08b', label: 'Datar' },
            { color: '#91cf60', label: 'Cekung' },
            { color: '#1a9850', label: 'Sgt. Cekung' }
        ]
    },
    'Aspect': {
        title: 'Aspek Lereng',
        dataKey: 'Aspect',
        getColor: v => categoricalColors[Math.floor(Number(v)) % categoricalColors.length] || '#cccccc',
        legend: categoricalColors.map((color, index) => ({ color, label: `Kelas ${index + 1}` }))
    },
    'Jenis Tanah': {
        title: 'Jenis Tanah',
        dataKey: 'Jenis Tanah',
        getColor: v => categoricalColors[Math.floor(Number(v)) % categoricalColors.length] || '#cccccc',
        legend: categoricalColors.map((color, index) => ({ color, label: `Kelas ${index + 1}` }))
    },
    'LULC': {
        title: 'Tutupan Lahan',
        dataKey: 'LULC',
        getColor: v => categoricalColors[Math.floor(Number(v)) % categoricalColors.length] || '#cccccc',
        legend: categoricalColors.map((color, index) => ({ color, label: `Kelas ${index + 1}` }))
    },
    'Litologi': {
        title: 'Litologi',
        dataKey: 'Litologi',
        getColor: v => categoricalColors[Math.floor(Number(v)) % categoricalColors.length] || '#cccccc',
        legend: categoricalColors.map((color, index) => ({ color, label: `Kelas ${index + 1}` }))
    },
    'Tekstur Tanah': {
        title: 'Tekstur Tanah',
        dataKey: 'Tekstur Tanah',
        getColor: v => categoricalColors[Math.floor(Number(v)) % categoricalColors.length] || '#cccccc',
        legend: categoricalColors.map((color, index) => ({ color, label: `Kelas ${index + 1}` }))
    },
};

export const detailChartLayers = [
    'Potensi', 'Elevation', 'Slope', 'NDVI', 'Rainfall', 'TWI', 'Curvature'
];